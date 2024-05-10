const express = require('express');
const dotenv = require('dotenv').config();
const router = require('./routes/router');
const port = process.env.PORT || 5001;
const cors =require('cors')
const CreateDb = require('./dbconfig/dbCreation');
const createTable=require('./dbconfig/createTable')
const errorHandler = require('./middlewares/errorHandler'); // Import the errorHandler before using it.
const app = express();
CreateDb();
createTable();

app.use(cors())
app.use(express.json());

app.use('/', router);

app.use(errorHandler);


app.listen(port, () => {
    console.log(`App is listening on port...${port}`);
});
