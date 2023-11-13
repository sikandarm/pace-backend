const { errorResponse, successResponse } = require("../utils/apiResponse");
const { Vendor, sequelize } = require("../models");
// Create a new vendor
exports.createVendor = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { vendor_name } = req.body;
    const vendor = await Vendor.create(
      {
        vendor_name,
        created_by: req.user.id,
      },
      { transaction }
    );

    await transaction.commit();

    return successResponse(res, 201, { vendor }, "Vendor created successfully");
  } catch (err) {
    await transaction.rollback();
    return errorResponse(res, 400, "Something went wrong", err);
  }
};

// Update a vendor
exports.updateVendor = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const vendorId = req.params.id;
    const { vendor_name } = req.body;

    const vendor = await Vendor.findByPk(vendorId);

    if (!vendor) {
      return errorResponse(res, 404, "Vendor not found");
    }

    // Update vendor fields
    vendor.vendor_name = vendor_name;
    vendor.updated_by = req.user.id;
    await vendor.save({ transaction });

    await transaction.commit();

    return successResponse(res, 200, { vendor }, "Vendor updated successfully");
  } catch (err) {
    console.error(err);
    await transaction.rollback();
    return errorResponse(res, 500, "Something went wrong", err);
  }
};

// Retrieve all vendors or filter by name
exports.getAllVendors = async (req, res) => {
  try {
    const vendorName = req.query.vendor_name;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    let whereClause = {};

    if (vendorName) {
      whereClause = { vendor_name: vendorName };
    }

    const totalCount = await Vendor.count({ where: whereClause });
    const totalPages = Math.ceil(totalCount / pageSize);
    const offset = (page - 1) * pageSize;

    const vendors = await Vendor.findAll({
      where: whereClause,
      offset: offset,
    });

    if (!vendors || vendors.length === 0) {
      return successResponse(res, 200, { vendors: [], totalPages });
    }

    const modifiedVendors = vendors.map((vendor) => {
      return {
        id: vendor.id,
        vendor_name: vendor.vendor_name,
        created_by: vendor.created_by,
        updated_by: vendor.updated_by,
        deleted_by: vendor.deleted_by,
      };
    });

    return successResponse(res, 200, {
      vendors: modifiedVendors,
      totalPages,
    });
  } catch (err) {
    console.error(err);
    return errorResponse(res, 500, "Something went wrong", err);
  }
};

// Retrieve a vendor by ID or name
exports.getVendor = async (req, res) => {
  try {
    const { id, name } = req.params;

    if (id) {
      const vendorById = await Vendor.findByPk(id);
      if (vendorById) {
        return successResponse(res, 200, { vendor: vendorById });
      }
    }

    if (name) {
      const vendorByName = await Vendor.findAll({
        where: { vendor_name: name },
      });
      if (vendorByName && vendorByName.length > 0) {
        return successResponse(res, 200, { vendor: vendorByName[0] });
      }
    }

    // No vendors found
    return successResponse(res, 200, { vendor: {} }, "No vendors found");
  } catch (err) {
    return errorResponse(res, 400, "Something went wrong", err);
  }
};

// Delete a vendor by ID
exports.deleteVendor = async (req, res) => {
  try {
    const vendorId = req.params.id;
    const vendor = await Vendor.findByPk(vendorId);

    if (!vendor) {
      return successResponse(res, 200, { vendor: {} }, "No vendor found");
    }

    vendor.deleted_by = req.user.id;
    vendor.deletedAt = new Date();

    await vendor.save();

    return successResponse(res, 200, { vendor }, "Vendor deleted successfully");
  } catch (err) {
    return errorResponse(res, 500, "Error while deleting vendor", err);
  }
};
