const express = require("express")
const { authMiddleware } = require("../middleware")
const { Account } = require("../db")
const { default: mongoose } = require("mongoose")
const { z } = require("zod")


const router = express.Router()

const transferSchema = z.object({
    to: z.string(),
    amount: z.string().min(1,"Amount cannot be empty")
})

router.get("/balance", authMiddleware, async (req,res) => {
    const userID = req.userID
    const account = await Account.findOne({
        userID: userID
    });
    if(!account){
        return res.status(400).json({
            message: "Account does not exist"
        })
    }
    return res.status(200).json({
        balance: account.balance,
        message: "That's all folks!"
    })
});

router.post("/transfer",authMiddleware,async (req,res) => {
    const session = await mongoose.startSession();
    session.startTransaction()
    try{
        const parsedInput = transferSchema.parse(req.body);
        const {to,amount} = req.body;
        
        const account = await Account.findOne({
            userID: req.userID
        }).session(session);
        
        
        if(!account || account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance"
            });
        }
        
        const toAccount = await Account.findOne({ 
            userID: to
        }).session(session);
        
        
        console.log(account.balance);
    
        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({
                id: toAccount.userID,
                message: "No such account found for transfer",
            });
        }
        
        // Perform the transfer
        const amounti = parseFloat(amount,10);
        account.balance = (parseFloat(account.balance,10)-amounti).toString()
        toAccount.balance = (parseFloat(toAccount.balance,10)+amounti).toString()
        
        await account.save({session})
        await toAccount.save({session})
        
        // Commit the transaction
        await session.commitTransaction();
        res.status(200).json({
            message: "Transfer successful"
        });
    }catch(error){
        if(error instanceof z.ZodError){
            return res.status(411).json({
                error: error.errors
            });
        }
        res.status(500).json({
            message: "Server error at accounts_transfer"
        });
        session.endSession()
    }
})
module.exports = router