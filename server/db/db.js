import { connect } from "mongoose";

const dbConnect = async () => {
  try {
    await connect(process.env.MONGOURI);
    console.log(`connected to db successfully`);
  } catch (error) {
    console.log(error);
  }
};

export default dbConnect;
