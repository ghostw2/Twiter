const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatMessageSchema = new Schema({
    chat: {
        type: Schema.Types.ObjectId,
        ref: 'Chat',
        required: true,
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        reqired: true
    },
    message: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const ChatMessage = mongoose.model("ChatMessage", ChatMessageSchema);
module.exports = ChatMessage;