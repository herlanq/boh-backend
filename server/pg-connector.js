const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';
const connectionString = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;
const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: { rejectUnauthorized: false }
});

pool.connect(err => {
  if (err) {
    console.error(err);
    // return res.status(500).send({ message: 'Database connection error.' });
    pool.end();
  }
});

pool.on('error', err => {
  // console.error(err);
  res.status(500).json({ message: 'Unexpected error on idle database connection.' });
});

module.exports = {
  delete: (res, qryStr, params) => {
    go(res, 'update', qryStr, params);
  },

  insert: (res, qryStr, params) => {
    go(res, 'insert', qryStr, params);
  },

  select: (res, qryStr, params) => {
    go(res, 'select', qryStr, params || []);
  },

  selectOne: (res, qryStr, params, recordType) => {
    go(res, 'selectOne', qryStr, params || [], recordType);
  },

  update: (res, qryStr, params) => {
    go(res, 'update', qryStr, params);
  }
};

go = (res, verb, qryStr, params, recordType) => {
  let rtn = null;
  let status = verb === 'insert' ? 201 : 200;

  pool.query(qryStr, params, (err, rslt) => {
    // note there are separate handlers for 'select' (return multiple rows) and 'selectOne' (return 1 row or 404)
    // there are not separate handlers for delete, insert, and update, since they do not return data; they just run
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
