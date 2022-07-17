const { SECRET_KEY } = process.env;
const { User } = require("../modals/user");
const { Conflict, Unauthorized } = require("http-errors");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw new Conflict(`User with ${email} already exist`);
  }

  const avatarURL = gravatar.url(email);
  const newUser = new User({ name, email ,avatarURL});

  newUser.setPassword(password);
  newUser.save();

  res.status(201).json({
    status: "success",
    code: 201,
    data: {
      user: {
        email,
        name,
        avatarURL,
      },
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  console.log(user.comparePassword(password));
  if (!user || !user.comparePassword(password)) {
    throw new Unauthorized(`Email or password is wrong`);
  }

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    status: "success",
    code: 200,
    data: {
      token,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).json();
};

const singin = async (req, res) => {
  const allUser = await User.find({});
  const logined = allUser.find((item) => item.token !== null);
  const { token, email, subscription } = logined;
  res.status(200).json({
    data: {
      token,
      user: {
        email,
        subscription,
      },
    },
  });
};

module.exports = {
  register,
  login,
  logout,
  singin,
};