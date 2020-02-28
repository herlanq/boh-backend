const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';
const connectionString = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;
const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: true
});

pool.connect(err => {
  if (err) {
    // console.error(err);
    return res.status(500).send({ message: 'Database connection error.' });
  }
});

pool.on('error', err => {
  // console.error(err);
  res.status(500).json({ message: 'Unexpected error on idle database connection.' });
});

module.exports = {
  select: (res, qryStr, params) => {
    go(res, 'select', qryStr, params || []);
  },

  selectOne: (res, qryStr, params, recordType) => {
    go(res, 'selectOne', qryStr, params || [], recordType);
  }
};

go = (res, verb, qryStr, params, recordType) => {
  let rtn = null;
  let status = verb === 'insert' ? 201 : 200;

  pool.query(qryStr, params, (err, rslt) => {
    if (err) {
      // console.error(err);
      status = 500;
      rtn = { message: 'Something went wrong with the database query.' };
    } else if (verb === 'select') {
      rtn = rslt.rows;
    } else if (verb === 'selectOne') {
      const type = recordType ? recordType : 'record';

      if (!rslt.rows.length) {
        rtn = { message: 'Requested ' + type + ' could not be found.' };
        status = 404;
      } else {
        rtn = rslt.rows[0];
      }
    }

    res.status(status).json(rtn);
  });
}
