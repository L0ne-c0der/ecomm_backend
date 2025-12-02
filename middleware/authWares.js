const ensureOwnerOrAdmin = (req, res, next) => {
  const userIdParam = req.params.userId || req.params.id;
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });
  if (req.user.role === "admin" || req.user.id === userIdParam) return next();
  return res.status(403).json({ error: "Forbidden" });
};

module.exports = { ensureOwnerOrAdmin };
