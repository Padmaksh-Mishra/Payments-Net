const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017")
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

const User = mongoose.model("User", userSchema);

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


const Account = mongoose.model("Account", accountSchema);

module.exports = {
    User,
    Account,
}