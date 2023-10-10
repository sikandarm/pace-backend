const { Op } = require('sequelize');
class QueryHelper {
  constructor(model, queryStr, include) {
    this.model = model;
    this.queryStr = queryStr;
    this.pipeline = {};
    if (include) {
      this.pipeline.include = include;
    }
  }

  filter() {
    const queryObj = { ...this.queryStr };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((element) => {
      delete queryObj[element];
    });

    const where = queryObj;

    if (Object.keys(where).length > 0) {
      Object.keys(where).forEach((key) => {
        const value = where[key];
        if (value.includes('%')) {
          where[key] = {
            [Op.like]: value,
          };
        }
      });
      this.pipeline.where = where;
    }
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const [sortField, sortValue] = this.queryStr.sort.split(',');
      this.pipeline.order = [[sortField, sortValue]];
    } else {
      this.pipeline.order = [['createdAt', 'desc']];
    }
    return this;
  }

  paginate() {
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.pipeline.offset = skip;
    this.pipeline.limit = limit;

    return this;
  }

  exec() {
    return this.model.findAll(this.pipeline);
  }

  execPagination() {
    return new Promise(async (resolve) => {
      const { rows: data, count: totalrecords } =
        await this.model.findAndCountAll(this.pipeline);
      const page = this.queryStr.page ?? 1;

      resolve({
        data,
        totalrecords,
        page,
      });
    });
  }
}

module.exports = QueryHelper;
