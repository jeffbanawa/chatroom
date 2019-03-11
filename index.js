var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

let users = [];
let connections = [];
let history = [];

app.use(express.static(__dirname + '/public'));
/*
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});
*/

io.on('connection', function(socket){
    var i = 1;
    let name = "User" + i;
    while (users.indexOf(name) >= 0) {
        i++;
        name = "User" + i;
    }
    users.push(name);
    io.emit('update user', users);
    socket.emit('change header', name);
    socket.emit('get history', history);

    connections.push(socket);
    console.log('%s Connected: %s sockets connected', name, connections.length);

    // Send message
    socket.on('chat message', function(msg){
        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var chat = time + " " + name + ": " + msg;
        if (history.length >= 200) {
            history.splice(0, 1);
            history.push(chat)
        }
        history.push(chat);
        io.emit('chat message', chat);

        if (msg.includes("/nick ")) {
            var newName = msg.split('/nick ')[1];
            if (users.indexOf(newName) >= 0) {
                socket.emit('invalid name', newName)
            }
            else {
                var index = users.indexOf(name);
                users.splice(index, 1);
                name = newName;
                users.push(name);
                io.emit('update user', users);
                socket.emit('first connect', name);
                socket.emit('change header', name);
            }
        }
    });

    // Disconnect
    socket.on('disconnect', function(){
        users.splice(users.indexOf(name), 1);
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
        io.emit('update user', users);

    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});