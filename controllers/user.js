const { User } = require("../modals/user");

const getCurrent = async (req, res) => {
  const { name, email } = req.user;
  res.json({
    status: "success",
    code: 200,
    data: {
      user: { name, email },
    },
  });
};

const updateSubscription = async (req, res) => {
  const { subscription } = req.body;
  const { _id, name } = req.user;

  await User.findByIdAndUpdate(
    { _id },
    { subscription: subscription },
    { new: true }
  );
  res.json({
    status: "success",
    code: 200,
    data: {
      name,
      subscription: subscription,
    },
  });
};

module.exports = { getCurrent, updateSubscription };