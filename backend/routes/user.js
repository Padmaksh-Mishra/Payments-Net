const express = require("express");
const {z} = require("zod");
const jwt = require("jsonwebtoken");
const {User,Account} = require("../db");
const {JWT_SECRET} = require("../config");
const {authMiddleware} = require("../middleware")
const bcrypt = require('bcryptjs');


const router = express.Router();

// Define routes for userRouter
router.post("/", (req, res) => {
    res.json(req.body);
});


// zod layers 

// input validation
const signupSchema = z.object({
    username: z.string().email("Invalid email format"),
    password: z.string().min(6,"Password must be atleast 6 characters long"),
    firstname: z.string().min(1,"First Name cannot be empty"),
    lastname: z.string().min(1,"Last Name cannot be empty")
});

const signinSchema = z.object({
    username: z.string().email("Invalid email format"),
    password: z.string().min(1,"Password cannot be empty")
});

const updateUserSchema = z.object({
    password: z.string().min(6,"Password must be atleast 6 characters long").optional(),
    firstname: z.string().min(1,"First Name cannot be empty").optional(),
    lastname: z.string().min(1,"Last Name cannot be empty").optional(),
});

const querySchema = z.object({
    name: z.string()
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
router.post("/signup",async (req,res) => {
    try {
        const parsedInput = signupSchema.parse(req.body);
        const {username, password, firstname, lastname} = parsedInput;
        
        //check if user already exists
        const userExists = await User.findOne({
            username: username,
        });
        if(userExists){
            return res.status(411).json({
                message: "User already exists.",
                name: username
            });
        }
        const hashedPassword = await bcrypt.hash(password,1);
        
        const newUser = new User({username: username, password: hashedPassword, firstname: firstname, lastname: lastname});
        const dbUser = await newUser.save();
        
        const newAccount = new Account({userID: dbUser._id, balance: (1 + Math.random()*10000).toString()});
        await newAccount.save();
        
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
            return res.status(400).json({
                message: "Zod error",
                errors: error.errors});
        }
        return res.status(500).json({error : "Internal Server Error"});
    }
    
});

router.post("/signin",async (req,res) => {
    try{
        const parsedInput = signinSchema.parse(req.body);
        const {username,password} = parsedInput;
        const user = await User.findOne({username:username});
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
            id: user._id.toString(),
            token:token
        });
        res.status(200).json({
            message: "Signed in successfully",
            data: responseData
        });
        
    }catch(error){
        if(error instanceof z.ZodError){
            return res.status(400).json({errors: error.errors});
        }
        return res.status(500).json({error : "Internal Server Error"});
    }
});


router.post("/update", authMiddleware, async (req,res) => {
    try{
        const parsedInput = buissLogic(updateUserSchema.parse(req.body));
        const userID = req.userID;
        const {password, firstname, lastname} = parsedInput;
        
        const user = User.findById(userID);
        if(!user){
            res.status(411).json({
                message: "User not found."
            })
        }
        
        if(password) user.password = await bcrypt.hash(password,10);
        if(firstname) user.firstname = firstname;
        if(lastname) user.lastname = lastname;
        
        await user.save();
        res.status(200).json({
            message : "Updated successfully",
        })
        
    }catch(error){
        if(error instanceof z.ZodError){
            return res.status(400).json({
                error : error.errors
            })
        }
        res.status(500).json({
            message: "Something went wrong! <user_db_update>"
        })
    }
});


router.get('/bulk', async (req, res) => {
    try{
        const sanitizedQuery = querySchema.parse(req.query);
        const {name} = sanitizedQuery;
        
        const regex = new RegExp(".*" + name + ".*", "i");
        const users = await User.find({
            $or: [
                { firstname: regex },
                { lastname: regex }
            ]
        });
        
        if(users.length==0){
            return res.status(400).json({
                message: "No user found try a diffrent search"
            });
        }
        
        const formatedUsers = users.map(user => ({
            id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
        }));
        
        res.status(200).json({users: formatedUsers});
    }catch(error){
        if(error instanceof z.ZodError){
            return res.status(411).json({
                error: error.errors,
            });
        }
        return res.status(500).json({
            message: "Something went wrong <user_serarch_bulk>",
            error: error
        })
    }
})

//------------------------------------------------------------------------------------------------
module.exports = router;