const Messages = require('../../Model/Messages/messageSchema')
const Conversation = require("../../Model/Messages/conversationSchema")

const sendMessage = async(req, res) =>{
    try {
        const {senderId} = req.params
        const {sender,receiverId, message} = req.body 
    
        if(!message || !sender || !receiverId || !senderId){
            res.status(400).json({message: "Please enter valid message"})
        }else{
            const message_new = await Messages.create({senderId, sender: sender === "Doctor" ? "Doctor" : "Patient", receiverId, message, receiver: sender === "Doctor" ? "Patient" : "Doctor"})
            const conversationExisit = await Conversation.findOne({participants: {$all : [senderId, receiverId]}})
    
            if(!conversationExisit){
                const new_conversation = await Conversation.create({participants:[senderId, receiverId]})
                new_conversation.messageIds.push(message_new._id)
                new_conversation.save()
                res.status(200).json({message:"Message sent conversation does not exists"})
            }else if(conversationExisit){
                conversationExisit.messageIds.push(message_new._id)
                await conversationExisit.save()
                res.status(200).json({message:"Message sent conversation exists"})
            }
        }
    } catch (error) {
        throw new Error(error.error)
        // console.log(error)
    }
} 

module.exports = {sendMessage}