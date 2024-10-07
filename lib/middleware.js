import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import User from '@/models/User';

export const verifyTokenAndRole = (requiredRole) => {
    return async (req) => {
        const { isAuthenticated, getUser } = await getKindeServerSession(req);
        const user = await getUser();

        // Check if user is authenticated
        if (!isAuthenticated) {
            return { success: false, message: 'Unauthorized', status: 401 };
        }

        // Fetch user data
        const userData = await User.findOne({ email: user.email });

        // Check if user data is found
        if (!userData) {
            return { success: false, message: 'User not found', status: 404 };
        }

        // Check if the user has the required role
        if (userData.role !== requiredRole) {
            return { success: false, message: 'Forbidden: Insufficient permissions', status: 403 };
        }

        // Attach user data to request (optional)
        req.user = userData;

        return true; // Return success status and modified request
    };
};
