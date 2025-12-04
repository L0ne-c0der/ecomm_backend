const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  try {
    // Accept access token either via Authorization header (preferred) or a dedicated accessToken cookie.
    // DO NOT treat refreshToken cookie as an access JWT.
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies && req.cookies.accessToken;
    const raw =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : cookieToken;

    if (!raw) return res.status(401).json({ error: "No token provided" });

    const payload = jwt.verify(raw, process.env.JWT_SECRET || "change_me");
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

exports.requireRole = (role) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });
  if (req.user.role !== role)
    return res.status(403).json({ error: "Forbidden" });
  next();
};
