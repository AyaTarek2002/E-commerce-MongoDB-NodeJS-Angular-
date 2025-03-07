export const restrictUser = (req, res, next) => {
    console.log("Checking restrictUser middleware...");
    console.log("User Object:", req.user);
    
    if (req.user && req.user.status === "restricted") {
        console.log("User is restricted!");
        const restrictedRoutes = ["/cart/add", "/payment/process"];

        if (restrictedRoutes.includes(req.path)) {
            console.log("Blocked restricted route:", req.path);
            return res.status(403).json({ message: "Your account is restricted. You cannot perform this action." });
        }
    }
    
    next();
};






