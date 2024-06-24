const express = require("express")
const { authMiddleware } = require("../middleware")
const { Account } = require("../db")
const { default: mongoose } = require("mongoose")
const { z } = require("zod")

const app = express()
const router = express.Router()

const transferSchema = z.object({
    to: z.string().email("Invalid email format"),
    amount: z.string().nonempty("Amount cannot be empty")
})

app.get("/balance", authMiddleware, async (req,res) => {
    const userID = req.userID
    const account = Account.findOne({
        userID: userID
    });
    if(!account){
        return res.status(400).json({
            message: "Account does not exist"
        })
    }
    return res.status(200).json({
        balance: account.balance
    })
});

app.post("/transfer",authMiddleware,async (req,res) => {
    const session = await mongoose.startSession();
    session.startTransaction()
    try{
        const parsedInput = transferSchema.parse(req.body);
        const {to,amount} = parsedInput;
        
        const account = Account.findOne({
            userID: req.userID
        }).session(session);

        if(!account || account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance"
            });
        }

        const toAccount = await Account.findOne({ 
            userId: to 
        }).session(session);

        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "No such account found for transfer"
            });
        }

        // Perform the transfer
        account.balance = (parseInt(account.balance,10)-amount).toString()
        toAccount.balance = (parseInt(toAccount.balance,10)+amount).toString()
        await account.save({session})
        await toAccount.save({session})
        // await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        // await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

        // Commit the transaction
        await session.commitTransaction();
        res.status(200).json({
            message: "Transfer successful"
        });
        session.endSession()
    }catch(error){
        session.endSession()
        if(error instanceof z.ZodError){
            return res.status(411).json({
                error: error.errors
            });
        }
        res.status(500).json({
            message: "Server error at accounts_transfer"
        });
    }
})
module.exports = router