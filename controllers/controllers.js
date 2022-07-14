const Contact = require("../modals/modals");

const getContacts = async (req, res, next) => {
  const { _id } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  let result = await Contact.find({ owner: _id }, "", {
    skip,
    limit: Number(limit),
  }).populate("owner", "_id name email");
  const { favorite } = req.query;
  if (favorite) {
    console.log(favorite);
    result = await Contact.find({ owner: _id, favorite: true }, "", {
      skip,
      limit: Number(limit),
    }).populate("owner", "_id name email");
  }
  res.status(200).json({
    status: "success",
    code: 200,
    data: {
      result,
    },
  });
};

const getContact = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);
  if (!contact) {
    res.status(404).json({
      message: `Not found contact with ${contactId} id`,
    });
  } else {
    res.status(200).json({
      result: contact,
    });
  }
};

const postContact = async (req, res, next) => {
  const { _id } = req.user;
  const newContact = await Contact.create({ ...req.body, owner: _id });
  res.status(200).json({
    status: "success",
    code: 201,
    result: newContact,
  });
};

const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  const removedContact = await Contact.findByIdAndRemove(contactId);
  if (!removedContact) {
    res.status(404).json({
      message: "Not found",
    });
  } else {
    res.status(200).json({
      status: "success",
      code: 200,
      message: "contact deleted",
    });
  }
};

const putContact = async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  res.status(200).json({
    status: "success",
    code: 200,
    result: contact,
  });
};

const updateStatus = async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  const contact = await Contact.findByIdAndUpdate(
    contactId,
    { favorite },
    { new: true }
  );
  if (!contact) {
    res.status(404).json({ message: "Not found" });
  } else {
    res.status(200).json({
      status: "success",
      code: 200,
      result: contact,
    });
  }
};

module.exports = {
  getContacts,
  getContact,
  postContact,
  deleteContact,
  putContact,
  updateStatus,
};