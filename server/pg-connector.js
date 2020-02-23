const { Client } = require('pg');

module.exports = {
  select: (req, res, qryStr, params) => {
    go(req, res, 'select', qryStr, params || []);
  }
};

go = (req, res, verb, qryStr, params) => {
  const pgClient = new Client({ connectionString: req.app.get('connectionString') });
  // const pgClient = new Client();
  let rtn = null;
  let status = verb === 'insert' ? 201 : 200;

  console.log('Starting database connection.');

  pgClient.connect(err => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: 'Database connection error.' });
    }

    console.log('Established database connection.');
  });

  pgClient.on('error', err => {
    console.error(err);
    status = 500;
    rtn = { message: 'Something went wrong with the database connection.' };
  });

  pgClient.on('notice', msg => {
    console.warn('notice:', msg);
    status = 500;
    rtn = { message: 'The database is trying to tell you something.' };
  });

  pgClient.query(qryStr, params, (err, rslt) => {
    if (err) {
      console.error(err);
      status = 500;
      rtn = { message: 'Something went wrong with the database query.' };
    } else {
      rtn = rslt.rows;
    }
    console.log(rtn);
  });

  pgClient.end(() => res.status(status).send(rtn));
}
