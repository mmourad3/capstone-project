import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_CODE || "dev_secret";

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message);
    console.log("AUTH HEADER:", authHeader);
    return res.status(401).json({ message: "Invalid token" });
  }
};
