$(function () {
    var socket = io();
    $('form').submit(function(e){
        e.preventDefault(); // prevents page reloading
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });
    socket.on('chat message', function(msg){
        var message = formatMsg(msg);
        $('#messages').append(message);
        goDown();
    });

    socket.on('change header', function (msg) {
        $( "header" ).html("You are " + msg + "!");
        goDown();
    });

    socket.on('update user', function (msg) {
        $('#users').empty();
        for (var i = 0; i < msg.length; i++) {
            $('#users').append($('<li>').text(msg[i]));
        }
    });

    socket.on('invalid name', function (msg) {
        $('#messages').append($('<li>').text(msg + " is already taken. Try a different nickname!"));
    });

    socket.on('get history', function (msg) {
        $('#messages').empty();
        for (var i = 0; i < msg.length; i++) {
            $('#messages').append($('<li>').text(msg[i]));
        }
    });

    function goDown() {
        let div = document.getElementById("messages");
        div.scrollTop = div.scrollHeight;
    }

    function formatMsg(msg) {
        var formatted = "<li><b>" + msg + "</b></li>";
        return formatted;
    }


});