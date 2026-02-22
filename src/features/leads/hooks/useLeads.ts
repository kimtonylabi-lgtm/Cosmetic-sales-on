'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLeads, createLead, updateLead, deleteLead } from '../actions';
import { Lead } from '@/lib/firebase/db';

export function useLeads() {
    const queryClient = useQueryClient();

    const leadsQuery = useQuery({
        queryKey: ['leads'],
        queryFn: () => getLeads(),
    });

    const createMutation = useMutation({
        mutationFn: (data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => createLead(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leads'] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Lead> }) => updateLead(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leads'] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteLead(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['leads'] });
            const previousLeads = queryClient.getQueryData(['leads']);
            queryClient.setQueryData(['leads'], (old: Lead[] | undefined) => {
                return old?.filter(l => l.id !== id);
            });
            return { previousLeads };
        },
        onError: (err, id, context) => {
            queryClient.setQueryData(['leads'], context?.previousLeads);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['leads'] });
        },
    });

    return {
        leads: leadsQuery.data || [],
        isLoading: leadsQuery.isLoading,
        isError: leadsQuery.isError,
        createLead: createMutation.mutateAsync,
        updateLead: updateMutation.mutateAsync,
        deleteLead: deleteMutation.mutateAsync,
    };
}
