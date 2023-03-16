// const socket = io('http://localhost:8000');
const socket = io('/', { transports: ['websocket'] })

// get dom element in respective js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector(".container")

//audio that will play on receving the message
var audio = new Audio('audio.wav');

//function which will append the event into to the container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position == 'left') {
        audio.play();
    }
}

//ask new user for his name and let the server know
const name = prompt("enter your name to join");
socket.emit('new-user-joined', name);

//if a new user joins, receive his name from the server
socket.on('user-joined', name => {
    append(`${ name } joined the chat`, 'right');
})

//if server sends a message, receive it
socket.on('receive', data => {
    append(`${ data.name } : ${ data.message }`, 'left');
})

//if a user leaves the chat, append the info to the container
socket.on('left', name => {
    append(`${ name } left the chat`, 'right');
})

//if the form gets submitted send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`you: ${ message }`, 'right');
    socket.emit('send', message);
    messageInput.value = "";
})

// append.use(function(req,res,next){
//     res.header("access-control-allow-origin", "*");
//     res.header("access-control-allow-headers", "Origin,x-Requested-With,Content-Type,Accept");
//     next();
// });