const express = require("express");
const {z} = require("zod");
const jwt = require("jsonwebtoken");
const {User} = require("../db");
const {JWT_SECRET} = require("../config");

const app = express();

const router = express.Router();
module.exports = router;


// zod layers 
// input validation
const signupSchema = z.object({
    username: z.string().email("Invalid email format"),
    password: z.string().min(6,"Password must be atleast 6 characters long"),
    firstname: z.string().nonempty("First Name cannot be empty"),
    lastname: z.string().nonempty("Last Name cannot be empty")
});
const signinSchema = z.object({
    username: z.string().email("Invalid email format"),
    password: z.string().nonempty("Password cannot be empty")
});
//buissiness logic validation (Checks to ensure passwords have requested pattern)
const buissLogic = z.object({
    password: z.string().refine(
        (pwd) => /[A-Z]/.test(pwd) && /[0-9]/.test(pwd),
        {message: "Password must have an upper-case leeter and a number"}
    )
});
//Database validation (nothing left to validate) something like database limation traits can be here like say 
// current database version allowas only 100 letters in email but future ones may allow more
const databaseSchema = z.object({
    username: z.string(),
    password: z.string(),
    firstname: z.string(),
    lastname: z.string()
})

//Output validation
const userResponseSchema = z.object({
    id: z.string(),
    token: z.string()
});

//44.15 error
app.post("/signup",async (req,res) => {
    try {
        const parsedInput = databaseSchema.parse(buissLogic.parse(signupSchema.parse(req.body)));
        const {username, password, firstname, lastname} = parsedInput;

        //check if user already exists
        const userExists = User.findOne({username});
        if(userExists){
            return res.status(411).json({
                message: "User already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = {username: username, password: hashedPassword, firstname: firstname, lastname: lastname};
        const dbUser = await newUser.save();

        const token = jwt.sign({
            userID: dbUser._id,
        },JWT_SECRET,{expiresIn : "1h"});

        const responseData = userResponseSchema.parse({
            id: dbUser._id.toString(),
            token:token
        });
        res.status(200).json({
            message: "User created successfully",
            data: responseData
        });
    }catch(error) {
        if(error instanceof z.ZodError){
            return res.status(400).json({errors: error.errors});
        }
        return res.status(500).json({error : "Internal Server Error"});
    }

});

app.post("/signin",async (req,res) => {
    try{
        const parsedInput = signinSchema.parse(req.body);
        const {username,password} = parsedInput;
        const user = await User.findOne({username});
        if(!user){
            return res.status(411).json({
                message: "User does not exist. Please signup for a new account, it's 100% free",
            });
        }
        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(411).json({
                message: "Invalid password",
            });
        }
        const token = jwt.sign({
            userID: user._id,
        },JWT_SECRET,{expiresIn : "1h"});

        const responseData = userResponseSchema.parse({
            id: dbUser._id.toString(),
            token:token
        });
        res.status(200).json({
            message: "User created successfully",
            data: responseData
        });

    }catch(error){
        if(error instanceof z.ZodError){
            return res.status(400).json({errors: error.errors});
        }
        return res.status(500).json({error : "Internal Server Error"});
    }
})