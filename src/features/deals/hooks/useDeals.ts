'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDealsByLead, createDeal, updateDealStage } from '../actions';
import { Deal, DealStage } from '@/lib/firebase/db';

export function useDeals(leadId?: string) {
    const queryClient = useQueryClient();

    const dealsQuery = useQuery({
        queryKey: ['deals', leadId],
        queryFn: () => leadId ? getDealsByLead(leadId) : Promise.resolve([]),
        enabled: !!leadId,
    });

    const allDealsQuery = useQuery({
        queryKey: ['deals', 'all'],
        // In a real app, you'd have a getDeals action. For now, we'll mock it or just use per-lead.
        // Let's assume we have a getDeals action or we fetch them all.
        queryFn: async () => {
            // Mocking all deals for the kanban view if leadId is not provided
            const { getLeads } = await import('../../leads/actions');
            const leads = await getLeads();
            const allDeals: Deal[] = [];
            for (const lead of leads) {
                const deals = await getDealsByLead(lead.id);
                allDeals.push(...deals);
            }
            return allDeals;
        },
        enabled: !leadId,
    });

    const createMutation = useMutation({
        mutationFn: (data: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => createDeal(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['deals'] });
        },
    });

    const updateStageMutation = useMutation({
        mutationFn: ({ id, stage }: { id: string; stage: DealStage }) => updateDealStage(id, stage),
        onMutate: async ({ id, stage }) => {
            await queryClient.cancelQueries({ queryKey: ['deals'] });
            const previousDeals = queryClient.getQueryData(['deals', leadId || 'all']);

            queryClient.setQueryData(['deals', leadId || 'all'], (old: Deal[] | undefined) => {
                if (!old) return [];
                return old.map(d => d.id === id ? { ...d, stage } : d);
            });

            return { previousDeals };
        },
        onError: (err, newStage, context) => {
            queryClient.setQueryData(['deals', leadId || 'all'], context?.previousDeals);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['deals'] });
        },
    });

    return {
        deals: leadId ? dealsQuery.data || [] : allDealsQuery.data || [],
        isLoading: leadId ? dealsQuery.isLoading : allDealsQuery.isLoading,
        updateDealStage: updateStageMutation.mutateAsync,
        createDeal: createMutation.mutateAsync,
    };
}
