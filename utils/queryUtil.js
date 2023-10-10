// queryUtils.js

const { Op } = require("sequelize");

async function filterSortPaginate(model, reqQuery, includePagination, include) {
  const query = {
    where: {},
    order: [],
  };

  // Apply filter if provided in req.query
  const filter = {};
  for (const [key, value] of Object.entries(reqQuery)) {
    if (key !== "page" && key !== "limit" && key !== "sort") {
      filter[key] = value;
    }
  }

  // Apply filter if provided
  if (Object.keys(filter).length > 0) {
    for (const [key, value] of Object.entries(filter)) {
      query.where[key] = { [Op.like]: `%${value}%` };
    }
  }

  // Apply sorting if provided in req.query
  if (!reqQuery.sort) {
    reqQuery.sort = "-id";
  }
  if (reqQuery.sort) {
    const sortArray = reqQuery.sort.split(",");
    const sortParams = sortArray.map((item) => {
      const field = item.charAt(0) === "-" ? item.slice(1) : item;
      const order = item.charAt(0) === "-" ? "DESC" : "ASC";
      return [field, order];
    });
    query.order = sortParams;
  }

  try {
    if (includePagination) {
      const page = reqQuery.page * 1 || 1;
      const limit = reqQuery.limit * 1 || 10;
      const offset = (page - 1) * limit;
      const { count, rows: data } = await model.findAndCountAll({
        where: query.where,
        order: query.order,
        offset,
        limit,
        include,
        distinct: true,
      });

      // Return results with total count and page information
      return {
        count,
        currentPage: page,
        perPage: limit,
        totalPages: Math.ceil(count / limit),
        data,
      };
    } else {
      // Execute query and fetch data
      const data = await model.findAll({
        where: query.where,
        order: query.order,
        include,
      });
      // Return results with data only
      return data;
    }
  } catch (err) {
    // Handle any errors that occur during the query execution
    console.error(err);
    throw new Error("An error occurred while processing your request.");
  }
}

module.exports = filterSortPaginate;
