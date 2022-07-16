const express = require("express");
const router = express.Router();
const {
  joiValidation,
  validationFavorite,
  authValidation,
  ctrlWrapper,
} = require("../../middleWares");

const controllers = require("../../controllers/controllers");

router.get("/", authValidation, ctrlWrapper(controllers.getContacts));

router.get("/:contactId", ctrlWrapper(controllers.getContact));

router.post(
  "/",
  authValidation,
  joiValidation,
  ctrlWrapper(controllers.postContact)
);

router.delete("/:contactId", ctrlWrapper(controllers.deleteContact));

router.put("/:contactId", joiValidation, ctrlWrapper(controllers.putContact));

router.patch(
  "/:contactId/favorite",
  validationFavorite,
  controllers.updateStatus
);

module.exports = router;