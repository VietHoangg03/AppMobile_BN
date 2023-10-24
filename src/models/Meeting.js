const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    hostId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Meeting", MeetingSchema);
