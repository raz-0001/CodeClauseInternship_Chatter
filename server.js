const express = require('express')
const app = express()
const http = require('http').createServer(app);
var users={};

const PORT = process.env.PORT || 3000

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

// Socket 
const io = require('socket.io')(http)

io.on('connection', (socket) => {
    console.log('Connected...');
    


    socket.on('message',(msg)=>{
        socket.broadcast.emit('message',msg);
        if(msg.message.includes("JOINED")){
            users[socket.id]=msg.user;
        }
    })

    socket.on('disconnect',()=>{
        socket.broadcast.emit('message',{
            user:users[socket.id],
            message: `${users[socket.id]} has LEFT`
        });
        delete users[socket.id];
    })
})