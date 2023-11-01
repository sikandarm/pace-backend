const fs = require("fs");
const path = require("path");

const { Contact, sequelize } = require("../models");
const { errorResponse, successResponse } = require("../utils/apiResponse");

exports.createContact = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { firstName, lastName, email, phoneNumber } = req.body;

    const contact = await Contact.create(
      {
        firstName,
        lastName,
        email,
        phoneNumber,
      },
      { transaction }
    );

    await transaction.commit();

    return successResponse(
      res,
      201,
      { contact },
      "Contact created successfully"
    );
  } catch (err) {
    await transaction.rollback();
    return errorResponse(res, 400, "Something went wrong", err);
  }
};

exports.updateContact = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const contactId = req.params.id;
    const { firstName, lastName, email, phoneNumber } = req.body;
    const user = req.user;

    const contact = await Contact.findByPk(contactId);

    if (!contact) {
      return errorResponse(res, 404, "Contact not found");
    }

    // Assuming your Contact model has a 'status' field
    const previousStatus = contact.status;

    // Update contact fields
    contact.firstName = firstName;
    contact.lastName = lastName;
    contact.email = email;
    contact.phoneNumber = phoneNumber;

    await contact.save({ transaction });

    await transaction.commit();

    return successResponse(
      res,
      200,
      { contact },
      "Contact updated successfully"
    );
  } catch (err) {
    console.error(err);
    await transaction.rollback();
    return errorResponse(res, 500, "Something went wrong", err);
  }
};

exports.getAllcontact = async (req, res) => {
  try {
    const name = req.query.firstName;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    let whereClause = {};

    if (name) {
      whereClause = { firstName: name };
    }
    const totalCount = await Contact.count({ where: whereClause });
    const totalPages = Math.ceil(totalCount / pageSize);
    const offset = (page - 1) * pageSize;
    const contacts = await Contact.findAll({
      where: whereClause,
      offset: offset,
    });

    if (!contacts || contacts.length === 0) {
      return successResponse(res, 200, { contacts: [], totalPages });
    }

    const modifiedContacts = contacts.map((contact) => {
      return {
        id: contact.id,
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phoneNumber: contact.phoneNumber,
      };
    });

    return successResponse(res, 200, {
      contacts: modifiedContacts,
      page: (totalPages, req.query.page),
    });
  } catch (err) {
    console.error(err);
    return errorResponse(res, 500, "Something went wrong", err);
  }
};

exports.getContact = async (req, res) => {
  try {
    const { id, firstName } = req.params;

    if (id) {
      const contactById = await Contact.findByPk(id);
      if (contactById) {
        return successResponse(res, 200, { contact: contactById });
      }
    }

    if (firstName) {
      const contactByName = await Contact.findAll({ where: { firstName } });
      if (contactByName) {
        return successResponse(res, 200, { contact: contactByName });
      }
    }

    // No contacts found
    return successResponse(res, 200, { contact: {} }, "No contacts found");
  } catch (err) {
    return errorResponse(res, 400, "Something went wrong!", err);
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const contactId = req.params.id;
    const contact = await Contact.findByPk(contactId);

    if (!contact) {
      return successResponse(res, 200, { contact: {} }, "No contact found");
    }

    const deletedContact = await contact.destroy();

    if (deletedContact) {
      return successResponse(res, 200, null, "Contact deleted successfully");
    }

    return errorResponse(res, 400, "Failed to delete the contact");
  } catch (err) {
    console.error(err);
    return errorResponse(res, 500, "Error while deleting contact", err);
  }
};

// exports.exportContacts = async (req, res) => {
//   try {
//     const conatct = await Contacts.findAll();
//     return successResponse(res, 200, contact);
//   } catch (err) {
//     console.log(err);
//     return errorResponse(res, 400, "Something went wrong", err);
//   }
// };

// exports.importContacts = async (req, res) => {
//   try {
//     const contactData = req.body;
//     const contact = await Contact.bulkCreate(contactData);
//     return successResponse(
//       res,
//       200,
//       contact,
//       "contacts imported successfully."
//     );
//   } catch (err) {
//     console.log(err);
//     return errorResponse(res, 400, "Something went wrong", err);
//   }
// };
