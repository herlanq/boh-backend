const clients = {
  getAll: (req, res) => {
    const pg = require('./pg-connector');
    const qryStr = `
      select *
      from public.client
      order by id asc limit 10
    `;

    pg.select(req, res, qryStr);
  },

  getById: (req, res) => {
    return res.sendStatus(404);
  }
};

module.exports = clients;
