const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  try {
    console.log("Verifying token...");
    console.log("Headers:", req.headers);
    console.log("Cookies:", req.cookies);
    const auth =
      req.headers.authorization || (req.cookies && req.cookies.token);
    if (!auth) return res.status(401).json({ error: "No token provided" });

    const token = auth.startsWith("Bearer ") ? auth.slice(7) : auth;
    const payload = jwt.verify(token, process.env.JWT_SECRET || "change_me");

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
