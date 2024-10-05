import jwt from 'jsonwebtoken';

export const verifyTokenAndRole = (requiredRole) => async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return new Response(JSON.stringify({ message: "Unauthorized, no token provided" }), { status: 401 });
  }

  try {
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = tokenData;

    if (req.user.role !== requiredRole && req.user.role !== 'superAdmin') {
      return new Response(JSON.stringify({ message: "Access denied, insufficient permissions" }), { status: 403 });
    }

    next();
  } catch (error) {
    return new Response(JSON.stringify({ message: "Invalid token, authentication failed" }), { status: 401 });
  }
};
