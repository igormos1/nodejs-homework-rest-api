const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/user.js");
const { authValidation, ctrlWrapper, subscribe } = require("../../middleWares");

router.get("/current", authValidation, ctrlWrapper(ctrl.getCurrent));

router.patch(
  "/",
  ctrlWrapper(subscribe),
  authValidation,
  ctrlWrapper(ctrl.updateSubscription)
);
module.exports = router;