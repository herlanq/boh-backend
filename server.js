const express = require('express');
const app = express();
const port = 3000;

// implement API routes
const clientsAPI = require('./server/clients-api');

app.use('/clients', clientsAPI);

// catch all other routes and return just a simple message
app.all('*', (req, res) => res.send('Hi, this is not a real place'));

app.listen(port, () => console.log(`Beacon of Hope backend service app listening on port ${port}!`));