const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const {Server} = require('socket.io');
const {sendMessage, createMessage} = require('./controllers/messageController');
const { text } = require('stream/consumers');

// dotenv file in our server
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
}
);
const PORT = process.env.PORT || 6000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

// Routes in server file
app.use('/api/messages', require('./routes/messagesRoute'));

// Root route
app.get('/', (req, res) => {
    res.send({
        message: "Real Chat App Server",
        version: "1.0.0",
        endpoints: {
            getAllMessages: 'GET /api/messages',
            createMessage: 'POST /api/messages',
            deleteAllMessages: 'DELETE /api/messages',
            testClient: 'GET ./index.html'
        }
    });
});

// socket connection in the backend
io.on('connection', (socket) =>{
    console.log("User socked id is:", socket.id);

    // send welcome message when connected
    socket.emit('message', {
        user: "System",
        text: "Welcome to the Real Time Chat",
        timestamp: new Date().toISOString()
    });

    socket.broadcast.emit('message', {
        user: "System",
        text: "A new user joined the chat",
        timestamp: new Date().toISOString()
    });

    // Typing functionality
    socket.on('typing', (data) => {
        socket.broadcast.emit('userTyping', data);
    });

    // send and receive the messages
    socket.on('sendMessage', (data) => {
        const newMessage = sendMessage(data);
        io.emit('receiveMessage', newMessage);
    });

    // disconnect functionality
    socket.on('disconnect', () => {
        console.log("User disconnected: ", socket.id);
        io.emit('message', {
            user: "System",
            text: "User left the chat",
            timestamp: new Date().toISOString()
        });
    });
});

// Error handling
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Message Not Found!"
    })
})

app.use((err, req, res) => {
    res.status(500).json({
        success: false,
        message: "Something went wrong!",
        error: err.message
    })
})

server.listen(PORT, () => {
    console.log(`Server is running at port number: ${PORT}`)
})