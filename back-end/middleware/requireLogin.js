const jwt = require("jsonwebtoken");

const JWT_SECRET =
  process.env.JWT_SECRET;

function requireLogin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).send("Unauthorized: missing token");
  }
  const token = auth.slice(7); // bỏ chuỗi "Bearer "
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user_id = decoded.user_id;
    req.login_name = decoded.login_name;
    return next();
  } catch (err) {
    return res.status(401).send("Unauthorized: invalid token");
  }
}

module.exports = requireLogin;
module.exports.JWT_SECRET = JWT_SECRET;
