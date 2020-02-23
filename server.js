const express = require('express');
const app = express();

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const port = process.env.PORT || 3000;
app.set('connectString', process.env.CONNECTSTRING);

// implement API routes
const clientsAPI = require('./server/clients-api');

app.use('/clients', clientsAPI);

// catch all other routes and return just a simple message
app.all('*', (req, res) => res.send('Hi, this is not a real place'));

app.listen(port, () => console.log(`Beacon of Hope backend service app listening on port ${port}!`));