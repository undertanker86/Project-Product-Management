const mongoose = require('mongoose'); // Nhung mongoose
module.exports.connect = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL); // Ket noi mongodb
        console.log('Connect to MongoDB successfully!'); // In ra Connect to MongoDB successfully!
    } catch(error){
        console.log('Connect to MongoDB failure!'); // In ra Connect to MongoDB failure
        console.log(error); // In ra loi
    }
}