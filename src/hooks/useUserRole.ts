import { useAuth } from "@/lib/firebase/auth";
import { getDocument, UserProfile } from "@/lib/firebase/db";
import { useState, useEffect } from "react";

export const useUserRole = () => {
    const { user, loading: authLoading } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (user) {
                const data = await getDocument("users", user.uid);
                if (data) {
                    setProfile(data as UserProfile);
                } else {
                    setProfile({
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                        role: 'Admin', // Default to Admin for first user
                        team: 'Sales',
                        createdAt: null as any
                    });
                }
            } else {
                // DEV BYPASS: Allow viewing dashboard without login for now
                setProfile({
                    uid: 'dev-user',
                    email: 'dev@example.com',
                    displayName: 'Dev User',
                    photoURL: null,
                    role: 'Admin',
                    team: 'Sales',
                    createdAt: null as any
                });
            }
            setLoading(false);
        };

        if (!authLoading) {
            fetchProfile();
        }
    }, [user, authLoading]);

    const isAdmin = profile?.role === 'Admin';
    const isManager = profile?.role === 'Manager' || isAdmin;
    const isSalesTeam = profile?.team === 'Sales';
    const isSampleTeam = profile?.team === 'Sample';
    const isSupportTeam = profile?.team === 'Support';

    return {
        profile,
        loading: authLoading || loading,
        isAdmin,
        isManager,
        isSalesTeam,
        isSampleTeam,
        isSupportTeam
    };
};
