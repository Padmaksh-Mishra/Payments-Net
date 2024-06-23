const mongoose = require("mongoose")

mongoose.connect("REDACTED")
            .then(() => console.log("MongoDB connected."))
            .catch(err => console.log("Faild to connect: ",err))


const userSchema = mongoose.Schema({
    username : String,
    password : String,
    firstname: String,
    lastname : String,
});

const User = mongoose.model("User", userSchema);

module.exports = {
    User
}
