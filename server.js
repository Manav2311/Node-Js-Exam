const express = require('express');
const path = require('path');
const { db } = require('./config/database');
const port = 8081;

const app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname + '/assets')));
app.use('/', require('./routers'))

app.listen(port, () => {
    db();
    console.log('Server is running on\n http://localhost:' + port);
})