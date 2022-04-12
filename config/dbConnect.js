const mongoose = require("mongoose");

const dbConnect = () => {
    mongoose
        .connect(process.env.DB_CONNECTION_RUL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then((con) => {
            console.log(`DB connect on HOST : ${con.connection.host}`);
        })
};

module.exports = dbConnect;