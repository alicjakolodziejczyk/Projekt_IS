const mongoose = require("mongoose")
const {prepareData} = require('./dataPreparation')
require('dotenv').config()
module.exports = () => {
const connectionParams = {
useNewUrlParser: true,
useUnifiedTopology: true,
}
try {
mongoose.connect(process.env.DB)
.then(() =>console.log("Connected to database successfully"))
//.then(prepareData());
} catch (error) {
console.log(error);
console.log("Could not connect database!")
}
}