// import mongoose from "mongoose";

// const myConnection =  mongoose.connect("mongodb+srv://Aliaa:12345@cluster0.q5izj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// }).then(console.log("✅ MongoDB Connected Successfully!"))
// .catch((err)=>console.log(err));

// export default myConnection; 
import mongoose from "mongoose";

const myConnection =  mongoose.connect("mongodb+srv://aya:12345@cluster0.q5izj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(console.log("✅ MongoDB Connected Successfully!"))
.catch((err)=>console.log(err));

export default myConnection;