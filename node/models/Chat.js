const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    createdaAt: {
        type: Date,
        default: Date.now()
    },
    recivers: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required:true
    }]

});
const Chat = mongoose.model('Chat', ChatSchema);
module.exports = Chat;