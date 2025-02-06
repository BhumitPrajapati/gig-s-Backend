const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

const resMsg = (res, message, data, error, statusCode, url) => {
  const response = { message, data, error, statusCode, url };
  return res.status(statusCode).json(response);
};

const isNullUndefineOrEmpthy = (parms) => {
  if (parms == undefined || parms == null || parms == "") return true;
  else return false;
};

module.exports = { authMiddleware, resMsg, isNullUndefineOrEmpthy };
