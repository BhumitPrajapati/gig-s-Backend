const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  resMsg,
  isNullUndefineOrEmpthy,
} = require("../../middleware/authMiddleware");

const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!isNullUndefineOrEmpthy(email) && !isNullUndefineOrEmpthy(password)) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ email, password: hashedPassword });
      await newUser.save();
      resMsg(
        res,
        "User registered successfully",
        null,
        null,
        200,
        "api/register"
      );
    } else {
      resMsg(
        res,
        "Please Enter email or Password",
        null,
        null,
        400,
        "api/register"
      );
    }
  } catch (error) {
    resMsg(res, "Something was wrong.", null, error, 500, "api/register");
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!isNullUndefineOrEmpthy(email) && !isNullUndefineOrEmpthy(password)) {
      const user = await User.findOne({ email });
      if (!user)
        return resMsg(res, "Invalid credentials", null, null, 400, "api/login");

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return resMsg(res, "Invalid credentials", null, null, 400, "api/login");

      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      return resMsg(res, "Successfully Login", token, null, 200, "api/login");
    } else {
      resMsg(res, "Incorrect email or password.", null, null, 500, "api/login");
    }
  } catch (error) {
    resMsg(res, "Something went wrong.", null, error, 500, "api/login");
  }
};

module.exports = { register, login };
