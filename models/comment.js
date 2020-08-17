const mongoose = require('mongoose'),
      commentSchema = {
        author: {
          id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          username: String,
        },
        text: String,
      };

//Like a return for the file
module.exports = mongoose.model("Comment", commentSchema);
