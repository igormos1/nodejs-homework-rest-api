const { SECRET_KEY } = process.env;
const { User } = require("../modals/user");
const { Conflict, Unauthorized } = require("http-errors");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const sendMail = require("../helpers/sendEmail");
const idGenerate = require("bson-objectid");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw new Conflict(`User with ${email} already exist`);
  }

  const avatarURL = gravatar.url(email);
    const verificationToken = idGenerate();
  const newUser = new User({ name, email ,avatarURL,verificationToken});

  newUser.setPassword(password);
  newUser.save();

  const mail = {
    to: email,
    subject: "підтвердження реєстрації",
    html: `<a target="_blank" href="http://localhost:3000/api/auth/verity/${verificationToken}">Підтвердити</a>`,
  };
  sendMail(mail);

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
 if (!user || !user.comparePassword(password) || !user.verify) {
    throw new Unauthorized(`Email or password or not verity is wrong`);
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

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw new Error();
  }
  await User.findByIdAndUpdate(user._id, {
    verificationToken: "",
    verify: true,
  });
  res.json({
    message: "verification successful",
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400).json({ message: "not found" });
  }
  if (user.verify) {
    res.status(400).json({
      message: "Verification has already been passed",
    });
  }
  const mail = {
    to: email,
    subject: "підтвердження реєстрації",
    html: `<a target="_blank" href="http://localhost:3000/api/auth/verity/${user.verificationToken}">Підтвердити</a>`,
  };
  sendMail(mail);
  res.json({
    message: "Verification email sent",
  });
};


module.exports = {
  register,
  login,
  logout,
  singin,
   verifyEmail,
  resendVerifyEmail,
};