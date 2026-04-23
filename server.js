const WebSocket = require("ws");

const wss = new WebSocket.Server({port:8080});

console.log("server running");

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
let data;
wss.on("connection", (ws) => {
    console.log("Client connected");
    game = [
        ["","",""],
        ["","",""],
        ["","",""]
   

];
 over = false;

    ws.on("message", (msg) => {
        
        data = JSON.parse(msg.toString());
        game[data.col][data.row] = data.team;
        currentmove = data.team;
        checkwinner(game);
        
        wss.clients.forEach(client => {
                if(client.readyState === WebSocket.OPEN){

        if(over){
             
                client.send(JSON.stringify({
            over:true,
            win:winner,
            message: game,
            move:currentmove}));
        }
        else{
         client.send(JSON.stringify({
            over:false,
            message: game,
            move:currentmove
        }))};
                }})

    });

     
});
