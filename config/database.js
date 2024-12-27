const { default: mongoose } = require("mongoose")
require('dotenv').config();
let URL = process.env.DB_URL;
module.exports.db = async()=>{
    console.log('database connected');
    await mongoose.connect(URL)
}