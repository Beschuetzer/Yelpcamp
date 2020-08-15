const mongoose = require('mongoose'),
      commentSchema = {
        author: {type: String, default: "ME!!"},
        text: String,
      };

//Like a return for the file
module.exports = mongoose.model("Comment", commentSchema);
