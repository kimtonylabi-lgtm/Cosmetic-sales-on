import { createDocument, WorkLogCategory, UserTeam } from "./firebase/db";

/**
 * 사용자 활동을 WorkLog 컬렉션에 기록합니다.
 */
export const logActivity = async (
    user: { uid: string; displayName: string | null; team: UserTeam },
    action: string,
    content: string,
    category: WorkLogCategory = 'System',
    metadata?: Record<string, any>
) => {
    try {
        await createDocument("workLogs", {
            userId: user.uid,
            userName: user.displayName || 'Anonymous',
            team: user.team,
            category,
            action,
            content,
            metadata,
        });
    } catch (error) {
        // 비즈니스 로직에 영향을 주지 않도록 에러는 로깅만 수행
        console.error("Failed to log activity:", error);
    }
};
