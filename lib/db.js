// import mongoose from "mongoose";

// export const connectDB = async() =>{
//     try {
//         await mongoose.connect(process.env.MONGO_URL)
//         console.log("mongoDB connected successfully")
//     } catch (error) {
//         console.log(error)
//     }
// }


// import mongoose from "mongoose";

// export const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     mongoose.connection.on("connected", () => {
//       console.log("MongoDB connected successfully");
//     });

//     mongoose.connection.on("error", (err) => {
//       console.error("MongoDB connection error:", err);
//     });

//   } catch (error) {
//     console.error("Initial connection error:", error);
//   }
// };


import mongoose from "mongoose";

let isConnected = false; // connection state cache

export const connectDB = async () => {
  if (isConnected) {
    // Agar already connected hai to dobara connect mat karo
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = db.connections[0].readyState === 1;
    console.log("✅ MongoDB connected on Vercel");

  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
};
