import mongoose from "mongoose";
import config from ".";
import { ConnectOptions } from "mongoose";

const uri = config.DATABASE_URL;

export const databaseConnection = () => {
  mongoose
    .connect(uri!)
    .then(() => {
      console.log("---> Connected to MongoDB Successfully.");
    })
    .catch((error) => {
      console.log("---> Error connecting with mongoDB:", error);
    });
};

// export default databaseConnection;