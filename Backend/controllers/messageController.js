// Mock database messages

let messages = [
    {
        id: 1,
        text: "Hello, welcome to the real chat app!",
        user: "Jean D Amour",
        timestamp: new Date().toISOString()
    },
    {
        id: 2,
        text: "Hello, welcome to the real chat app!",
        user: "Kubwimana",
        timestamp: new Date().toISOString()
    },
];

// Get all messages controller
const getAllMessages = ((req,res)=>{
    try {
        res.json({
            success: true,
            count: messages.length,
            data: messages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error!",
            error: error.message
        });
    }
});

// Create messages controller
const createMessage = ((req, res) => {
    try {
        const {text, user} = req.body;

        // Validation
        if(!text || !user) {
            return res.status(400).json({
                success: false,
                message: "Please, provide the messages texts"
            });
        }

        const newMessage = {
            id: messages.length + 1,
            text,
            user,
            timestamp: new Date().toISOString()
        };

        messages.push(newMessage);
        res.status(201).json({
            success: true,
            message: "messages created",
            data: messages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error!",
            error: error.message
        });
    }
});

// Delete all messages controller
const deleteAllMessages = ((req, res) => {
    try {
        messages = [];
        res.json({
            success: true,
            message: "All messages are deleted",
            data: messages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error!",
            error: error.message
        });
    }
});

// Sending new message
const sendMessage = (messageData) => {
    const newMessage = {
        id: messages.length + 1,
        text: messageData.text,
        user: messageData.user,
        timestamp: new Date().toISOString()
    };
    messages.push(newMessage);
    return newMessage;
}

module.exports = {
    getAllMessages,
    createMessage,
    deleteAllMessages,
    sendMessage
}