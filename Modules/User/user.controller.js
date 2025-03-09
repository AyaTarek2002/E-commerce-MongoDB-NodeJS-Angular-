import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {userModel} from "../../Database/Models/user.model.js";
import { sendEmail } from "../../Email/Email.js";
import { catchError } from "../../MiddleWare/catchError.js";


//Sign UP
export const signUp = catchError(
    async (req,res) => {
    console.log("SignUp function called"); 
    req.body.password = bcrypt.hashSync(req.body.password, 8);
    if (req.body.role === "admin") {
        req.body.isConfirmed = true;
    } else {
        req.body.isConfirmed = false;
    }
    const addUser = await userModel.insertMany(req.body);//insertMany return an Array of object
    if (req.body.role === "customer") {
        await sendEmail(req.body.email);   
         console.log("Sending email to:", req.body.email); 

    }
    addUser[0].password = undefined;// remove password from the response
    res.status(201).json({message:"done", addUser});// 201 status code is used for created
})
//Login
export const login = catchError(
async (req,res)=>
{
    let foundUser = await userModel.findOne({email:req.body.email});
    if(foundUser && bcrypt.compareSync( req.body.password, foundUser.password)&&(foundUser.isConfirmed==true)){
        let token = jwt.sign({
            id: foundUser._id,
            name: foundUser.name,
            role: foundUser.role
        },
        process.env.JWT_SECRET, 
        { expiresIn: "7d" } 
    ); 
        
        res.status(200).json({message:`welcome ${foundUser.name}`, token});
    }else{
        res.status(401).json({message:"Check your Email to confirm!"});
    }
})

// forgotPassword
export const forgotPassword = catchError(async (req, res) => {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign({ id: user._id }, "mySecretKey", { expiresIn: "1h" });

    const resetLink = `http://localhost:3000/reset-password/${token}`;

    console.log(`🔗 Password Reset Link: ${resetLink}`);

    res.status(200).json({
        message: "Password reset link generated. Check the console for details.",
        resetLink
    });
});
//resetPassword
export const resetPassword = catchError(async (req, res) => {
    const { token } = req.params; 
    const { newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, "mySecretKey");

        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.password = bcrypt.hashSync(newPassword, 8);
        await user.save();

        res.status(200).json({ message: "Password has been reset successfully." });
    } catch (error) {
        res.status(400).json({ message: "Invalid or expired token" });
    }
});

// //Update User Data
export const updateUserDetails = catchError(async (req, res) => {
    const userID = req.user.id;
    const user = await userModel.findById(userID);

    if (!user) {
        return res.status(404).json({ message: "User Not Found" });
    }

    if (userID !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized to update this user" });
    }

    if (!req.body.name && !req.body.email && !req.body.password && !req.body.phone) {
        return res.status(400).json({ message: "No fields to update" });
    }

    if (req.body.password) {
        req.body.password = bcrypt.hashSync(req.body.password, 8);
    }

    const updatedUser = await userModel.findByIdAndUpdate(
        userID,
        req.body,
        { new: true, runValidators: true }
    );

    if (!updatedUser) {
        return res.status(500).json({ message: "Failed to update user" });
    }

    updatedUser.password = undefined;

    res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser
    });
});
// //Delete User By Admin only
export const deleteUser = catchError(async (req, res) =>
{
    const userID = req.params.id;

    const user = await userModel.findById(userID);
    if(!user)
    {
        return res.status(404).json({message:"User Not Found"});
    }
    const userToDelete = await userModel.findByIdAndDelete(userID);
    
    userToDelete.password = undefined;
    res.status(200).json({
        message: "User deleted successfully",
        deletedUser: userToDelete
    });

})
//verifyEmail
export const verifyEmail =  (req,res) => {
    const token = req.params.email
    jwt.verify(token,process.env.EMAIL_SECRET,async (err, decoded) => {
        if(err){
         return res.status(401).json({message: "Invalid token"})
        }
        const email = decoded;
        await userModel.findOneAndUpdate({email: email}, {isConfirmed: true})
        res.json({message: "Email verified"})
    })
}

// Get all users (Admin only)
export const getAllUsers = catchError(async (req, res) => {
    const users = await userModel.find({}, { password: 0 }); // Exclude passwords
    res.status(200).json({ message: "All users retrieved successfully", users });
});

// Get user by ID (Admin only)
export const getUserById = catchError(async (req, res) => {
    const user = await userModel.findById(req.params.id, { password: 0 }); // Exclude password
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User retrieved successfully", user });
});

export const restrictUser = catchError(async (req, res) => {
    const { userId } = req.params;
    const { status } = req.body; // "restricted" أو "banned"

    if (!["active", "restricted", "banned"].includes(status)) {
        return res.status(400).json({ error: "Invalid status value! Use 'active', 'restricted', or 'banned'." });
    }

    const updatedUser = await userModel.findByIdAndUpdate(userId, { status }, { new: true });

    if (!updatedUser) {
        return res.status(404).json({ error: "User not found!" });
    }

    res.json({ message: `User status updated to ${status}`, user: updatedUser });
});



