const mongoose = require("mongoose");

const StorySchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

StorySchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model("Story", StorySchema);
