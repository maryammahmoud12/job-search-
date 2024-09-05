import mongoose from "mongoose";

const connectionDB = async () => {
  return await mongoose
    .connect(process.env.mongo_URL)
    .then(() => {
      console.log("connected to DB");
    })
    .catch((err) => {
      console.log("failed to connect to DB");
    });
};

export default connectionDB;
