const	mongoose = require('mongoose');

//creating a schema for each object (put in /models/user
const userSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    password: String,
    email: {type: String, unique: true, required: true},
    zipCode: Number,
    agreesToPrivacyPolicy: {type: Boolean, default: false},
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        }
    ],
    isAdmin: {type: Boolean, default: false},
    hasPaid: {type: Boolean, default: false},
});

//needed if using authentication based on this model/class
const passportLocalMongoose = require('passport-local-mongoose');
userSchema.plugin(passportLocalMongoose);		//alows you to use methods in passport local mongoose on the imported obj.

//Mongoose will create a collection with the plural of the first argument
//(e.g. 'Cat' creates 'cats' collection); case-insensitive; Use object as template for insert, remove, etc
module.exports = mongoose.model("User", userSchema);