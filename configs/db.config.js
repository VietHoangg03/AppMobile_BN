const mongoose = require("mongoose");

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connected successfully!");
  } catch (err) {
    console.log("Fail to connect to Mongodb!");
    console.log(err);
  }
};

module.exports = { connect };
