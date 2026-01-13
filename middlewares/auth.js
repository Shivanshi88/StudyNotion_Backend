import jwt from "jsonwebtoken";
import User from "../models/User";
import dotenv from "dotenv";
dotenv.config();

//auth 
export const auth = async (req, res, next) => {
    try {
        // extract token
        const token = req.cookies?.token || req.body?.token || req.header("Authorization")?.replace("Bearer ", "");

        // if token missing, then retrun response
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "token is missing"
            })
        };

        // verify the token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;

        } catch (errorr) {
            return res.status(401).json({
                success: false,
                message: " token is invalid"
            });
        }
        next();
    }

    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong while validating token"
        })
    }

}


//is student

export const isStudnt = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Student") {
            return res.status(401).json({
                success: false,
                message: "This route is procted for the student"
            });
        }
        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role can not be verified"
        })
    }
}

// is instructor
export const isInstructor = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Instructor") {
            return res.status(401).json({
                success: false,
                message: "This route is proctected for the Istructor Only"
            });
        }

next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Instructor role can not be verified"
        })
    }
}

// is admin

export const isAdmin = async(req,res,next)=>{
    try{
if(req.user.accountType!=="Admin"){

    return res.status(401).json({
        success:false,
        message:"This route is protected for the Admin only"
    });
}
next();
    }catch(error){
        return res.status(400).json({
            success:false,
            message:"Admin role can not be verified"
        });
    }
}

