
module.exports = {

// This function takes multiple allowed roles as arguments
authorizeRoles: function(...allowedRoles){  
    return (req, res, next) => {  
        // Check if the user's role exists in the allowedRoles array
        if (!allowedRoles.includes(req.user.role)) {  
            // If the user's role is not allowed, return a 403 Forbidden response
            return res.status(403).json({ message: "Access Denied" });  
        }
        // If the user has the correct role, proceed to the next middleware or route handler
        next();  
    };
}

};