const asyncWrapper = require("../middleware/asyncWrapper");
const user = require("../models/user_model");
const httpStatus = require("../utils/http_status_text");
const appErrors = require("../utils/appErrors");
const bcrypt = require("bcryptjs");
const generateJWT = require("../utils/generateJWT");

const getAllUsers = asyncWrapper(async (req, res) => {
  let limit = req.query.limit ?? 10;
  let page = req.query.page ?? 1;
  const users = await user
    .find({}, { __v: 0, password: 0 })
    .skip((page - 1) * limit)
    .limit(limit);
  // console.log(Courses);
  res.json({ status: httpStatus.SUCCESS, data: { users } });
});

const Register = asyncWrapper(async (req, res, next) => {
  console.log(req.body);
  const userExist = await user.findOne({ email: req.body.email });
  if (userExist) {
    const err = new appErrors("User already exist", 400, httpStatus.FAIL);
    return next(err);
  }

  const { firstName, lastName, email, password, role } = req.body;
  //! <==> Password Hashing <==>
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new user({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
  });
  //? <==> genrate JWT token <===>
  const token = await generateJWT({
    email: newUser.email,
    id: newUser._id,
    role: newUser.role,
  });
  newUser.token = token;

  await newUser.save();

  res.status(201).json({
    status: httpStatus.SUCCESS,
    data: {
      course: {
        firstName,
        lastName,
        email,
        role,
        token,
      },
    },
  });
});

const Login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email && !password) {
    const err = new appErrors(
      "Email and password are required",
      404,
      httpStatus.FAIL
    );
    return next(err);
  }
  const userExist = await user.findOne({ email });

  if (!userExist) {
    const err = new appErrors("User not found", 404, httpStatus.FAIL);
    return next(err);
  }
  const matchedPassword = await bcrypt.compare(password, userExist.password);

  if (matchedPassword && userExist) {
    const token = await generateJWT({
      email: userExist.email,
      id: userExist._id,
      role: userExist.role,
    });
    return res.status(200).json({
      status: httpStatus.SUCCESS,
      data: {
        firstName: userExist.firstName,
        lastName: userExist.lastName,
        email: userExist.email,
        role: userExist.role,
        token: token,
      },
    });
  } else {
    const err = new appErrors(
      "Invalid email or password",
      404,
      httpStatus.FAIL
    );
    return next(err);
  }
});

module.exports = {
  getAllUsers,
  Register,
  Login,
};
