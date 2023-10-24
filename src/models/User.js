const mongoose = require("mongoose");

const enumMessenger = require("../utils/enum");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
    },
    address: {
      type: String,
    },
    school: {
      type: String,
    },
    work: {
      type: String,
    },
    gender: {
      type: String,
      required: true,
      default: "Male",
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
    },
    bio: {
      type: String,
    },
    avatar: {
      type: String,
      default: function () {
        const arr = [
          "https://styles.redditmedia.com/t5_l5blo/styles/profileIcon_snoo7e6b4fa5-20bb-4d3c-b08b-efd2c2fcf55f-headshot.png?width=256&height=256&crop=256:256,smart&s=7619a3dd251f94a221ebdc96c91cf9ea7146ff9e",
          "https://styles.redditmedia.com/t5_2z224r/styles/profileIcon_snoo0824209c-d1d8-48c5-a26c-c73b1b761f44-headshot-f.png?width=256&height=256&crop=256:256,smart&s=9a08408213ea1f1bdd11cc6781051ff1b9aee9cc",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7YKm7QzYc2d6C7PbBtUxVOLhF1f8tTl-NqA&usqp=CAU",
          "https://styles.redditmedia.com/t5_7d0bm/styles/profileIcon_snoo7670de02-e543-4b06-974b-9c9e7406b7d1-headshot-f.png?width=256&height=256&crop=256:256,smart&s=02c09dc8fab6bc0120648057d08e41d9913f154d",
          "https://styles.redditmedia.com/t5_mxcqq/styles/profileIcon_snoo2f20cb33-6c1b-48a9-bad0-46a4f9f73f20-headshot-f.png?width=256&height=256&crop=256:256,smart&s=be2d81a54d3360802e2ee826196f955f3769abb5",
          "https://styles.redditmedia.com/t5_48o9pq/styles/profileIcon_snoof659860e-780f-45c8-b970-b897fe47cbbb-headshot-f.png?width=256&height=256&crop=256:256,smart&s=43a891e32973fd222b9c3ce11db1bb9959c91e25",
          "https://styles.redditmedia.com/t5_413wd2/styles/profileIcon_snoo5431bcd7-3eaf-40db-95b6-4561247e4aa7-headshot-f.png?width=256&height=256&crop=256:256,smart&s=8571c7a059e042d2bdd222b109c8bb15ebd95802",
        ];
        return arr[Math.floor(Math.random() * arr.length)];
      },
    },
    wallpaper: {
      type: String,
      default:
        "https://i.pinimg.com/736x/f4/f9/1c/f4f91c394261080ff096d7c7843eb4c7.jpg",
    },
    stories: [{ type: mongoose.Types.ObjectId, ref: "Story" }],
    friends: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    requestFriendSent: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    requestFriendReceived: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    // offline -> 0
    // online -> 1
    // notWorking -> 2
    userStatus: {
      type: Number,
      default: enumMessenger.userStatus.offline,
    },
  },

  {
    timestamps: true,
  }
);

UserSchema.index({ fullName: "text" });
UserSchema.index({ fullName: 1 });

module.exports = mongoose.model("User", UserSchema);
