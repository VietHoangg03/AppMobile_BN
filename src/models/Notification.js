const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    senderId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },

    conversationId: {
      type: mongoose.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", NotificationSchema);
