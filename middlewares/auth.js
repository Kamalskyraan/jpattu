import jwt from "jsonwebtoken";

export const verifyUser = (req, res, next) => {
  // const { Authorization } = req.headers;
  // const token = Authorization.split(" ")[1];
  const token = req.cookies?.auth;

  if (token) {
    const data = jwt.verify(token, process.env.TOKEN_SECRET);
    if (data.id) {
      req.user_id = data.user_id;
      req.role = data.role;
      next();
    } else {
      res.status(401).json({ message: "Invalid Token" });
    }
  } else {
    res.status(401).json({ message: "Token is required" });
  }
};

export const verifyAdmin = (req, res, next) => {
  // const { Authorization } = req.headers;
  // const token = Authorization.split(" ")[1];
  const token = req.cookies?.auth;

  if (token) {
    const data = jwt.verify(token, process.env.TOKEN_SECRET);
    if (data?.role !== "admin") {
      res.status(403).json({ message: "Action cannot be done!" });
    } else if (data?.id) {
      req.user_id = data.user_id;
      req.role = data.role;
      next();
    } else {
      res.status(401).json({ message: "Invalid Token" });
    }
  } else {
    res.status(401).json({ message: "Token is required" });
  }
};
