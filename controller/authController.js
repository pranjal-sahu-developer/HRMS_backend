import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// export const login = async (req, res) => {
//    console.log("Request body:", req.body);
//   try {
//     const { email, password } = req.body;

//     // validate input
//     if (!email || !password) {
      
//        console.log("Missing email or password");

//       return res.status(400).json({
//         success: false,
//         error: "All fields are required",
//       });
//     }

//     const user = await User.findOne({ email });
//       console.log("User found:", user);

//     if (!user) {
//       console.log("User not found");
//       return res
//         .status(404)
//         .json({ success: false, error: "User not found" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res
//         .status(401)
//         .json({ success: false, error: "Wrong Password" });
//     }

//     const token = jwt.sign(
//       { _id: user._id, role: user.role },
//       process.env.JWT_SECRET_KEY,
//       { expiresIn: "5d" }
//     );

//     return res.status(200).json({
//       success: true,
//       token,
//       user: { _id: user._id, name: user.name, role: user.role },
//     });
//   } catch (error) {
//     console.log("Error in login controller", error);
//     return res
//       .status(500)
//       .json({ success: false, error: "Internal Server Error" });
//   }
// };


export const login = async (req, res) => {
  console.log("Request body:", req.body);
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Missing email or password");
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    const user = await User.findOne({ email });
    console.log("User found:", user);

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      console.log("Wrong password");
      return res.status(401).json({ success: false, error: "Wrong Password" });
    }

    if (!process.env.JWT_SECRET_KEY) {
      console.log("JWT_SECRET_KEY is missing");
      throw new Error("JWT_SECRET_KEY is not defined");
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "5d" }
    );

    console.log("Token generated:", token);

    return res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        role: user.role,
        employeeId: user.employeeId,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, error: "Internal Server error" });
  }
};

export const verify = (req,res) =>{
    return res.status(200).json({success: true, user: req.user})
}
