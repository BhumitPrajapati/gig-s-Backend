const userInfoSchema = require("../../models/UserInfo");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {
  resMsg,
  isNullUndefineOrEmpthy,
} = require("../../middleware/authMiddleware");

const createUser = async (req, res) => {
  const {
    firstName,
    lastName,
    location,
    department,
    skills,
    profilePicImageLink,
    email,
    password,
    role,
  } = req.body;
  // console.log(req.body);

  const userNameInitials = firstName.substring(0, 4);
  userId = userNameInitials + crypto.randomBytes(5).toString("hex");
  // console.log(userId);

  try {
    if (!isNullUndefineOrEmpthy(email) && !isNullUndefineOrEmpthy(password)) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new userInfoSchema({
        userId,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        location,
        profilePicImageLink,
        department,
        skills,
        role
      });
      await newUser.save();
      resMsg(
        res,
        "User registered successfully",
        null,
        null,
        200,
        "api/createUser"
      );
    } else {
      resMsg(
        res,
        "Please Enter email or Password",
        null,
        null,
        400,
        "api/createUser"
      );
    }
  } catch (error) {
    console.log(error);
    resMsg(res, "Something was wrong.", null, error, 500, "api/createUser");
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!isNullUndefineOrEmpthy(email) && !isNullUndefineOrEmpthy(password)) {
      const user = await userInfoSchema.findOne({ email });
      if (!user)
        return resMsg(res, "Invalid credentials", null, null, 400, "api/login");

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return resMsg(res, "Invalid credentials", null, null, 400, "api/login");

      const token = jwt.sign(
        { userId: user.userId, email: user.email, role: user.role },
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

module.exports = { createUser, login };
