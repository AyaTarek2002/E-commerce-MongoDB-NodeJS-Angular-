import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {userModel} from "../../Database/Models/user.model.js";
import { sendEmail } from "../../Email/Email.js";
import { catchError } from "../../MiddleWare/catchError.js";
import crypto from "crypto";

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
    const addUser = await userModel.insertMany(req.body);// insertMany return an Array of object
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
        },"myKey"); // secret key is used to sign the token and it's name is hello
        
        res.status(200).json({message:`welcome ${foundUser.name}`, token});
    }else{
        res.status(401).json({message:"Check your Email to confirm!"});
    }
})
//resetPassword
export const resetPassword = catchError(async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
        return res.status(400).json({ message: "Please enter a new password." });
    }

    // تحويل التوكن إلى صيغة مشفرة لمطابقتها مع قاعدة البيانات
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // البحث عن المستخدم الذي يملك التوكن الصحيح والذي لم تنتهِ صلاحيته
    const user = await userModel.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() }, 
    });

    if (!user) {
        return res.status(400).json({ message: "Invalid or expired token." });
    }

    // **تشفير كلمة المرور الجديدة قبل الحفظ**
    user.password = bcrypt.hashSync(newPassword, 8);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    console.log("Token from URL:", req.params.token);
    console.log("Hashed Token:", hashedToken);
    console.log("User Found:", user);


    await user.save();

    // **إرسال إيميل تأكيد إعادة التعيين**
    await sendEmail(user.email, "Password Reset Successful", "Your password has been successfully reset.");

    return res.status(200).json({ message: "Password has been successfully reset." });
});
//forgotPassword
export const forgotPassword = catchError(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Please enter your email address." });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: "User not found." });
    }

    // ✅ إنشاء التوكن وإضافة تاريخ انتهاء الصلاحية
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // صالح لمدة 10 دقائق
    await user.save();

    // ✅ إعداد رابط إعادة تعيين كلمة المرور
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    try {
        await sendEmail(email, "Password Reset Request", `Click the link to reset your password: ${resetLink}`);

        return res.status(200).json({
            message: "Password reset link has been sent to your email.",
            resetToken,
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to send email.", error: error.message });
    }
});

//getUserProfile
export const getUserProfile = catchError(async (req, res) => {
    const user = await userModel.findById(req.user.id).select("-password");


    if (!user) {
        return res.status(404).json({ message: "User not found!" });
    }
    user.password = undefined;
    user._id = undefined;

    res.status(200).json({ message: "User profile retrieved successfully", user });
});

//Update User Data
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
//Delete User By Admin only
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
    console.log(token)
    jwt.verify(token, "myemail",async (err, decoded) => {
        if(err){
         return res.status(401).json({message: "Invalid token"})
        }
        const email = decoded;
        await userModel.findOneAndUpdate({email: email}, {isConfirmed: true})
        res.json({message: "Email verified"})
    })
}
//restrictUserByAdmin
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



