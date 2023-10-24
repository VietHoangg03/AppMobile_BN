const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const resourceMessenger = require("../utils/resource");
const { default: mongoose } = require("mongoose");

const messageCtrl = {
  getAllInConversation: async (req, res) => {
    const conversationId = req.params.conversationId;

    try {
      const messages = await Message.aggregate([
        {
          $match: {
            conversationId: mongoose.Types.ObjectId(conversationId),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "senderId",
            foreignField: "_id",
            as: "users",
          },
        },
      ]);
      res.status(200).json({ messages });
    } catch (err) {
      return res.status(500).json({
        devMsg: err.message,
        userMsg: resourceMessenger.msg.err.generalUserMsg,
      });
    }
  },

  getLastMessages: async (req, res) => {
    try {
      const lastMessages = await Message.aggregate([
        {
          $group: {
            _id: "$conversationId",
            content: {
              $last: "$content",
            },
            createdAt: {
              $last: "$createdAt",
            },
            msgType: {
              $last: "$msgType",
            },
            senderId: {
              $last: "$senderId",
            },
          },
        },
      ]);

      res.json({ lastMessages });
    } catch (err) {
      return res.status(500).json({
        devMsg: err.message,
        userMsg: resourceMessenger.msg.err.generalUserMsg,
      });
    }
  },

  getDefault: async (req, res) => {
    const { conversationId, offset } = req.query;
    let _offset = parseInt(offset);

    try {
      let messages = await Message.find({ conversationId })
        .sort({ createdAt: -1 })
        .limit(_offset + resourceMessenger.number.defaultMsg);

      if (!messages.length) {
        return res.status(204).json({
          messages,
          offset: _offset,
        });
      }

      res.status(200).json({
        messages,
        offset: _offset + resourceMessenger.number.defaultMsg,
      });
    } catch (err) {
      return res.status(500).json({
        devMsg: err.message,
        userMsg: resourceMessenger.msg.err.generalUserMsg,
      });
    }
  },

  getById: async (req, res) => {
    const _msgId = req.params.msgId;

    try {
      let message = await Message.findById(_msgId);

      if (!message) {
        return res.status(404).json({
          devMsg: `Message: ${resourceMessenger.msg.err.notFound}`,
          userMsg: resourceMessenger.msg.err.generalUserMsg,
        });
      }

      res.status(200).json({ message });
    } catch (err) {
      return res.status(500).json({
        devMsg: err.message,
        userMsg: resourceMessenger.msg.err.generalUserMsg,
      });
    }
  },

  searchMsg: async (req, res) => {
    const { searchText, conversationId } = req.query;

    try {
      const searchTextRegex = new RegExp(searchText, "i");

      const messages = await Message.find({
        conversationId,
        content: {
          $regex: searchTextRegex,
        },
      });

      if (!messages.length) {
        return res.status(204).json({ messages });
      }

      res.status(200).json({
        messages,
        searchText,
      });
    } catch (err) {
      return res.status(500).json({
        devMsg: err.message,
        userMsg: resourceMessenger.msg.err.generalUserMsg,
      });
    }
  },

  createMsg: async (req, res) => {
    try {
      const { conversationId, senderId, msgType, content } = req.body;
      const messageObj = { conversationId, senderId, msgType, content };

      // Validate data
      Object.keys(messageObj).forEach((field) => {
        if (!messageObj[field] && messageObj[field] !== 0) {
          return res.status(400).json({
            devMsg: `${field} ${resourceMessenger.msg.err.generalEmpty}`,
            userMsg: resourceMessenger.msg.err.generalUserMsg,
          });
        }
      });

      // Check if senderId is in the conversation?
      const conversation = await Conversation.findById(conversationId);
      console.log(conversation.members);
      if (!conversation.members.includes(senderId)) {
        return res.status(400).json({
          devMsg: `Message: ${resourceMessenger.msg.err.missingInfo}`,
          userMsg: resourceMessenger.msg.err.generalUserMsg,
        });
      }

      // Everything is OKAY
      const newMessage = new Message({
        conversationId,
        senderId,
        msgType,
        content,
        isDeleted: false,
      });

      await newMessage.save();

      await Conversation.findByIdAndUpdate(conversationId, {
        updatedAt: Date.now,
      });

      res.status(201).json({
        msg: resourceMessenger.msg.success.messageCreate,
        content: newMessage,
      });
    } catch (err) {
      return res.status(500).json({
        devMsg: err.message,
        userMsg: resourceMessenger.msg.err.generalUserMsg,
      });
    }
  },

  removeMsg: async (req, res) => {
    try {
      const _messageId = req.params.messageId;
      const message = await Message.findByIdAndUpdate(_messageId, {
        isDeleted: true,
      });

      if (!message) {
        return res.status(404).json({
          devMsg: `Message ${resourceMessenger.msg.err.notFound}`,
          userMsg: resourceMessenger.msg.err.generalUserMsg,
        });
      }

      res.status(200).json({
        message,
        alternative: resourceMessenger.msg.success.removeMessage,
      });
    } catch (err) {
      return res.status(500).json({
        devMsg: err.message,
        userMsg: resourceMessenger.msg.err.generalUserMsg,
      });
    }
  },

  getTheLast: async (req, res) => {
    const conversationId = req.params.conversationId;

    try {
      const lastMessage = await Message.aggregate([
        {
          $match: {
            conversationId: mongoose.Types.ObjectId(conversationId),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "senderId",
            foreignField: "_id",
            as: "users",
          },
        },
      ])
        .sort({ createdAt: -1 })
        .limit(1);

      if (!lastMessage) {
        return res.status(404).json({
          devMsg: `Last message: ${resourceMessenger.msg.err.notFound}`,
          userMsg: resourceMessenger.msg.err.generalUserMsg,
        });
      }

      res.status(200).json(lastMessage[0]);
    } catch (err) {
      return res.status(500).json({
        devMsg: err.message,
        userMsg: resourceMessenger.msg.err.generalUserMsg,
      });
    }
  },
};

module.exports = messageCtrl;
