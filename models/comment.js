const mongoose = require('mongoose'),
      commentSchema = {
        author: String,
        text: String,
      };

//Like a return for the file
module.exports = mongoose.model("Comment", commentSchema);
