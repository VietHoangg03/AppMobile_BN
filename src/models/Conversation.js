const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    members: [
      {
        idUser: { type: mongoose.Types.ObjectId, ref: "User" },
        show: { type: Boolean, default: true },
        offset: { type: Number, default: 0 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Conversation", ConversationSchema);
