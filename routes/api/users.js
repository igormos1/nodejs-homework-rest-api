const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/user.js");
const { authValidation, ctrlWrapper, subscribe,upload } = require("../../middleWares");

router.get("/current", authValidation, ctrlWrapper(ctrl.getCurrent));

router.patch(
  "/",
  ctrlWrapper(subscribe),
  authValidation,
  ctrlWrapper(ctrl.updateSubscription)
);
router.patch(
  "/avatars",
  authValidation,
  upload.single("avatar"),

  ctrlWrapper(ctrl.updateAvatar)
);
module.exports = router;