const mongoose = require("mongoose");
const chatSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      trim: true,
    },
    isGroupChat: {
      type: Boolean,default:false
    },
    user: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",},
    ],
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Only set if `isGroupChat` is true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
