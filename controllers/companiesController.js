const { errorResponse, successResponse } = require("../utils/apiResponse");
const { Company, sequelize } = require("../models");

// Create a new company
exports.createCompany = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { name, address, phone, fax, email } = req.body;
    const company = await Company.create(
      {
        name,
        address,
        phone,
        fax,
        email,
        created_by: req.user.id,
      },
      { transaction }
    );

    await transaction.commit();

    return successResponse(
      res,
      201,
      { company },
      "Company created successfully"
    );
  } catch (err) {
    await transaction.rollback();
    return errorResponse(res, 400, "Something went wrong", err);
  }
};

// Update a company
exports.updateCompany = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const companyId = req.params.id;
    const { name, address, phone, fax, email } = req.body;

    const company = await Company.findByPk(companyId);

    if (!company) {
      return errorResponse(res, 404, "Company not found");
    }

    // Update company fields
    company.name = name;
    company.address = address;
    company.phone = phone;
    company.fax = fax;
    company.email = email;
    (company.updated_by = req.user.id), await company.save({ transaction });

    await transaction.commit();

    return successResponse(
      res,
      200,
      { company },
      "Company updated successfully"
    );
  } catch (err) {
    console.error(err);
    await transaction.rollback();
    return errorResponse(res, 500, "Something went wrong", err);
  }
};

// Retrieve all companies or filter by name
exports.getAllCompanies = async (req, res) => {
  try {
    const name = req.query.name;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    let whereClause = {};

    if (name) {
      whereClause = { name };
    }
    const totalCount = await Company.count({ where: whereClause });
    const totalPages = Math.ceil(totalCount / pageSize);
    const offset = (page - 1) * pageSize;
    const companies = await Company.findAll({
      where: whereClause,
      offset: offset,
    });

    if (!companies || companies.length === 0) {
      return successResponse(res, 200, { companies: [], totalPages });
    }

    const modifiedCompanies = companies.map((company) => {
      return {
        id: company.id,
        name: company.name,
        address: company.address,
        phone: company.phone,
        fax: company.fax,
        email: company.email,
        created_by: company.created_by,
        updated_by: company.updated_by,
      };
    });

    return successResponse(res, 200, {
      companies: modifiedCompanies,
      page: page,
    });
  } catch (err) {
    console.error(err);
    return errorResponse(res, 500, "Something went wrong", err);
  }
};

// Retrieve a company by ID or name
exports.getCompany = async (req, res) => {
  try {
    const { id, name } = req.params;

    if (id) {
      const companyById = await Company.findByPk(id);
      if (companyById) {
        return successResponse(res, 200, { company: companyById });
      }
    }

    if (name) {
      const companyByName = await Company.findAll({ where: { name } });
      if (companyByName) {
        return successResponse(res, 200, { company: companyByName });
      }
    }

    // No companies found
    return successResponse(res, 200, { company: {} }, "No companies found");
  } catch (err) {
    return errorResponse(res, 400, "Something went wrong", err);
  }
};

// Delete a company by ID
exports.deleteCompany = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findByPk(companyId);

    if (!company) {
      return successResponse(res, 200, { company: {} }, "No company found");
    }

    // Check if the company order has already been deleted

    company.deletedby = req.user.id;
    company.deletedAt = new Date();

    await company.save();

    return successResponse(
      res,
      200,
      { company },
      "Company deleted successfully"
    );
  } catch (err) {
    return errorResponse(res, 500, "Error while deleting company", err);
  }
};
