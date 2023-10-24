const { ObjectId } = require("mongodb");
const resourceMessenger = require("../utils/resource");
const Conversation = require("../models/Conversation");
const User = require("../models/User");

const conversationCtrl = {
  getAll: async (req, res) => {
    try {
      let conversations = await Conversation.find();

      if (!conversations.length) {
        return res.status(204).json({ conversations });
      }

      res.status(200).json({ conversations });
    } catch (err) {
      return res.status(500).json({
        devMsg: err.message,
        userMsg: resourceMessenger.msg.err.generalUserMsg,
      });
    }
  },

  getById: async (req, res) => {
    const _id = req.params.id;

    try {
      const conversation = await Conversation.findById(_id);

      if (!conversation) {
        return res.status(404).json({
          devMsg: `Conversation ${resourceMessenger.msg.err.notFound}`,
          userMsg: resourceMessenger.msg.err.generalUserMsg,
        });
      }

      res.status(200).json(conversation);
    } catch (err) {
      return res.status(500).json({
        devMsg: err.message,
        userMsg: resourceMessenger.msg.err.generalUserMsg,
      });
    }
  },

  // Get by user Id (it is auth id actually)
  getDefault: async (req, res) => {
    const _userId = ObjectId(req.params.userId);

    try {
      // get all conversation of the user (temporarily)
      // let conversations = await Conversation.find({
      //   "members.$.idUser": _userId,
      // }).sort({ updatedAt: -1 });

      const conversations = await Conversation.aggregate([
        { $match: { "members.idUser": _userId } },
        {
          $lookup: {
            from: "messages",
            localField: "_id",
            foreignField: "conversationId",
            as: "cntMessages",
          },
        },
        {
          $sort: {
            updatedAt: -1,
          },
        },
      ]);

      // .limit(resourceMessenger.number.defaultConversation);

      if (!conversations.length) {
        return res.status(204).json({ conversations });
      }

      res.status(200).json({ conversations });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        devMsg: err.message,
        userMsg: resourceMessenger.msg.err.generalUserMsg,
      });
    }
  },

  // Get by
  get1vs1: async (req, res) => {
    const { peerA, peerB } = req.query;

    try {
      const conversation = await Conversation.find({
        title: "1vs1",
        "members.0.idUser": peerA,
        "members.1.idUser": peerB,
      });

      if (!conversation.length) {
        return res.status(204).json({ msg: "Conversation is not available!" });
      }

      res.status(200).json(conversation);
    } catch (err) {
      return res.status(500).json({
        devMsg: err.message,
        userMsg: resourceMessenger.msg.err.generalUserMsg,
      });
    }
  },

  deleteConversation: async (req, res) => {
    try {
      const conversationId = req.params.conversationId;
      const offsetMsg = req.query.offset;

      const conversation = await Conversation.updateOne(
        { _id: conversationId, "members.idUser": req.user._id },
        {
          $set: {
            "members.$.show": false,
            "members.$.offset": offsetMsg,
          },
        }
      );

      res.status(200).json({ conversation });
    } catch (err) {
      return res.status(500).json({
        devMsg: err.message,
        userMsg: resourceMessenger.msg.err.generalUserMsg,
      });
    }
  },

  getMembers: async (req, res) => {
    let { conversationId } = req.params;

    try {
      let conversation = await Conversation.findById(conversationId);
      let membersId = conversation.members.map((id) => {
        return ObjectId(id);
      });

      let members = await User.find({
        _id: { $in: membersId },
      });

      if (!members.length) {
        return res.status(204).json({ members });
      }

      res.status(200).json({ members });
    } catch (err) {
      return res.status(500).json({
        devMsg: err.message,
        userMsg: resourceMessenger.msg.err.generalUserMsg,
      });
    }
  },

  create: async (req, res) => {
    const { title, members } = req.body;

    // Validate data from request
    // Check if not title or not members
    if (!title || !members) {
      return res.status(400).json({
        devMsg: `Conversation: ${resourceMessenger.msg.err.missingInfo}`,
        userMsg: resourceMessenger.msg.err.generalUserMsg,
      });
    }

    // Check if members contains less than 2 people
    if (members.length < 2) {
      return res.status(400).json({
        devMsg: `Conversation: ${resourceMessenger.msg.err.missingInfo}`,
        userMsg: resourceMessenger.msg.err.generalUserMsg,
      });
    }

    // Check if duplicated Conversation 1vs1
    if (title === "1vs1") {
      const conversations = await Conversation.find({ title, members });
      if (conversations.length > 0) {
        return res.status(400).json({
          devMsg: `Conversation: ${resourceMessenger.msg.err.duplicated1vs1}`,
          userMsg: resourceMessenger.msg.err.generalUserMsg,
        });
      }
    }

    try {
      const conversation = new Conversation({
        title,
        members,
      });

      await conversation.save();

      res.status(201).json(conversation);
    } catch (err) {
      return res.status(500).json({
        devMsg: err.message,
        userMsg: resourceMessenger.msg.err.generalUserMsg,
      });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { title, members } = req.body;
    try {
      await Conversation.findByIdAndUpdate(id, {
        title,
        members,
      });

      res.status(200).json({ message: "Update conversation successfully!" });
    } catch (err) {
      return res.status(500).json({
        devMsg: err.message,
        userMsg: resourceMessenger.msg.err.generalUserMsg,
      });
    }
  },
};

module.exports = conversationCtrl;
