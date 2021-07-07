// Node server which will handle socket io connections
const io = require('socket.io')(8000, {
    cors: {
        origin: '*',
    }
});

const users = {};
//io.on  is a socket.io instance which listens many socket connections
io.on('connection', socket => {
    //socket.on handles what should be done if a user joins or something
    // If any new user joins, let other users connected to the server know!
    socket.on('new-user-joined', name => {    
        users[socket.id] = name;
        //socket.id is used so as many same named users may join
        socket.broadcast.emit('user-joined', name);
    });

    // If someone sends a message, broadcast it to other people
    socket.on('send', message => {
        socket.broadcast.emit('receive', {
            message: message,
            name: users[socket.id]
        })
    });

    // If someone leaves the chat, let others know 
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });


})