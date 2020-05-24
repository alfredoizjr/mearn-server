const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

connectDB();

const connection = mongoose.connection;

connection.once('open',() => console.log("DB is connected"))

