const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'pug');

app.use("/assets", express.static('assets'));

app.use('/', require('./api-router'))
app.use('/dist', require('./view-router'))

app.listen(port, () => {
    console.log(`Success! Your application is running on port ${port}.`);
});