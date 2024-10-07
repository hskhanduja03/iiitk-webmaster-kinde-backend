import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import User from '@/models/User';

export const verifyTokenAndRole = (requiredRole) => {
    return async (req) => {
        try {
            const { isAuthenticated, getUser } = await getKindeServerSession(req);
            
            if (!isAuthenticated) {
                return { success: false, message: 'Unauthorized', status: 401 };
            }

            const user = await getUser();
            if (!user || !user.email) {
                return { success: false, message: 'User data unavailable', status: 400 };
            }

            const userData = await User.findOne({ email: user.email });

            if (!userData) {
                return { success: false, message: 'User not found', status: 404 };
            }

            if (userData.role !== requiredRole) {
                return { success: false, message: 'Forbidden: Insufficient permissions', status: 403 };
            }

            req.user = userData;

            return { success: true, user: userData };
        } catch (error) {
            console.error('Error verifying token and role:', error);
            return { success: false, message: 'Internal server error', status: 500 };
        }
    };
};
