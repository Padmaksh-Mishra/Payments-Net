const mongoose = require("mongoose")
const {DB_URI} = require("./secret")

mongoose.connect(DB_URI)
            .then(() => console.log("MongoDB connected."))
            .catch(err => console.log("Faild to connect: ",err))


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,       // Remove leading and trailing whitespace
        unique: true,     
        required: true    
    },
    password: {
        type: String,
        required: true   
    },
    firstname: {
        type: String,
        trim: true       
    },
    lastname: {
        type: String,
        trim: true        
    }
});

const accountSchema = mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,           // So that money can be stored only if u have an account
        ref: User,
        required: true,
    },
    balance: {
        type: String,
        required: true,
    }
});


const User = mongoose.model("User", userSchema);
const Account = mongoose.model("Account", accountSchema);

module.exports = {
    User,
    Account,
}