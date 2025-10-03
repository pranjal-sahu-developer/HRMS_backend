import express from "express"
import cors from "cors"
import { connectDB } from "./lib/db.js";
import dotenv from "dotenv";
import authRouter from "./routes/authRoute.js";
import departmentRouter from "./routes/departmentRoute.js";
import employeeRouter from "./routes/employeeRoute.js"
import salaryRouter from "./routes/salaryRoutes.js"
import leaveRouter from "./routes/leaveRoute.js"
import settingRouter from "./routes/settingRoute.js"
import adminRouter from "./routes/adminRoute.js"
import path from "path";


dotenv.config();
const app = express()
const Port = 5001;
// app.use(cors({
//     origin:"https://hrms-frontend-2tv4.vercel.app",
//       credentials: true ,
// }))
const allowedOrigins = [
  "http://localhost:5173", // for local development
  "https://hrms-frontend-2tv4.vercel.app" // for production
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);
app.use(express.json())

app.use("/api/auth", authRouter);
app.use("/api/department", departmentRouter);
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));
app.use("/api/employee", employeeRouter);
app.use("/api/salary", salaryRouter);
app.use("/api/leaves", leaveRouter);
app.use("/api/settings", settingRouter);
app.use("/api/admin", adminRouter);





app.listen(Port || process.env.PORT, ()=> {
    console.log(`Server is running on port ${Port}`)
    connectDB();
})