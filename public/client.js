const socket = io()

let names;
let textarea=document.querySelector('#textarea');
let messageArea=document.querySelector('.message__area');
let button=document.querySelector('#slogo');
var audio=new Audio('tune.mp3');

do{
 names=prompt("Enter your name:");
}while(!names);

socket.emit('message',{user:names,
message:`${names} has JOINED`});

textarea.addEventListener('keyup',(e)=>{
    if(e.key==='Enter'){
        sendMsg(e.target.value);
    }
})

button.addEventListener('click',()=>{
    sendMsg(textarea.value);
})

function sendMsg(content){
    let msg={
        user:names,
        message:content.trim()
    }

    appendMessage(msg,'outgoing');
    textarea.value='';
    scrolltoBottom();
    
    socket.emit('message',msg);

}


function appendMessage(msg,type){
    let mainDiv=document.createElement('div');
    let className=type;
    mainDiv.classList.add(className,'message');

    let markup=`
    <h4>${msg.user}</h4>
    <p>${msg.message}</p>
    `;

    mainDiv.innerHTML=markup;
    messageArea.appendChild(mainDiv);
    
    if(mainDiv.classList.contains("incoming") && !msg.message.includes("JOINED")){
        audio.play();
    }
}


socket.on('message',(msg)=>{
    appendMessage(msg,'incoming');
    scrolltoBottom();
})


function scrolltoBottom(){
    messageArea.scrollTop=messageArea.scrollHeight;
}

