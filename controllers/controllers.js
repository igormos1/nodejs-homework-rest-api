const contactsOperations = require("../service/contacts");

const getContacts = async (req, res, next) => {
  const list = await contactsOperations.listContacts();
  res.status(200).json({
    result: list,
  });
};

const getContact = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await contactsOperations.getContactById(contactId);
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
  const newContact = await contactsOperations.addContact(req.body);
  res.status(200).json({
    result: newContact,
  });
};

const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  const removedContact = await contactsOperations.removeContact(contactId);
  if (!removedContact) {
    res.status(404).json({
      message: "Not found",
    });
  } else {
    res.status(200).json({
      message: "contact deleted",
    });
  }
};

const putContact = async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await contactsOperations.updateContact(contactId, req.body);
  res.status(200).json({
    result: contact,
  });
};

module.exports = {
  getContacts,
  getContact,
  postContact,
  deleteContact,
  putContact,
};