const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')

const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

app.use("/assets", express.static('assets'));

app.use('/', require('./playshare-router'))
app.use('/dist', require('./view-router'))
app.use('/legal', require('./legal-router'))

app.get('/favicon.ico', async (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'assets/', 'favicon.ico'))
})
// app.get('/favicon.ico', (req, res) => {
//     res.status(204).send("No content")
// });

app.listen(port, () => {
    console.log(`Success! Your application is running on port ${port}.`);
});