import mongoose from "mongoose";

const myConnection = mongoose.connect(
  "mongodb+srv://arwa:12345@cluster0.q5izj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
)
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch((err) => console.log(err));

export default myConnection; 
