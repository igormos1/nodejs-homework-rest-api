const express = require("express");
const router = express.Router();
const auth = require("../../controllers/auth");
const {
  ctrlWrapper,
  authValidation,
  validation,
} = require("../../middleWares");
const { joiRegisterSchema, joiLoginSchema } = require("../../modals/user");

router.post(
  "/signup",
  validation(joiRegisterSchema),
  ctrlWrapper(auth.register)
);

router.post("/login", validation(joiLoginSchema), ctrlWrapper(auth.login));

router.get("/logout", authValidation, ctrlWrapper(auth.logout));
router.get("/login/signin", ctrlWrapper(auth.singin));
module.exports = router;