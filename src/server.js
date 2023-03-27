const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const Sentry = require('@sentry/node');
const Tracing = require("@sentry/tracing");
const Profiling = require("@sentry/profiling-node") // this is to keep an eye on functions. i don't profile users.
const config = require('../config.json');

const app = express();
const port = 4000;

Sentry.init({
    dsn: "https://ff0a2d8d4ee8420299a7e446c55859f7@o4503992923193344.ingest.sentry.io/4504905868967936",
    integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Tracing.Integrations.Express({ app }),
        new Profiling.ProfilingIntegration(),
    ],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

app.use("/assets", express.static('assets'));

app.use('/', require('./playshare-router'))
app.use('/dist', require('./view-router'))
app.use('/legal', require('./legal-router'))

app.get('/favicon.ico', async (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'assets/', 'favicon.ico'))
})

app.get('/test', function sentryTest(req, res) {
    notARealFunction()
})

app.use(Sentry.Handlers.errorHandler());
app.use((err, req, res, next) => {
    res.statusCode = 500;
    return res.render('pages/error', { sentryid: res.sentry, error: err })
});

app.listen(port, () => {
    console.log(`Success! Your application is running on port ${port}.`);
});