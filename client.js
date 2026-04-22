const canvas = document.getElementById('mycanvas');
const c = canvas.getContext("2d");

const socket = new WebSocket("ws://localhost:8080");

c.fillStyle = '#F5C26B';

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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

let currentmove = "X";

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

function checkwinner(arr){
    for(let i = 0;i<3;i++){
        if(arr[0][i]!= "" && arr[1][i] == arr[2][i] && arr[1][i] == arr[0][i] ){
            over = true;
            winner = arr[1][i];
            return;
        }
        if(arr[i][0]!= "" && arr[i][0] == arr[i][1] && arr[i][1] == arr[i][2]){
            over = true;
            winner = arr[i][1];
            return;
        }
        if(arr[1][1]!= "" && arr[1][1] == arr[2][2] && arr[1][1] == arr[0][0]){
            over = true;
            winner = arr[1][1];
            return;
        }
        if(arr[0][2]!= "" && arr[0][2] == arr[1][1] && arr[1][1] == arr[2][0]){
            over = true;
            winner = arr[1][1];
            return;
        }
    }
}

function animate(){
    checkwinner(game);

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

if(btnpress){
    if(game[column][row]===""){
        game[column][row] = currentmove;
        currentmove = currentmove=="X"?"O":"X";
   
    // send mouse position to server

    }
    btnpress = false;
}

if(!over){
c.font = "50px Arial";
let turn = currentmove=="X"?1:2;
c.lineWidth = 0.8;
c.strokeText(`Player ${turn}`,700,150);
c.strokeText(`Turn`,700,200);
}

if(winner){
    c.font = "50px Arial";
    c.lineWidth = 0.8;
    c.strokeText(`${winner} Won!`,700,350);
}
if(!over)
requestAnimationFrame(animate);
}

animate();

