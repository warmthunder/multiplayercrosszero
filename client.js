const canvas = document.getElementById('mycanvas');
const c = canvas.getContext("2d");

const socket = new WebSocket("wss://https://multiplayercrosszeroserver.onrender.com");
socket.onopen = () => {
    console.log("Connected to server");
};

c.fillStyle = '#F5C26B';

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let team = '';

let mousex = 0;
let mousey = 0;
let btnpress = false;

let row = -1;
let column = -1;

let game = [
        ["","",""],
        ["","",""],
        ["","",""]

];

let intromessage = "Welcome!";

let currentmove = "O";
let turn = true;

let over = false;
let winner = "";

window.addEventListener('mousemove',(event)=>{
    mousex = event.clientX;
    mousey = event.clientY;
    if(mousex<600 && mousey <600){
        row = Math.floor(mousex/200);
        column = Math.floor(mousey/200);
    }
    else
    {
        row = -1;
        column = -1;
    }


})

window.addEventListener('mousedown',(event)=>{
btnpress = true;
})

window.addEventListener('mouseup',(event)=>{
btnpress = false;
})

 socket.onmessage = (msg)=>{
    
    let values = JSON.parse(msg.data);
    if(values.type === "wait"){
        turn = false;
        return;
    }
    if(values.over){
        over=true;
        winner = values.win;
        console.log(winner);
    }
    turn = true;
    game[0] = values.message[0];
    game[1] = values.message[1];
    game[2] = values.message[2];
    currentmove = values.move;
    turn = !values.turn;
    

};

function animate(){


c.fillStyle = '#F5C26B';
c.fillRect(0,0,window.innerWidth,window.innerHeight);

c.beginPath();
c.moveTo(200,0);
c.lineTo(200,600);
c.lineWidth = 5;
c.strokeStyle = "blue";
c.stroke();

c.beginPath();
c.moveTo(400,0);
c.lineTo(400,600);
c.lineWidth = 5;
c.strokeStyle = "blue";
c.stroke();

c.beginPath();
c.moveTo(0,200);
c.lineTo(600,200);
c.lineWidth = 5;
c.strokeStyle = "blue";
c.stroke();

c.beginPath();
c.moveTo(0,400);
c.lineTo(600,400);
c.lineWidth = 5;
c.strokeStyle = "blue";
c.stroke();

for(let i = 0;i<3;i++){
    for(let j = 0; j<3;j++){
        if(game[i][j]!=""){
            c.lineWidth = 5;
            c.font = "150px Arial";
            c.strokeText(game[i][j],200*(j)+50,200*(i)+150);
        }
    }
}

if(!over){
c.font = "50px Arial";
let welcome = turn?"Your turn":"Not your turn";
c.lineWidth = 0.8;
c.strokeText(welcome,700,150);

}

if(btnpress){
    // currentmove = currentmove=="X"?"O":"X";
   
    // send mouse position to server
         socket.send(JSON.stringify({
            row: row,
            col: column
        }));
    
    btnpress = false;
}

if(over){
    c.font = "50px Arial";
    c.lineWidth = 0.8;
    c.strokeText(`${winner} Won!`,700,350);
}
if(!over)
requestAnimationFrame(animate);


}
animate();

