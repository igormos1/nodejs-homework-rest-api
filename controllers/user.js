const { User } = require("../modals/user");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");

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

const avatarDir = path.join(__dirname, "../", "public", "avatars");
const updateAvatar = async (req, res) => {
  const { path: tempUpload, originalname } = req.file;
  const { _id: id } = req.user;
  const imageName = `${id}_${originalname}`;

  try {
    const resultUpload = path.join(avatarDir, imageName);
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join("public", "avatars", imageName);

    Jimp.read(avatarURL)
      .then((image) => {
        return image
          .resize(250, 250) // resize
          .quality(60) // set JPEG quality
          .write(avatarURL);
      })
      .catch((err) => {
        throw err;
      });
    await User.findByIdAndUpdate(req.user._id, { avatarURL });
    res.json({
      avatarURL,
    });
  } catch (error) {
    await fs.unlink(tempUpload);
    throw error;
  }
};

module.exports = { getCurrent, updateSubscription ,updateAvatar};