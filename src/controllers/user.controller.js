const { default: mongoose } = require("mongoose");
const Story = require("../models/Story");
const User = require("../models/User");
const resourceMessenger = require("../utils/resource");

const userCtrl = {
  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select("-password");

      if (!user) {
        return res.status(400).json({
          devMsg: resourceMessenger.msg.err.notExistUser,
          userMsg: resourceMessenger.msg.err.notExistUser,
        });
      }

      res.status(200).json(user);
    } catch (err) {
      return res.status(500).json({
        devMsg: err.message,
        userMsg: resourceMessenger.msg.err.generalUserMsg,
      });
    }
  },

  getUsers: async (req, res) => {
    try {
      const users = await User.aggregate([
        {
          $lookup: {
            from: "stories",
            localField: "stories",
            foreignField: "_id",
            as: "stories",
          },
        },
        {
          $sort: {
            fullName: 1,
          },
        },
      ]);

      return res.status(200).json(users);
    } catch (err) {
      return res.status(500).json({
        devMsg: err.message,
        userMsg: resourceMessenger.msg.err.generalUserMsg,
      });
    }
  },

  searchUsers: async (req, res) => {
    try {
      if (req.query.searchUser) {
        // const searchUsers = await User.find({
        //   $or: [
        //     {
        //       fullName: { $regex: new RegExp(req.query.searchUser, "i") },
        //     },
        //     {
        //       $text: { $search: req.query.searchUser },
        //     },
        //   ],
        // }).limit(20);

        // const searchUsers = await User.aggregate([
        //   {
        //     $regexMatch: {input: req.query.searchUser}
        //   }
        // ])

        res.json(searchUsers);
      }
    } catch (err) {
      return res.status(500).json({
        devMsg: err.message,
        userMsg: resourceMessenger.msg.err.generalUserMsg,
      });
    }
  },

  createStory: async (req, res) => {
    try {
      const { content, type } = req.body;

      const story = new Story({ content, type });

      await story.save();

      await User.findByIdAndUpdate(req.user._id, {
        $push: {
          stories: mongoose.Types.ObjectId(story._id),
        },
      });

      res.status(200).json({
        msg: "Story has been successfully created.",
        story: {
          ...story._doc,
        },
      });
    } catch (err) {
      return res.status(500).json({
        devMsg: err.message,
        userMsg: resourceMessenger.msg.err.generalUserMsg,
      });
    }
  },

  deleteStory: async (req, res) => {
    try {
      await User.findByIdAndUpdate(req.user._id, {
        $pull: {
          stories: req.params.id,
        },
      });

      await Story.findByIdAndDelete(req.params.id);

      res.json({ msg: "Story has been successfully deleted." });
    } catch (err) {
      return res.status(500).json({
        devMsg: err.message,
        userMsg: resourceMessenger.msg.err.generalUserMsg,
      });
    }
  },

  updateInfoUser: async (req, res) => {
    try {
      const {
        lastName,
        firstName,
        gender,
        dateOfBirth,
        avatar,
        wallpaper,
        address,
        school,
        work,
        bio,
      } = req.body;

      const newUser = await User.findByIdAndUpdate(
        req.user._id,
        { ...req.body, fullName: firstName + " " + lastName },
        {
          new: true,
        }
      );

      res.status(200).json({ newUser });
    } catch (err) {
      return res.status(500).json({
        devMsg: err.message,
        userMsg: resourceMessenger.msg.err.generalUserMsg,
      });
    }
  },

  updatePrivacyUser: async (req, res) => {
    try {
      const { email, password, phoneNumber } = req.body;

      if (password) {
        const password = await bcrypt.hash(password, 12);

        await User.findByIdAndUpdate(req.user._id, {
          password: passwordHash,
        });
      }

      await User.findByIdAndUpdate(req.user._id, {
        email: email,
        phoneNumber: phoneNumber,
      });

      res
        .status(200)
        .json({ msg: resourceMessenger.msg.success.updatePrivacy });
    } catch (err) {
      return res.status(500).json({
        devMsg: err.message,
        userMsg: resourceMessenger.msg.err.generalUserMsg,
      });
    }
  },

  // Get all for Admin
  getAll: async (req, res) => {
    try {
      let users = await User.find();

      if (!users) {
        return res.status(204);
      }

      res.status(200).json({
        users,
      });
    } catch (err) {
      return res.status(500).json({
        devMsg: err.message,
        userMsg: resourceMessenger.msg.err.generalUserMsg,
      });
    }
  },

  sendFriendRequest: async (req, res) => {
    const user = req.user;
    const { id } = req.params;

    try {
      const currentUser = await User.findById(user.id);

      const checkTargetMember = await User.findById(id);
      if (!checkTargetMember) {
        return res.status(400).json({ message: "Target user not exists." });
      }

      const checkExistsSentRequest = checkTargetMember.requestFriendSent.some(
        (e) => e === id
      );
      if (checkExistsSentRequest) {
        return res
          .status(400)
          .json({ message: "Request to this friend already been sent." });
      }

      const checkExistsReceivedRequest =
        checkTargetMember.requestFriendReceived.some((e) => e === id);
      if (checkExistsReceivedRequest) {
        return res
          .status(400)
          .json({ message: "This user had sent you a friend request." });
      }

      currentUser.requestFriendSent.push(id);
      await currentUser.save();

      checkTargetMember.requestFriendReceived.push(user.id);
      await checkTargetMember.save();

      res.status(200).json({ message: "Sent friend request" });
    } catch (err) {
      console.log(`Send friend request error: ${err}`);
      res.status(400).json({ message: "Send friend request error." });
    }
  },

  getListFriendRequestSent: async (req, res) => {
    const user = req.user;

    try {
      const listFriendRequest = await User.findById(user.id).populate(
        "requestFriendSent"
      );

      return res.status(200).json(listFriendRequest.requestFriendSent);
    } catch (err) {
      console.log(`Get list friend request error: ${err}`);
      res.status(400).json({
        message: "Get list friend request error.",
      });
    }
  },

  getListFriendRequestReceived: async (req, res) => {
    const user = req.user;

    try {
      const listFriendRequest = await User.findById(user.id).populate(
        "requestFriendReceived"
      );

      return res.status(200).json(listFriendRequest.requestFriendReceived);
    } catch (err) {
      console.log(`Get list friend request error: ${err}`);
      res.status(400).json({
        message: "Get list friend request error.",
      });
    }
  },

  acceptFriendRequest: async (req, res) => {
    const user = req.user;
    const { id } = req.params;

    try {
      const currentUser = await User.findById(user.id);

      const checkExistsRequest = currentUser.some((e) => e === id);
      if (!checkExistsRequest) {
        return res.status(400).json({ message: "Not allowed." });
      }

      currentUser.requestFriendReceived =
        currentUser.requestFriendReceived.filter((e) => e !== id);

      currentUser.friends.push(id);

      await currentUser.save();
    } catch (err) {
      console.log(`Accept friend request error: ${err}`);
      res.status(400).json({ message: "Accept friend request error." });
    }
  },

  rejectFriendRequest: async (req, res) => {
    const user = req.user;
    const { id } = req.params;

    try {
      const currentUser = await User.findById(user.id);

      const checkExistsRequest = currentUser.some((e) => e === id);
      if (!checkExistsRequest) {
        return res.status(400).json({ message: "Not allowed." });
      }

      currentUser.requestFriendReceived =
        currentUser.requestFriendReceived.filter((e) => e !== id);

      await currentUser.save();

      res.status(200).json({ message: "Rejected this request." });
    } catch (err) {
      console.log(`Reject friend request error: ${err}`);
      res.status(400).json({
        message: "Reject friend request error.",
      });
    }
  },
};

module.exports = userCtrl;
