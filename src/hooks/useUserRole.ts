import { useAuth } from "@/lib/firebase/auth";
import { getDocument } from "@/lib/firebase/db";
import type { UserProfile } from "@/lib/firebase/db";
import { useState, useEffect } from "react";

export const useUserRole = () => {
    const { user, loading: authLoading } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) {
                // 로그인되지 않은 경우 - AuthGuard가 리다이렉트 처리
                setProfile(null);
                setLoading(false);
                return;
            }

            const data = await getDocument<UserProfile>("users", user.uid);
            setProfile(data);
            setLoading(false);
        };

        if (!authLoading) {
            fetchProfile();
        }
    }, [user, authLoading]);

    const isAdmin = profile?.role === 'Admin';
    const isManager = isAdmin; // Admin은 모든 권한 포함
    const isSalesTeam = profile?.team === 'Sales' || isAdmin;
    const isSampleTeam = profile?.team === 'Sample' || isAdmin;
    const isSupportTeam = profile?.team === 'Support' || isAdmin;
    const isDeptHead = profile?.isDeptHead === true;

    return {
        profile,
        loading: authLoading || loading,
        isAdmin,
        isManager,
        isSalesTeam,
        isSampleTeam,
        isSupportTeam,
        isDeptHead,
    };
};
