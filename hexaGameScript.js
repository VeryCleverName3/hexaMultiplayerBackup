// Variables & stuff

makeThePage();

var firstTimeLoading = false;

var multiplayer = false;

var gameId = window.location.href.split("#")[1];
if(gameId == undefined){
  gameId = "";
}
var creds = gameId.split("-");

if(creds[0] == ""){
  creds = [];
}

if(creds.length != 0){
  document.body.style.backgroundColor = "rgba(255, 0, 0, 0.3)";
}

var wsURL = "ws://cleverlynamedwebsite.pw:10186";

if(creds.length != 0){
  var ws = new WebSocket(wsURL);
}

var myTurn;

if(creds.length != 0){
  ws.onmessage = (e)=>{
    data = JSON.parse(e.data);
    if(data.ask && data.gameId == gameId){
      ws.send(JSON.stringify({move: undefined, gameId: gameId, hexagons: hexagons, turn: turn, players: players}));
    } 
    else if(data.gameId == gameId){
      console.log(data);
      var count = 0;
      for(var i = 0; i < data.hexagons.length; i++){
        count += data.hexagons[i][2] != 0;
        count -= hexagons[i][2] != 0;
      }
      if(count > 0){
        players = data.players;
        for(i in data.hexagons){
          data.hexagons[i][0][0] = hexagons[i][0][0];
          data.hexagons[i][0][1] = hexagons[i][0][1];
        }
        hexagons = data.hexagons;
        updateScoreboard();
        drawHexagons();
        turn = data.turn;
        switch(turn){
          case 0:
            bgColorFadeTo(255, 0, 0);
            break;
          case 1:
            bgColorFadeTo(0, 150, 255);
            break;
          case 2:
            bgColorFadeTo(255, 255, 0);
            break;
          case 3:
            bgColorFadeTo(0, 255, 0);
            break;
          case 4:
            bgColorFadeTo(255, 0, 255);
            break;
          case 5:
            bgColorFadeTo(0, 255, 255);
            break;
        }
      }
      if(data.move != undefined){
        move = data.move;
        update(0, 0, move);
      }
    }
  }
}

if(creds.length != 0){
  window.onload = () => {ws.send(JSON.stringify({ask: true, gameId: gameId}));}
}

var scale = 2;
if(localStorage.mobile == undefined) localStorage.mobile = "false";
var c = document.getElementById("mainCanvas");
c.height = window.innerHeight;
if(localStorage.mobile == "false") c.height *= scale;
document.body.style.zoom = 1 / scale;
if(localStorage.mobile == "true") document.body.style.zoom = 1;
c.width = c.height;
s = c.width;
var realTime = 0;
var hexSize = 3;
var makeTimerHappen;
var importantNumber = 1.95;//1.95
var turn = 0;
var players = 2;
var changed = false;
var bgColors = [0, 0, 0];
var started = false;
var flipping = false;
var animationsDisabled = false;
var ctx = c.getContext("2d");
ctx.lineWidth = 10;
var logo = new Image;
var undoButton = new Image;
undoButton.src = "Assets/UndoButton.svg";
var replayButton = new Image;
replayButton.src = "Assets/ReplayButton.svg";
var backButton = new Image
backButton.src = "Assets/BackButton.svg";
var playButton = new Image;
playButton.src = "Assets/PlayButton.svg";
logo.src = "hexalogo.svg";
var numbers = [new Image, new Image, new Image, new Image, new Image, new Image, new Image, new Image, new Image, new Image];
var oldMoves = [];
var turnNumber = 0;
var upArrow = new Image;
var downArrow = new Image;
upArrow.src = "Assets/UpArrow.svg";
downArrow.src = "Assets/DownArrow.svg";
for(var i = 0; i < numbers.length; i++){
  numbers[i].src = "Assets/" + i + ".svg";
}
logo.onload = function(){ctx.drawImage(logo, 0, -s * (1/6), s, s);};
ctx.textAlign = "center";
ctx.font = s / 25 + "px Yeee";
ctx.fillText("", 0, 0);
document.fonts.onloadingdone = function () {
  /*if(!firstTimeLoading)ctx.fillText("# of players:", s * (4.6 / 8), s * (3.0675 / 4));*/
  firstTimeLoading = true;
}
//playButton.onload = function(){ctx.drawImage(playButton, s * (1/4) - ((s / 2) / 2), s * (3/4) - ((s / 2) / 2), s / 2, s / 2);};
/*downArrow.onload = function(){ctx.drawImage(downArrow, s * (3 / 4) - (s / 8), s * (3/4) - ((s / 4) / 2) + (s / 12), s / 4, s / 4);};
upArrow.onload = function(){ctx.drawImage(upArrow, s * (3 / 4) - (s / 8), s * (3/4) - ((s / 4) / 2) - (s / 12), s / 4, s / 4);};*/
//numbers[2].onload = function(){ctx.drawImage(numbers[players], s * (3 / 4) - (s / 10), s * (3/4) - ((s / 5) / 2), s / 5, s / 5);};
var hexagons = [];
var hexImgs = [new Image, new Image, new Image, new Image, new Image, new Image, new Image, new Image];
hexImgs[0].src = "greyhex.svg";
hexImgs[1].src = "Assets/RedHex.svg";
hexImgs[2].src = "Assets/BlueHex.svg";
hexImgs[3].src = "darkgreyhex.svg";
hexImgs[4].src = "Assets/YellowHex.svg";
hexImgs[5].src = "Assets/GreenHex.svg";
hexImgs[6].src = "Assets/PurpleHex.svg";
hexImgs[7].src = "Assets/LightBlueHex.svg";
var colorLoop;
for(var i = 0; i < 91; i++){
  hexagons[i] = [[0, 0], [0, 0], 0, [-1, -1, -1, -1, -1, -1], 0];
}
makeHexagons();

hexagons[60][2] = 3;
hexagons[57][2] = 3;
hexagons[24][2] = 3;
hexagons[27][2] = 3;
hexagons[30][2] = 3;
hexagons[63][2] = 3;
hexagons[84][2] = 3;
hexagons[60][4] = 3;
hexagons[57][4] = 3;
hexagons[24][4] = 3;
hexagons[27][4] = 3;
hexagons[30][4] = 3;
hexagons[63][4] = 3;
hexagons[84][4] = 3;

var time = 0;

var optionsOpen = false;

var turnTimerBoxChecked = false;

var chessTimerBoxChecked = false;

var chessTimes = [0, 0, 0, 0, 0, 0];

onmousedown = function(e){
  if(!optionsOpen){
    var x = (e.clientX * scale);
    x -= ((window.innerWidth - (s / scale)) * (scale / 2));
    var y = e.clientY * scale;
    if(e.which == 1){
      if(started && !flipping) update(x, y);
      if(!started){
        //if(Math.hypot(y - s * (3/4), x -  s * (1/4)) < s / 12) start();
        /*if(Math.hypot(y - (s * (3/4) - (s / 12)), x - (s * (3 / 4))) < s / 50){
          players++;
          if(players > 6) players = 2;
          ctx.clearRect(s * (2 / 4) - (s / 10), s * (3/4) - ((s / 5) / 2), s / 5 + (s / 2), s / 5);
          ctx.drawImage(numbers[players], s * (3 / 4) - (s / 10), s * (3/4) - ((s / 5) / 2), s / 5, s / 5);
          ctx.drawImage(downArrow, s * (3 / 4) - (s / 8), s * (3/4) - ((s / 4) / 2) + (s / 12), s / 4, s / 4);
          ctx.drawImage(upArrow, s * (3 / 4) - (s / 8), s * (3/4) - ((s / 4) / 2) - (s / 12), s / 4, s / 4);
          ctx.fillText("# of players:", s * (4.6 / 8), s * (3.0675 / 4));
        }
        if(Math.hypot(y - (s * (3/4) + (s / 12)), x - (s * (3 / 4))) < s / 50){
          players--;
          if(players < 2) players = 6;
          ctx.clearRect(s * (2 / 4) - (s / 10), s * (3/4) - ((s / 5) / 2), s / 5 + (s / 2), s / 5);
          ctx.drawImage(numbers[players], s * (3 / 4) - (s / 10), s * (3/4) - ((s / 5) / 2), s / 5, s / 5);
          ctx.drawImage(downArrow, s * (3 / 4) - (s / 8), s * (3/4) - ((s / 4) / 2) + (s / 12), s / 4, s / 4);
          ctx.drawImage(upArrow, s * (3 / 4) - (s / 8), s * (3/4) - ((s / 4) / 2) - (s / 12), s / 4, s / 4);
          ctx.fillText("# of players:", s * (4.6 / 8), s * (3.0675 / 4));
        }*/
      }
    }
  }
}
onmousemove = function(e){
  var x = (e.clientX * scale);
  x -= ((window.innerWidth - (s / scale)) * (scale / 2));
  var y = e.clientY * scale;
  if(Math.hypot(y - (s * (3/4) - (s / 12)), x - (s * (3 / 4))) < s / 50 && !started){
    //console.log("yeet");
    /*ctx.clearRect(s * (2 / 4) - (s / 10), s * (3/4) - ((s / 5) / 2), s / 5 + (s / 2), s / 5);
    ctx.drawImage(numbers[players], s * (3 / 4) - (s / 10), s * (3/4) - ((s / 5) / 2), s / 5, s / 5);
    ctx.drawImage(downArrow, s * (3 / 4) - (s / 8), s * (3/4) - ((s / 4) / 2) + (s / 12), s / 4, s / 4);
    ctx.drawImage(upArrow, s * (3 / 4) - (s / 8), s * (3/4) - ((s / 4) / 2) - (s / 12), s / 4, s / 4);
    ctx.fillText("# of players:", s * (4.6 / 8), s * (3.0675 / 4));*/
  }
  if(Math.hypot(y - (s * (3/4) + (s / 12)), x - (s * (3 / 4))) < s / 50 && !started){
    //console.log("Yee");
    /*ctx.clearRect(s * (2 / 4) - (s / 10), s * (3/4) - ((s / 5) / 2), s / 5 + (s / 2), s / 5);
    ctx.drawImage(numbers[players], s * (3 / 4) - (s / 10), s * (3/4) - ((s / 5) / 2), s / 5, s / 5);
    ctx.drawImage(downArrow, s * (3 / 4) - (s / 8), s * (3/4) - ((s / 4) / 2) + (s / 12), s / 4, s / 4);
    ctx.drawImage(upArrow, s * (3 / 4) - (s / 8), s * (3/4) - ((s / 4) / 2) - (s / 12), s / 4, s / 4);
    ctx.fillText("# of players:", s * (4.6 / 8), s * (3.0675 / 4));*/
  }
}
ontouchstart = function(e){
  if(started) update(e.touches[0].clientX - ((window.innerWidth-s) / 2), e.touches[0].clientY);
  if(!started){
    var x = e.touches[0].clientX - ((window.innerWidth-s) / 2);
    var y = e.touches[0].clientY;
    if(Math.hypot(y - s * (3/4), x -  s * (1/4)) < s / 12) start();
    /*if(Math.hypot(y - (s * (3/4) - (s / 12)), x - (s * (3 / 4))) < s / 50){
      players++;
      if(players > 6) players = 2;
      ctx.clearRect(s * (3 / 4) - (s / 10), s * (3/4) - ((s / 5) / 2), s / 5, s / 5);
      ctx.drawImage(numbers[players], s * (3 / 4) - (s / 10), s * (3/4) - ((s / 5) / 2), s / 5, s / 5);
      ctx.drawImage(downArrow, s * (3 / 4) - (s / 8), s * (3/4) - ((s / 4) / 2) + (s / 12), s / 4, s / 4);
      ctx.drawImage(upArrow, s * (3 / 4) - (s / 8), s * (3/4) - ((s / 4) / 2) - (s / 12), s / 4, s / 4);
      ctx.fillText("# of players:", s * (4.6 / 8), s * (3.0675 / 4));
    }
    if(Math.hypot(y - (s * (3/4) + (s / 12)), x - (s * (3 / 4))) < s / 50){
      players--;
      if(players < 2) players = 6;
      ctx.clearRect(s * (3 / 4) - (s / 10), s * (3/4) - ((s / 5) / 2), s / 5, s / 5);
      ctx.drawImage(numbers[players], s * (3 / 4) - (s / 10), s * (3/4) - ((s / 5) / 2), s / 5, s / 5);
      ctx.drawImage(downArrow, s * (3 / 4) - (s / 8), s * (3/4) - ((s / 4) / 2) + (s / 12), s / 4, s / 4);
      ctx.drawImage(upArrow, s * (3 / 4) - (s / 8), s * (3/4) - ((s / 4) / 2) - (s / 12), s / 4, s / 4);
      ctx.fillText("# of players:", s * (4.6 / 8), s * (3.0675 / 4));
    }*/
  }
  localStorage.mobile = "true";
}

var winner = "yee";

//Most stuff happens here
function  update(mX, mY, move){
  if(myTurn == undefined && move == undefined){
    myTurn = turn;
  }

  if(move == undefined && myTurn != turn && creds.length != 0){
    return;
  }
  if(mX >= (s * (6 /8)) && mY >= (s * (6 /8))) undo();
  //console.log("(" + mX + ", " + mY + ")");
  //Send mouse to shadow realm
  if(winner != "yee"){
    mX = "shadow realm";
  }

  if(move != undefined){
    mX = hexagons[move][0][0];
    mY = hexagons[move][0][1];
  }

  for(var i = 0; i < 91; i++){
    if((mX >= hexagons[i][0][0] - (s/26) && mX <= hexagons[i][0][0] + (s/26) && mY >= hexagons[i][0][1] - (s/26) && mY <= hexagons[i][0][1] + (s/26)) && hexagons[i][2] == 0){
      oldMoves[turnNumber] = [];
      for(var j = 0; j < 91; j++){
        oldMoves[turnNumber][j] = hexagons[j][2];
      }
      if(creds.length != 0){ws.send(JSON.stringify({move: i, gameId: gameId, hexagons: hexagons, turn: turn, players: players}));}
      turnNumber++;
      switch(turn){
        case 0:
          flip(i, 1);
          break;
        case 1:
          flip(i, 2);
          break;
        case 2:
          flip(i, 4);
          break;
        case 3:
          flip(i, 5);
          break;
        case 4:
          flip(i, 6);
          break;
        case 5:
          flip(i, 7);
          break;
      }
      ////console.log("This is hexagon " + i);
      do {
        changed = !changed;
        var order;
          switch(turn){
            case 0:
              order = [1, 7, 6, 5, 4, 2];
              break;
            case 1:
              order = [2, 1, 7, 6, 5, 4];
              break;
            case 2:
              order = [4, 2, 1, 7, 6, 5];
              break;
            case 3:
              order = [5, 4, 2, 1, 7, 6];
              break;
            case 4:
              order = [6, 5, 4, 2, 1, 7];
              break;
            case 5:
              order = [7, 6, 5, 4, 2, 1];
              break;
          }
          for(var k = 0; k < 6; k++){
            for(var i = 0; i < 91; i++){
              if(hexagons[i][2] != 0 && hexagons[i][2] != 3){
                var near = [-1, 0, 0, -1, 0, 0, 0, 0];
                near[hexagons[i][2]]++;
                for(var j = 0; j < 6; j++){
                  if(hexagons[i][3][j] != -1){
                    if(hexagons[hexagons[i][3][j]][2] != 0 && hexagons[hexagons[i][3][j]][2] != 3)
                    near[hexagons[hexagons[i][3][j]][2]]++;
                  }
                }
                if(near[order[k]] > near[hexagons[i][2]]){
                  flip(i, order[k]);
                  k = -1;
                  changed = true;
                }
              }
            }
          }
      } while (changed);
      document.getElementsByClassName("chessTime")[turn].style.color = "black";
      turn++;
      var numTimesLooped = 0;
      if(turn >= players ) turn = 0;
      while(chessTimerBoxChecked && !(chessTimes[turn] > 0.5)){
        //if(turn >= players ) turn = 0;
        turn++;
        if(turn >= players) turn = 0;
        console.log(players)
        numTimesLooped++;
        if(numTimesLooped > 6){
          location.reload()
        }
      }
      time = 0;
      startTimerThingy();
      //if(turn >= players) turn = 0;
      switch(turn){
        case 0:
          bgColorFadeTo(255, 0, 0);
          break;
        case 1:
          bgColorFadeTo(0, 150, 255);
          break;
        case 2:
          bgColorFadeTo(255, 255, 0);
          break;
        case 3:
          bgColorFadeTo(0, 255, 0);
          break;
        case 4:
          bgColorFadeTo(255, 0, 255);
          break;
        case 5:
          bgColorFadeTo(0, 255, 255);
          break;
      }
    }
  }
  updateScoreboard();
  if(getScore()[6] == 0){
    var winnerNum = 0;
    var winners = [];
    winner = "";
    for(var i = 0; i < getScore().length; i++){
      if(getScore()[i] >= winnerNum){
        winnerNum = getScore()[i];
      }
    }
    for(var i = 0; i < getScore().length; i++){
      if(getScore()[i] == winnerNum){
        winners.push(i);
      }
    }
    for(var i = 0; i < winners.length; i++){
      switch(winners[i]){
        case 0:
          winners[i] = "red";
          break;
        case 1:
          winners[i] = "blue";
          break;
        case 2:
          winners[i] = "yellow"
          break;
        case 3:
          winners[i] = "green";
          break;
        case 4:
          winners[i] = "purple";
          break;
        case 5:
          winners[i] = "cyan";
          break;
      }

      winner += winners[i];
      if(winners.length > 2 && i < winners.length - 1) winner += ", ";
      if(i == winners.length - 2){
        winner += ((winners.length <= 2)?" ":"") + "and ";
      }
    }
    winner = winner[0].toUpperCase() + winner.substring(1);
    //console.log(winner + " Wins!");
    document.getElementById("winScreen").style.display = "flex";
    document.getElementById("winScreen").innerHTML = "<span id='winText'>" + winner + ((winners.length > 1)?" tie!":" wins!")+" </span>";
    
  }
}

function start(){

  startTimerThingy();
  var opacity = 0;
  setChessTimes();
  var startingSequence = setInterval(function(){
    opacity += 0.01;
    if(opacity > 1) opacity = 1;
    ctx.fillStyle = "rgba(255, 255, 255, " + opacity + ")";
    for(i of document.getElementsByClassName("fadable")){
      i.style.opacity = 1 - (opacity * 3);
    }
    //document.getElementById("actualPlayButton").style.opacity = 1 - (opacity * 3);
    ctx.fillRect(0, 0, s, s);
    if(opacity >= 0.5 && !started){
      document.getElementById("turnTimerCheckBox").disabled = true;
      document.getElementById("chessTimerCheckBox").disabled = true;
      document.getElementsByClassName("timeStuff")[0].style.color = "darkgrey";
      document.getElementsByClassName("timeStuff")[1].style.color = "darkgrey";
      for(i of document.getElementsByClassName("fadable")){
        i.style.opacity = 0;
        i.parentNode.removeChild(i);
      }
      drawHexagons();
      document.getElementById("BackButton").style.width = "20vh";
      document.getElementById("ReplayButton").style.width = "20vh";
      updateScoreboard();
      if(turnTimerBoxChecked){
        document.getElementById("timerContainer").style.display = "block";
        document.getElementById("time").style.display = "block";
      }
      if(chessTimerBoxChecked){
        setChessTimes();
      }
      started = true;
      bgColors = [255, 255, 255];
      bgColorFadeTo(255, 0, 0);
      clearInterval(startingSequence);
      //ctx.clearRect(0, 0, s, s);
    }
  }, 1000/60);
}

//Creates the hexagons- they're squares rn- not anymore!!!!!
function makeHexagons(){
  var hexX = 0;
  var hexY = 0;
  for(var i = 0; i < 91; i++){
    hexagons[i][1][0] = hexX;
    hexagons[i][1][1] = hexY;
    hexY += 1;
    if(hexX == 9 && hexY == 7){
      hexX += 1;
      hexY = 5;
    }
    if(hexX == 8 && hexY == 8){
      hexX += 1;
      hexY = 4;
    }
    if(hexX == 7 && hexY == 9){
      hexX += 1;
      hexY = 3;
    }
    if(hexX == 6 && hexY == 10){
      hexX += 1;
      hexY = 2;
    }
    if(hexX == 5 && hexY == 11){
      hexX += 1;
      hexY = 1;
    }
    if(hexY == 11){
      hexY = 0;
      hexX += 1;
    }
  }
  for(var i = 0; i < 91; i++){
    hexagons[i][0][1] = hexagons[i][1][1] - 5;
    hexagons[i][0][0] = (hexagons[i][0][1]) / importantNumber;
    hexagons[i][0][0] = Math.abs(hexagons[i][0][0]);
    hexagons[i][0][0] += hexagons[i][1][0];
    hexagons[i][0][1] += 5;
    hexagons[i][0][0] *= s/13;
    hexagons[i][0][1] *= s/14;
    hexagons[i][0][0] += s/13 * 1.5;
    hexagons[i][0][1] += s/13 * 1.5;
  }
  for(var i = 0; i < 91; i++){
    if(hexagons[i][1][1] == 5) for(var j = 0; j < 91; j++){
      if((hexagons[i][1][0] == hexagons[j][1][0] + 1) && (hexagons[i][1][1] == hexagons[j][1][1])){
        hexagons[i][3][0] = j;
      }
      if((hexagons[i][1][0] == hexagons[j][1][0] + 1) && (hexagons[i][1][1] == hexagons[j][1][1] - 1)){
        hexagons[i][3][1] = j;
      }
      if((hexagons[i][1][0] == hexagons[j][1][0]) && (hexagons[i][1][1] == hexagons[j][1][1] - 1)){
        hexagons[i][3][2] = j;
      }
      if((hexagons[i][1][0] == hexagons[j][1][0] - 1) && (hexagons[i][1][1] == hexagons[j][1][1])){
        hexagons[i][3][3] = j;
      }
      if((hexagons[i][1][0] == hexagons[j][1][0] + 1) && (hexagons[i][1][1] == hexagons[j][1][1] + 1)){
        hexagons[i][3][4] = j;
      }
      if((hexagons[i][1][0] == hexagons[j][1][0]) && (hexagons[i][1][1] == hexagons[j][1][1] + 1)){
        hexagons[i][3][5] = j;
      }
    }
    if(hexagons[i][1][1] < 5) for(var j = 0; j < 91; j++){
      if((hexagons[i][1][0] == hexagons[j][1][0] + 1) && (hexagons[i][1][1] == hexagons[j][1][1])){
        hexagons[i][3][0] = j;
      }
      if((hexagons[i][1][0] == hexagons[j][1][0] - 1) && (hexagons[i][1][1] == hexagons[j][1][1] - 1)){
        hexagons[i][3][1] = j;
      }
      if((hexagons[i][1][0] == hexagons[j][1][0]) && (hexagons[i][1][1] == hexagons[j][1][1] - 1)){
        hexagons[i][3][2] = j;
      }
      if((hexagons[i][1][0] == hexagons[j][1][0] - 1) && (hexagons[i][1][1] == hexagons[j][1][1])){
        hexagons[i][3][3] = j;
      }
      if((hexagons[i][1][0] == hexagons[j][1][0] + 1) && (hexagons[i][1][1] == hexagons[j][1][1] + 1)){
        hexagons[i][3][4] = j;
      }
      if((hexagons[i][1][0] == hexagons[j][1][0]) && (hexagons[i][1][1] == hexagons[j][1][1] + 1)){
        hexagons[i][3][5] = j;
      }
    }
    if(hexagons[i][1][1] > 5) for(var j = 0; j < 91; j++){
      if((hexagons[i][1][0] == hexagons[j][1][0] + 1) && (hexagons[i][1][1] == hexagons[j][1][1])){
        hexagons[i][3][0] = j;
      }
      if((hexagons[i][1][0] == hexagons[j][1][0] - 1) && (hexagons[i][1][1] == hexagons[j][1][1] + 1)){
        hexagons[i][3][1] = j;
      }
      if((hexagons[i][1][0] == hexagons[j][1][0]) && (hexagons[i][1][1] == hexagons[j][1][1] - 1)){
        hexagons[i][3][2] = j;
      }
      if((hexagons[i][1][0] == hexagons[j][1][0] - 1) && (hexagons[i][1][1] == hexagons[j][1][1])){
        hexagons[i][3][3] = j;
      }
      if((hexagons[i][1][0] == hexagons[j][1][0] + 1) && (hexagons[i][1][1] == hexagons[j][1][1] - 1)){
        hexagons[i][3][4] = j;
      }
      if((hexagons[i][1][0] == hexagons[j][1][0]) && (hexagons[i][1][1] == hexagons[j][1][1] + 1)){
        hexagons[i][3][5] = j;
      }
    }
  }
}

function drawHexagons(){
  var shrinkSize = 0;
  var speed = 0.1;
  if(localStorage.mobile == "true" || animationsDisabled){

    ctx.clearRect(0, 0, s, s);
    for(var i = 0; i < 91; i++){
      ctx.drawImage(hexImgs[hexagons[i][2]], hexagons[i][0][0]-(hexSize*s/13/2), hexagons[i][0][1]-(hexSize*s/13/2), hexSize*s/13, hexSize*s/13);
    }
  } else {
    var shrinkLoop = setInterval(function(){
      ctx.fillStyle = "white";
      ctx.clearRect(0, 0, s, s);
      ctx.drawImage(undoButton, s * (7/8), s * (6/8), hexSize * s / 30, hexSize * s / 30);
      for(var i = 0; i < 91; i++){
        //ctx.rotate(30*Math.PI/180);
        ctx.drawImage(hexImgs[hexagons[i][2]], hexagons[i][0][0]-(shrinkSize*hexSize*s/13/2), hexagons[i][0][1]-(hexSize*s/13/2), shrinkSize*hexSize*s/13, hexSize*s/13);
        //ctx.rotate(-30*Math.PI/180);
      }
      shrinkSize += speed;
      if(shrinkSize > 1.05){
        clearInterval(shrinkLoop);
      }
    }, 1000/30);
  }
}

function flip(hex, nState){
  hexagons[hex][2] = nState;
  if(flipping){
    setTimeout(function(){flip(hex, nState)}, 500);
  } else {
    if(localStorage.mobile == "false" || animationsDisabled) flipping = true;
    var shrinkSize = 0;
    var speed = -0.1;
    if(localStorage.mobile == "true" || animationsDisabled){
      drawHexagons();
      flipping = false;
      hexagons[hex][4] = nState;
    } else {
      var shrinkLoop = setInterval(function(){
        ctx.fillStyle = "white";
        ctx.clearRect(0, 0, s, s);
        ctx.drawImage(undoButton, s * (7/8), s * (6/8), hexSize * s / 30, hexSize * s / 30);
        for(var i = 0; i < 91; i++){
          if(i != hex) ctx.drawImage(hexImgs[hexagons[i][4]], hexagons[i][0][0]-(hexSize*s/13/2), hexagons[i][0][1]-(hexSize*s/13/2), hexSize*s/13, hexSize*s/13);
        }
        ctx.drawImage(hexImgs[hexagons[hex][4]], hexagons[hex][0][0]-(2*(0.5-shrinkSize)*hexSize*s/13/2), hexagons[hex][0][1]-(hexSize*s/13/2), hexSize*s/13 - shrinkSize * hexSize*s/13 * 2, hexSize*s/13);
        if(shrinkSize >= 0.5){
          hexagons[hex][4] = nState;
        }

        console.log(shrinkSize);

        shrinkSize = nonLinearTransform(shrinkSize);

        if(shrinkSize >= 0.99){
          shrinkSize = 1;
          ctx.clearRect(0, 0, s, s);
          ctx.drawImage(undoButton, s * (7/8), s * (6/8), hexSize * s / 30, hexSize * s / 30);
          for(var i = 0; i < 91; i++){
            ctx.drawImage(hexImgs[hexagons[i][4]], hexagons[i][0][0]-(hexSize*s/13/2), hexagons[i][0][1]-(hexSize*s/13/2), hexSize*s/13, hexSize*s/13);
          }
          flipping = false;
          clearInterval(shrinkLoop);
        }
      }, 1000/60);
    }
  }
}

function bgColorFadeTo(r, g, b){
  clearInterval(colorLoop);
  var dif = 0;
  if(Math.abs(r - bgColors[0]) > dif){
    dif = Math.abs(r - bgColors[0]);
  }
  if(Math.abs(g - bgColors[1]) > dif){
    dif = Math.abs(g - bgColors[1]);
  }
  if(Math.abs(b - bgColors[2]) > dif){
    dif = Math.abs(b - bgColors[2]);
  }
  var speed = dif / 10;

  colorLoop = setInterval(function(){
    if(bgColors[0] > r){
      bgColors[0] -= speed;
    }
    if(bgColors[0] < r){
      bgColors[0] += speed;
    }
    if(bgColors[1] > g){
      bgColors[1] -= speed;
    }
    if(bgColors[1] < g){
      bgColors[1] += speed;
    }
    if(bgColors[2] > b){
      bgColors[2] -= speed;
    }
    if(bgColors[2] < b){
      bgColors[2] += speed;
    }

    if(bgColors[0] >= r - speed && bgColors[0] <= r + speed ){
      bgColors[0] = r;
    }
    if(bgColors[1] >= g - speed && bgColors[1] <= g + speed ){
      bgColors[1] = g;
    }
    if(bgColors[2] >= b - speed && bgColors[2] <= b + speed ){
      bgColors[2] = b;
    }

    document.body.style.backgroundColor = "rgba(" + bgColors[0] + ", " + bgColors[1] + ", " + bgColors[2] + ", 0.3)";
    if(bgColors[0] == r && bgColors[1] == g && bgColors[2] == b){
      clearInterval(colorLoop);
    }
  }, 1000/60);
}

function undo(){
  if(turnNumber > 0){
    turnNumber--;
    turn--;
    if(turn < 0) turn = players - 1;
    switch(turn){
      case 0:
        bgColorFadeTo(255, 0, 0);
        break;
      case 1:
        bgColorFadeTo(0, 150, 255);
        break;
      case 2:
        bgColorFadeTo(255, 255, 0);
        break;
      case 3:
        bgColorFadeTo(0, 255, 0);
        break;
      case 4:
        bgColorFadeTo(255, 0, 255);
        break;
      case 5:
        bgColorFadeTo(0, 255, 255);
        break;
    }
    for(var i = 0; i < 91; i++){
      hexagons[i][2] = oldMoves[turnNumber][i];
    }
    if(turnNumber == 0) makeHexagons();
    flipAllHexagons();
    startTimerThingy();
  }
}

function flipAllHexagons(){
  var shrinkSize = 1;
  var speed = -0.1;
  if(localStorage.mobile == "true"){
    drawHexagons();
  } else {
    var shrinkLoop = setInterval(function(){
      ctx.fillStyle = "white";
      ctx.clearRect(0, 0, s, s);
      ctx.drawImage(undoButton, s * (7/8), s * (6/8), hexSize * s / 30, hexSize * s / 30);
      for(var i = 0; i < 91; i++){
        //ctx.rotate(30*Math.PI/180);
        ctx.drawImage(hexImgs[hexagons[i][4]], hexagons[i][0][0]-(shrinkSize*hexSize*s/13/2), hexagons[i][0][1]-(hexSize*s/13/2), shrinkSize*hexSize*s/13, hexSize*s/13);
        //ctx.rotate(-30*Math.PI/180);
      }
      shrinkSize += speed;
      if(shrinkSize < 0){
        speed = 0.1;
        for(var i = 0; i < 91; i++){
          hexagons[i][4] = oldMoves[turnNumber][i];
        }
      }
      if(shrinkSize > 1){
        clearInterval(shrinkLoop);
      }
    }, 1000/60);
  }
}

function getScore(){
  var score = [0, 0, 0, 0, 0, 0, 0];
  for(var i = 0; i < hexagons.length; i++){
    switch(hexagons[i][2]){
      case 1:
        score[0]++;
        break;
      case 2:
        score[1]++;
        break;
      case 4:
        score[2]++;
        break;
      case 5:
        score[3]++;
        break;
      case 6:
        score[4]++;
        break;
      case 7:
        score[5]++;
        break;
      case 0:
        score[6]++;
        break;
    }
  }
  return score;
}

function replay(){
  /*var replayer = setInterval(function(){
    undo();
    if(turnNumber == 0){
      clearInterval(replayer);
    }
  }, 500);*/
  for(var i = 0; i < 91; i++){
    hexagons[i] = [[0, 0], [0, 0], 0, [-1, -1, -1, -1, -1, -1], 0];
  }
  makeHexagons();
  //Input
  hexagons[60][2] = 3;
  hexagons[57][2] = 3;
  hexagons[24][2] = 3;
  hexagons[27][2] = 3;
  hexagons[30][2] = 3;
  hexagons[63][2] = 3;
  hexagons[84][2] = 3;
  hexagons[60][4] = 3;
  hexagons[57][4] = 3;
  hexagons[24][4] = 3;
  hexagons[27][4] = 3;
  hexagons[30][4] = 3;
  hexagons[63][4] = 3;
  hexagons[84][4] = 3;

  turn = 0;

  turnNumber = 0;

  oldMoves = [];

  setChessTimes();

  startTimerThingy();
  winner = "yee";

  bgColorFadeTo(255, 0, 0);

  flipAllHexagons();
  updateScoreboard();

  document.getElementById("winScreen").style.display = "none";
}

function updateScoreboard(){
  document.getElementById("scoreboard").hidden = false;
  var scoreboard = document.getElementsByClassName("score");
  document.getElementById("score6").hidden = false;
  //console.log(scoreboard);
  for(var i = 0; i < 7; i++){
    scoreboard[i].innerHTML = getScore()[i];
    if(i >= players && i != 6){
      document.getElementById("score" + i).hidden = true;
    } else document.getElementById("score" + i).hidden = false;
  }
}

function openOptions(){
  if(document.getElementById('optionsScreen').style.display == 'block'){
    document.getElementById('optionsScreen').style.display = 'none';
    optionsOpen = false;
  } else {
    document.getElementById('optionsScreen').style.display = 'block';
    optionsOpen = true;
  }
}

function turnTimerBox(){
  //console.log("yeeee");
  document.getElementById("chessTimerCheckBox").checked = false;
  turnTimerBoxChecked = !turnTimerBoxChecked;
  if(turnTimerBoxChecked){
    document.getElementById("turnTimerBox").style.display = "block";
    document.getElementById("turnTimerBox").display = "block";
  } else {
    document.getElementById("turnTimerBox").style.display = "none";
    document.getElementById("turnTimerBox").display = "none";
  }
  chessTimerBoxChecked = false;

  document.getElementById("chessTimerBox").style.display = "none";
  document.getElementById("chessTimerBox").display = "none";
}

function getTurnMaxTime(){
  if(document.getElementById("actualTurnTimerBox").value > 60){
    document.getElementById("actualTurnTimerBox").value = 60
  }
  if(turnTimerBoxChecked) return 1 * document.getElementById("actualTurnTimerBox").value;
  return false;
}

function setChessTimes(){
  for(var i = 0; i < chessTimes.length; i++){
    chessTimes[i] = Math.floor(document.getElementById("actualChessTimerBox").value * 60 + 0.5);
  }
}

function chessTimerBox(){
  document.getElementById("turnTimerCheckBox").checked = false;
  //console.log("yeeee");
  chessTimerBoxChecked = !chessTimerBoxChecked;
  if(chessTimerBoxChecked){
    document.getElementById("chessTimerBox").style.display = "block";
    document.getElementById("chessTimerBox").display = "block";
  } else {
    document.getElementById("chessTimerBox").style.display = "none";
    document.getElementById("chessTimerBox").display = "none";
  }

  turnTimerBoxChecked = false;

  document.getElementById("turnTimerBox").style.display = "none";
  document.getElementById("turnTimerBox").display = "none";
}

function startTimerThingy(){
  realTime = 0;
  time = 0;
  if(document.getElementById("time").innerHTML = getTurnMaxTime() - time < 10){
    document.getElementById("time").innerHTML = getTurnMaxTime() - time + "&nbsp;&nbsp;";
  } else document.getElementById("time").innerHTML = getTurnMaxTime() - time;
  clearInterval(makeTimerHappen);
  makeTimerHappen = setInterval(function(){
    realTime += 0.1;
    time = Math.floor(realTime);
    if(getTurnMaxTime() - time <= 5){
      if(realTime % 1 >= 0.5){
        setTimerColor("rgba(0, 0, 0, 0)");
      } else {
        setTimerColor("red");
      }
    } else {
      setTimerColor("black");
    }
    //console.log(time);
    if(turnTimerBoxChecked) {
      if(document.getElementById("time").innerHTML = getTurnMaxTime() - time < 10){
        document.getElementById("time").innerHTML = getTurnMaxTime() - time + "&nbsp;&nbsp;";
      } else document.getElementById("time").innerHTML = getTurnMaxTime() - time;
    }
    if(time >= getTurnMaxTime() && getTurnMaxTime() != 0){
      setTimerColor("black");
      time = 0;
      realTime = 0;
      if(document.getElementById("time").innerHTML = getTurnMaxTime() - time < 10){
        document.getElementById("time").innerHTML = getTurnMaxTime() - time + "&nbsp;&nbsp;";
      } else document.getElementById("time").innerHTML = getTurnMaxTime() - time;
      turn++;
      if(turn >= players) turn = 0;
      switch(turn){
        case 0:
          bgColorFadeTo(255, 0, 0);
          break;
        case 1:
          bgColorFadeTo(0, 150, 255);
          break;
        case 2:
          bgColorFadeTo(255, 255, 0);
          break;
        case 3:
          bgColorFadeTo(0, 255, 0);
          break;
        case 4:
          bgColorFadeTo(255, 0, 255);
          break;
        case 5:
          bgColorFadeTo(0, 255, 255);
          break;
      }
    } else if(chessTimerBoxChecked){
      if(chessTimes[turn] > 0){
        chessTimes[turn] -= 0.1;
      }
      if(chessTimes[turn] <= 10){
        if(chessTimes[turn] % 1 <= 0.5){
          document.getElementsByClassName("chessTime")[turn].style.color = "red";
          document.getElementsByClassName("chessTime")[turn].style.color = "rgba(0, 0, 0, 0)";
        } else {
          document.getElementsByClassName("chessTime")[turn].style.color = "rgba(0, 0, 0, 0)";
          document.getElementsByClassName("chessTime")[turn].style.color = "red";
        }
      }
      if(chessTimes[turn] <= 0){
        document.getElementsByClassName("chessTime")[turn].style.color = "black";
        chessTimes[turn] = "0:00";
        if(getPlayersLeft() == 1){
          for(var i = 0; i < players; i++){
            if(chessTimes[i] > 0){
              winner = i;
            }
          }
          switch(winner){
            case 0:
              winner = "Red";
              break;
            case 1:
              winner = "Blue";
              break;
            case 2:
              winner = "Yellow"
              break;
            case 3:
              winner = "Green";
              break;
            case 4:
              winner = "Purple";
              break;
            case 5:
              winner = "Cyan";
              break;
          }
          //console.log(winner + " Wins!");
          document.getElementById("winScreen").style.display = "flex";
          document.getElementById("winScreen").innerHTML = "<span id='winText'>" + winner + " Wins!</span>";
          return "Yeet";
        }
        while(!(chessTimes[turn + 1] > 0)){
          //console.log("hi");
          turn++;
          if(turn >= players){
            turn = 0;
          }
        }
        switchTurn();
      }
      for(var i = 0; i < players; i++){
        document.getElementsByClassName("chessTime")[i].innerHTML = secondsToMinuteText(Math.ceil(chessTimes[i]));
      }
    }
  }, 100);
}
function secondsToMinuteText(n){
  if(!(n > 0)){
    return "0:00";
  }
  var s = "";
  s += Math.floor(n / 60);
  s += ":";
  if(n % 60 < 10){
    s += "0";
  }
  s += (n % 60);
  return s;
}

function switchTurn(){
  turn++;
  if(turn >= players) turn = 0;
  switch(turn){
    case 0:
      bgColorFadeTo(255, 0, 0);
      break;
    case 1:
      bgColorFadeTo(0, 150, 255);
      break;
    case 2:
      bgColorFadeTo(255, 255, 0);
      break;
    case 3:
      bgColorFadeTo(0, 255, 0);
      break;
    case 4:
      bgColorFadeTo(255, 0, 255);
      break;
    case 5:
      bgColorFadeTo(0, 255, 255);
      break;
  }
}

function getPlayersLeft(){
  var numLeft = players;
  for(var i = 0; i < players; i++){
    if(!(chessTimes[i] > 0)){
      numLeft--;
    }
  }
  return numLeft;
}

function makeItEnglish(winners){
  var winner = "";
  for(var i = 0; i < winners.length; i++){
    winner += winners[i];
    if(winners.length > 2 && i < winners.length - 1) winner += ", ";
    if(i == winners.length - 2){
      winner += ((winners.length <= 2)?" ":"") + "and ";
    }
  }

  return winner;
}

function makeThePage(){
  document.body.innerHTML = `
    <html>
    <head>
      <title>Hexa</title>
      <link rel="icon" type = "png" href="greyhex.png" />
      <meta name = "apple-mobile-web-app-capable" content = "yes">
      <link rel = "apple-touch-icon" href = "hexalogo.jpg">
      <meta name = "viewport" content = "user-scalable=no">
      <style>
      @font-face {
        font-family: Yee;
        src: url(Assets/Futura-Weird.otf);
      }

      @font-face {
        font-family: Yeee;
        src: url(Assets/Futura-Weird.otf);
      }
      @keyframes rotate{
        from{
          transform: rotate(0deg);
        }
        to{
          transform: rotate(30deg);
        }
      }
      @keyframes unrotate{
        from{
          transform: rotate(30deg);
        }
        to{
          transform: rotate(0deg);
        }
      }
      @keyframes bigify{
        from{
          transform: scale(1, 1);
        }
        to{
          transform: scale(1.05, 1.05);
        }
      }
      @keyframes unbigify{
        from{
          transform: scale(1.05, 1.05);
        }
        to{
          transform: scale(1, 1);
        }
      }
      @keyframes bigify2{
        from{
          transform: scale(1, 1);
        }
        to{
          transform: scale(1.1, 1.1);
        }
      }
      @keyframes unbigify2{
        from{
          transform: scale(1.1, 1.1);
        }
        to{
          transform: scale(1, 1);
        }
      }
      @keyframes rotateHourglass{
        22.22222222%{
          transform: scaleY(1);
        }
        27.777777777%{
          transform: scaleY(0);
        }
        33.3333333333%{
          transform: scaleY(1);
        }
        72.2222222222%{
          transform: scaleY(1);
        }
        77.7777777777%{
          transform: scaleY(0);
        }
        83.3333333333%{
          transform: scaleY(1);
        }
        99.99999999999999%{
          transform: scaleY(1);
        }
        100%{
          transform: scaleY(1);
        }
      }
      @keyframes flipYDimensionThingy{
        0%{
          transform: scaleY(1);
        }
        28.232323232323%{
          transform: scaleY(-1);
        }
        78.23%{
          transform: scaleY(-1);
        }
        100%{
          transform: scaleY(1);
        }
      }
        body{
          margin: 0;
          padding: 0;
          zoom: 0.25;
          -webkit-touch-callout: none; /* iOS Safari */
          -webkit-user-select: none; /* Safari */
          -khtml-user-select: none; /* Konqueror HTML */
          -moz-user-select: none; /* Firefox */
          -ms-user-select: none; /* Internet Explorer/Edge */
          user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */
        }
        #mainCanvas{
          padding-left: 0;
          padding-right: 0;
          margin-left: auto;
          margin-right: auto;
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }
      #BackButton{
        position: absolute;
        left: 3.3vw;
        top: 5vh;
        height: 20vh;
        width: 0vh;
      }
      #ReplayButton{
        position: absolute;
        left: 18.3vw;
        top: 5vh;
        height: 20vh;
        width: 0vh;
      }
      #scoreboard{
        position: absolute;
        font-size: 3vw;
        top: 40vh;
        left: 10vh;
        border: solid 0vh;
        background-color: rgba(255, 255, 255, 0.75);
        border-radius: 3vh;
        border-color: rgba(255, 255, 255, 0.75);
        font-family: Yee;
        height: 126vh;
        width: 43vw;
        line-height: 12.5vh;
        box-shadow: 2vh 2vh 2vh rgba(0, 0, 0, 0.5);
      }
      .colorName{
        padding-left: 4.5vw;
        opacity: 1;
      }
      #playButton{
        position: absolute;
        top: 130vh;
        left: 65vw;
      }
      #actualPlayButton{
        width: 40vh;
        height: 40vh;
      }
      #actualPlayButton:hover{
        animation-name: bigify;
        animation-duration: 0.5s;
        animation-timing-function: ease;
        transform: scale(1.05, 1.05);
      }
      #actualPlayButton:not(:hover){
        animation-name: unbigify;
        animation-duration: 0.5s;
        animation-timing-function: ease;
      }
      #optionsButton{
        position: fixed;
        top: 40px;
        right: 0px;
        width: 7.5%;
        height: 7.5%;
      }
      #optionsButton:hover{
        transform: rotate(30deg);
        animation-name: rotate;
        animation-duration: 0.5s;
        animation-timing-function: ease;
      }
      #optionsButton:not(:hover){
        animation-name: unrotate;
        animation-duration: 0.5s;
        animation-timing-function: ease;
      }
      #instructionsButton{
        position: fixed;
        top: 40px;
        right: 5%;
        width: 7.5%;
        height: 7.5%;
      }
      #instructionsButton:hover{
        transform: scale(1.05);
        animation-name: bigify;
        animation-duration: 0.5s;
        animation-timing-function: ease;
      }
      #instructionsButton:not(:hover){
        animation-name: unbigify;
        animation-duration: 0.5s;
        animation-timing-function: ease;
      }
      #emailButton{
        position: fixed;
        top: calc(40px + 1.25%);
        right: 11%;
        width: 5%;
        height: 5%;
      }
      #emailButton:hover{
        transform: scale(1.05);
        animation-name: bigify;
        animation-duration: 0.5s;
        animation-timing-function: ease;
      }
      #emailButton:not(:hover){
        animation-name: unbigify;
        animation-duration: 0.5s;
        animation-timing-function: ease;
      }
      #optionsScreen{
        display: none;
        margin: auto;
        position: fixed;
        width: 75%;
        height: 84%;
        font: 4vh Yeee;
        border-radius: 100px;
        z-index: 99999;
        background-color: #eeeeee;
        text-align: center;
        box-shadow: 2vw 2vh 5vh rgba(0, 0, 0, 0.5);
        left: 50%;
        top: 7.5%;
        margin-left: -37.5%;
        text-align: left;
      }
      #instructionsScreen{
        display: none;
        margin: auto;
        position: fixed;
        width: 75%;
        height: 84%;
        font: 4vh Yeee;
        border-radius: 100px;
        z-index: 99999;
        background-color: #eeeeee;
        text-align: center;
        box-shadow: 2vw 2vh 5vh rgba(0, 0, 0, 0.5);
        left: 50%;
        top: 7.5%;
        margin-left: -37.5%;
        text-align: left;
      }
      iframe{
        position: absolute;
        width: 100%;
        height: 100%;
        border: none;
        bottom: 10vh;
      }
      #optionsScreen h1{
        text-align: center;
        margin: auto;
        margin-top: 2.25%;
      }
      #optionsScreenContent{
        margin-top: 5%;
        margin-left: 7.5%;
      }
      #winScreen{
        display: none;
        margin: auto;
        position: fixed;
        width: 22.5%;
        border-radius: 20px;
        z-index: 9999;
        background-color: #f0f0f0;
        text-align: center;
        box-shadow: 2vw 2vh 5vh rgba(0, 0, 0, 0.5);
        left: 76.25%;
        top: 42.5%;
        margin-left: -37.5%;
        font-size: 10vh;
        opacity: 1;
        font-family: Yee;
        text-align: center;
        padding-top: 2vh;
        padding-bottom: 2vh;
      }
      #winText{
        margin: auto;
        text-align: center;
        vertical-align: middle;
      }
      input{
        height: 4vh;
        width: 4vh;
        margin-top: 1.75vh;
      }
      #turnTimerBox{
        display: none;
      }
      #actualTurnTimerBox{
        font-size: 5vh;
        width: 20%;
        height: 5%;
        margin-top: 0;
        font-family: Yee;
        text-align: center;
        border-radius: 0px;
      }
      #chessTimerBox{
        display: none;
      }
      #actualChessTimerBox{
        font-size: 5vh;
        width: 20%;
        height: 5%;
        margin-top: 0;
        font-family: Yee;
        text-align: center;
        border-radius: 0px;
      }
      .flexBox{
        display: flex;
      }
      #timerContainer{
        position: fixed;
        right: 15%;
        top: 40%;
        display: none;
        font-family: Yee;
        font-size: 13vh;
      }
      #timer{
        transform: scaleY(1);
        animation-name: rotateHourglass;
        animation-duration: 4s;
        animation-iteration-count: infinite;
        animation-timing-function: ease-in-out;
      }
      #timerAgain{
        animation-name: flipYDimensionThingy;
        animation-duration: 4s;
        animation-iteration-count: infinite;
        animation-timing-function: ease-in-out;
      }
      #timerImage{
        height: 20vh;
        width: 20vh;
      }
      #time{
        text-align: left;
        position: fixed;
        right: 10%;
        top: 40.85%;
        display: none;
        font-family: Yee;
        font-size: 13vh;
      }
      .chessTime{
        margin-left: auto;
        padding-right: 4.5vw;
      }
      .x{
        width: 6vh;
        height: 6vh;
        position: absolute;
        right: 10vh;
        top: 10vh;
      }
      .x:hover{
        animation-name: bigify2;
        animation-duration: 0.3s;
        animation-timing-function: ease;
        transform: scale(1.1, 1.1);
      }
      .x:not(:hover){
        animation-name: unbigify2;
        animation-duration: 0.3s;
        animation-timing-function: ease;
      }
      #cover{
        position: absolute;
        opacity: 0;
        background-color: white;
        width: 100%;
        height: 100%;
        pointer-events: none;
        left: 0px;
        top: 0px;
      }
      #multiplayerBox{
        display: none;
      }
      #actualMultiplayerBox{
        font-size: 5vh;
        width: 220%;
        height: 5%;
        margin-top: 0;
        font-family: Yee;
        text-align: center;
        border-radius: 0px;
      }
      #numbers{
        position: absolute;
        top: 130vh;
        left: 115vw;
      }
      #realNumbers{
        height: 40vh;
        width: 40vh;
      }
      #upArrow{
        position: absolute;
        top: 130vh;
        left: 124.25vw;
      }
      #realUpArrow{
        height: 7.5vh;
        width: 7.5vh;
      }
      #downArrow{
        position: absolute;
        top: 164vh;
        left: 124.25vw;
      }
      #downArrow:hover{
        transform: scale(1.05);
        animation-name: bigify;
        animation-duration: 0.25s;
        animation-timing-function: ease;
      }
      #downArrow:not(:hover){
        animation-name: unbigify;
        animation-duration: 0.25s;
        animation-timing-function: ease;
      }
      #upArrow:hover{
        transform: scale(1.05);
        animation-name: bigify;
        animation-duration: 0.25s;
        animation-timing-function: ease;
      }
      #upArrow:not(:hover){
        animation-name: unbigify;
        animation-duration: 0.25s;
        animation-timing-function: ease;
      }
      #realDownArrow{
        height: 7.5vh;
        width: 7.5vh;
      }
      #numPlayersText{
        position: absolute;
        top: 146vh;
        left: 97vw;
        font: 7.5vh Yee;
      }
      </style>
    </head>
    <body id="body">
      <a href = "javascript:unstart();"><img title="Back" src="Assets/BackButton.svg" id="BackButton" /></a>
      <a href = "javascript:replay();"><img title="Replay" src="Assets/ReplayButton.svg" id="ReplayButton"></a>
      <canvas id="mainCanvas"></canvas>
      <div class = "fadable" id="playButton"><a id="playLink" href="javascript:start();"><img src="Assets/PlayButtonBetter.svg" alt="Play" id="actualPlayButton"></img></a></div>
      <div class = "fadable" id="numbers"><img id="realNumbers" src="Assets/2.svg"></div>
      <div class = "fadable" id="upArrow"><a href="javascript:(()=>{if(++players > 6){players = 2}document.getElementById('realNumbers').src = 'Assets/' + players+'.svg';})();"><img id="realUpArrow" src="Assets/UpArrow.svg"></a></div>
      <div class = "fadable" id="downArrow"><a href="javascript:(()=>{if(--players < 2){players = 6}document.getElementById('realNumbers').src = 'Assets/' + players+'.svg';})();"><img id="realDownArrow" src="Assets/DownArrow.svg"></a></div>
      <div class = "fadable" id="numPlayersText"># of players:</div>
      <div id="scoreboard" hidden="true">
        <h1 style="text-align:center;margin-top:6vh;margin-bottom:0vh;">Scores</h1>
        <div class="flexBox"><div id="score0" class="colorName">Red: <span class="score">0</span></div><div class="chessTime"></div></div>
        <div class="flexBox"><div id="score1" class="colorName">Blue: <span class="score">0</span></div><div class="chessTime"></div></div>
        <div class="flexBox"><div id="score2" class="colorName">Yellow: <span class="score">0</span></div><div class="chessTime"></div></div>
        <div class="flexBox"><div id="score3" class="colorName">Green: <span class="score">0</span></div><div class="chessTime"></div></div>
        <div class="flexBox"><div id="score4" class="colorName">Purple: <span class="score">0</span></div><div class="chessTime"></div></div>
        <div class="flexBox"><div id="score5" class="colorName">Cyan: <span class="score">0</span></div><div class="chessTime"></div></div>
        <div class="flexBox"><div id="score6" class="colorName">Unfilled: <span class="score">0</span></div><div class="chessTime"></div></div>
      </div>
      <a href="javascript:openOptions();"><img id="optionsButton" src="Assets/OptionsButton.svg"></img></a>
      <a href="javascript:openInstructions();"><img id="instructionsButton" src="Assets/QuestionMark.svg"></img></a>
      <a href="mailto:hexa@cleverlynamedwebsite.pw"><img id="emailButton" src="Assets/email.svg"></img></a>
      <div id="optionsScreen">
        <h1>Options</h1>
        <div id="optionsScreenContent">
          <h2>
            <div class="flexBox timeStuff"><input type="checkbox" onclick="javascript:turnTimerBox()" id="turnTimerCheckBox"></input> &nbsp; Turn timer &nbsp;<div id="turnTimerBox"><input id="actualTurnTimerBox" type="text" value="15">&nbsp;s</input></div></div>
          </h2>
          <h2>
            <div class="flexBox timeStuff"><input type="checkbox" onclick="javascript:chessTimerBox()" id="chessTimerCheckBox"></input> &nbsp; Chess timer &nbsp;<div id="chessTimerBox"><input id="actualChessTimerBox" type="text" value="3">&nbsp;m</input></div></div>
          </h2>
          <h2>
            <div class="flexBox"><input type="checkbox" onclick="javascript:animationsDisabled = !animationsDisabled; setTimeout(()=>{if(started) drawHexagons();}, 100);" id=""></input> &nbsp; Disable Animations &nbsp;</div>
          </h2>
          <h2>
            <div class="flexBox"><input type="checkbox" onclick="javascript:multiplayerBox();" id=""></input> &nbsp; Multiplayer &nbsp;<div id="multiplayerBox"><input id="actualMultiplayerBox" type="text" value="15">&nbsp;</input></div></div>
          </h2>
          <a  href="javascript:openOptions();"><img class = "x" src="Assets/x.svg"></img></a>
        </div>
      </div>
      <div id="instructionsScreen">
        <iframe src="instructions.html" id="iframe"></iframe>
        <a  href="javascript:openInstructions();"><img class = "x" src="Assets/x.svg"></img></a>
      </div>
      <div id="winScreen">

      </div>
      <script src = "hexaGameScript.js">
      </script>
      <div id="timerContainer"><div id = "timer"><div id="timerAgainYee"><img id="timerImage" src="Assets/Hourglass2.svg"></img></div></div></div>
      <div id="time"></div>
      <div id="cover"></div>
    </body>
    </html>
    `;
}

function startOverAll(){
  makeThePage();

  document.body.style.backgroundColor = "white";

  clearInterval(makeTimerHappen);

  scale = 2;
  if(localStorage.mobile == undefined) localStorage.mobile = "false";
  c = document.getElementById("mainCanvas");
  c.height = window.innerHeight;
  if(localStorage.mobile == "false") c.height *= scale;
  document.body.style.zoom = 1 / scale;
  if(localStorage.mobile == "true") document.body.style.zoom = 1;
  c.width = c.height;
  s = c.width;
  realTime = 0;
  hexSize = 3;
  makeTimerHappen;
  importantNumber = 1.95;//1.95
  turn = 0;
  players = 2;
  changed = false;
  bgColors = [0, 0, 0];
  started = false;
  flipping = false;
  ctx = c.getContext("2d");
  ctx.lineWidth = 10;
  logo = new Image;
  undoButton = new Image;
  undoButton.src = "Assets/UndoButton.svg";
  replayButton = new Image;
  replayButton.src = "Assets/ReplayButton.svg";
  backButton = new Image
  backButton.src = "Assets/BackButton.svg";
  playButton = new Image;
  playButton.src = "Assets/PlayButton.svg";
  logo.src = "hexalogo.svg";
  numbers = [new Image, new Image, new Image, new Image, new Image, new Image, new Image, new Image, new Image, new Image];
  oldMoves = [];
  turnNumber = 0;
  upArrow = new Image;
  downArrow = new Image;
  upArrow.src = "Assets/UpArrow.svg";
  downArrow.src = "Assets/DownArrow.svg";
  for(var i = 0; i < numbers.length; i++){
    numbers[i].src = "Assets/" + i + ".svg";
  }
  logo.onload = function(){ctx.drawImage(logo, 0, -s * (1/6), s, s);};
  ctx.textAlign = "center";
  ctx.font = s / 25 + "px Yeee";
  ctx.fillText("", 0, 0);
  document.fonts.onloadingdone = function () {
    /*if(!firstTimeLoading)ctx.fillText("# of players:", s * (4.6 / 8), s * (3.0675 / 4));*/
    firstTimeLoading = true;
  }
  //playButton.onload = function(){ctx.drawImage(playButton, s * (1/4) - ((s / 2) / 2), s * (3/4) - ((s / 2) / 2), s / 2, s / 2);};
  //downArrow.onload = function(){ctx.drawImage(downArrow, s * (3 / 4) - (s / 8), s * (3/4) - ((s / 4) / 2) + (s / 12), s / 4, s / 4);};
  //upArrow.onload = function(){ctx.drawImage(upArrow, s * (3 / 4) - (s / 8), s * (3/4) - ((s / 4) / 2) - (s / 12), s / 4, s / 4);};
  //numbers[2].onload = function(){ctx.drawImage(numbers[players], s * (3 / 4) - (s / 10), s * (3/4) - ((s / 5) / 2), s / 5, s / 5);};
  hexagons = [];
  hexImgs = [new Image, new Image, new Image, new Image, new Image, new Image, new Image, new Image];
  hexImgs[0].src = "greyhex.svg";
  hexImgs[1].src = "Assets/RedHex.svg";
  hexImgs[2].src = "Assets/BlueHex.svg";
  hexImgs[3].src = "darkgreyhex.svg";
  hexImgs[4].src = "Assets/YellowHex.svg";
  hexImgs[5].src = "Assets/GreenHex.svg";
  hexImgs[6].src = "Assets/PurpleHex.svg";
  hexImgs[7].src = "Assets/LightBlueHex.svg";
  for(var i = 0; i < 91; i++){
    hexagons[i] = [[0, 0], [0, 0], 0, [-1, -1, -1, -1, -1, -1], 0];
  }
  makeHexagons();

  hexagons[60][2] = 3;
  hexagons[57][2] = 3;
  hexagons[24][2] = 3;
  hexagons[27][2] = 3;
  hexagons[30][2] = 3;
  hexagons[63][2] = 3;
  hexagons[84][2] = 3;
  hexagons[60][4] = 3;
  hexagons[57][4] = 3;
  hexagons[24][4] = 3;
  hexagons[27][4] = 3;
  hexagons[30][4] = 3;
  hexagons[63][4] = 3;
  hexagons[84][4] = 3;

  time = 0;

  optionsOpen = false;

  turnTimerBoxChecked = false;

  chessTimerBoxChecked = false;

  chessTimes = [0, 0, 0, 0, 0, 0];

  onmousedown = function(e){
    if(!optionsOpen){
      var x = (e.clientX * scale);
      x -= ((window.innerWidth - (s / scale)) * (scale / 2));
      var y = e.clientY * scale;
      if(e.which == 1){
        if(started && !flipping) update(x, y);
        if(!started){
          //if(Math.hypot(y - s * (3/4), x -  s * (1/4)) < s / 12) start();
          /*if(Math.hypot(y - (s * (3/4) - (s / 12)), x - (s * (3 / 4))) < s / 50){
            players++;
            if(players > 6) players = 2;
            ctx.clearRect(s * (2 / 4) - (s / 10), s * (3/4) - ((s / 5) / 2), s / 5 + (s / 2), s / 5);
            ctx.drawImage(numbers[players], s * (3 / 4) - (s / 10), s * (3/4) - ((s / 5) / 2), s / 5, s / 5);
            ctx.drawImage(downArrow, s * (3 / 4) - (s / 8), s * (3/4) - ((s / 4) / 2) + (s / 12), s / 4, s / 4);
            ctx.drawImage(upArrow, s * (3 / 4) - (s / 8), s * (3/4) - ((s / 4) / 2) - (s / 12), s / 4, s / 4);
            ctx.fillText("# of players:", s * (4.6 / 8), s * (3.0675 / 4));
          }
          if(Math.hypot(y - (s * (3/4) + (s / 12)), x - (s * (3 / 4))) < s / 50){
            players--;
            if(players < 2) players = 6;
            ctx.clearRect(s * (2 / 4) - (s / 10), s * (3/4) - ((s / 5) / 2), s / 5 + (s / 2), s / 5);
            ctx.drawImage(numbers[players], s * (3 / 4) - (s / 10), s * (3/4) - ((s / 5) / 2), s / 5, s / 5);
            ctx.drawImage(downArrow, s * (3 / 4) - (s / 8), s * (3/4) - ((s / 4) / 2) + (s / 12), s / 4, s / 4);
            ctx.drawImage(upArrow, s * (3 / 4) - (s / 8), s * (3/4) - ((s / 4) / 2) - (s / 12), s / 4, s / 4);
            ctx.fillText("# of players:", s * (4.6 / 8), s * (3.0675 / 4));
          }*/
        }
      }
    }
  }
  onmousemove = function(e){
    var x = (e.clientX * scale);
    x -= ((window.innerWidth - (s / scale)) * (scale / 2));
    var y = e.clientY * scale;
    /*if(Math.hypot(y - (s * (3/4) - (s / 12)), x - (s * (3 / 4))) < s / 50 && !started){
      //console.log("yeet");
      ctx.clearRect(s * (2 / 4) - (s / 10), s * (3/4) - ((s / 5) / 2), s / 5 + (s / 2), s / 5);
      ctx.drawImage(numbers[players], s * (3 / 4) - (s / 10), s * (3/4) - ((s / 5) / 2), s / 5, s / 5);
      ctx.drawImage(downArrow, s * (3 / 4) - (s / 8), s * (3/4) - ((s / 4) / 2) + (s / 12), s / 4, s / 4);
      ctx.drawImage(upArrow, s * (3 / 4) - (s / 8), s * (3/4) - ((s / 4) / 2) - (s / 12), s / 4, s / 4);
      ctx.fillText("# of players:", s * (4.6 / 8), s * (3.0675 / 4));
    }
    if(Math.hypot(y - (s * (3/4) + (s / 12)), x - (s * (3 / 4))) < s / 50 && !started){
      //console.log("Yee");
      ctx.clearRect(s * (2 / 4) - (s / 10), s * (3/4) - ((s / 5) / 2), s / 5 + (s / 2), s / 5);
      ctx.drawImage(numbers[players], s * (3 / 4) - (s / 10), s * (3/4) - ((s / 5) / 2), s / 5, s / 5);
      ctx.drawImage(downArrow, s * (3 / 4) - (s / 8), s * (3/4) - ((s / 4) / 2) + (s / 12), s / 4, s / 4);
      ctx.drawImage(upArrow, s * (3 / 4) - (s / 8), s * (3/4) - ((s / 4) / 2) - (s / 12), s / 4, s / 4);
      ctx.fillText("# of players:", s * (4.6 / 8), s * (3.0675 / 4));
    }*/
  }
  ontouchstart = function(e){
    if(started) update(e.touches[0].clientX - ((window.innerWidth-s) / 2), e.touches[0].clientY);
    if(!started){
      var x = e.touches[0].clientX - ((window.innerWidth-s) / 2);
      var y = e.touches[0].clientY;
      if(Math.hypot(y - s * (3/4), x -  s * (1/4)) < s / 12) start();
      /*if(Math.hypot(y - (s * (3/4) - (s / 12)), x - (s * (3 / 4))) < s / 50){
        players++;
        if(players > 6) players = 2;
        ctx.clearRect(s * (3 / 4) - (s / 10), s * (3/4) - ((s / 5) / 2), s / 5, s / 5);
        ctx.drawImage(numbers[players], s * (3 / 4) - (s / 10), s * (3/4) - ((s / 5) / 2), s / 5, s / 5);
        ctx.drawImage(downArrow, s * (3 / 4) - (s / 8), s * (3/4) - ((s / 4) / 2) + (s / 12), s / 4, s / 4);
        ctx.drawImage(upArrow, s * (3 / 4) - (s / 8), s * (3/4) - ((s / 4) / 2) - (s / 12), s / 4, s / 4);
        ctx.fillText("# of players:", s * (4.6 / 8), s * (3.0675 / 4));
      }
      if(Math.hypot(y - (s * (3/4) + (s / 12)), x - (s * (3 / 4))) < s / 50){
        players--;
        if(players < 2) players = 6;
        ctx.clearRect(s * (3 / 4) - (s / 10), s * (3/4) - ((s / 5) / 2), s / 5, s / 5);
        ctx.drawImage(numbers[players], s * (3 / 4) - (s / 10), s * (3/4) - ((s / 5) / 2), s / 5, s / 5);
        ctx.drawImage(downArrow, s * (3 / 4) - (s / 8), s * (3/4) - ((s / 4) / 2) + (s / 12), s / 4, s / 4);
        ctx.drawImage(upArrow, s * (3 / 4) - (s / 8), s * (3/4) - ((s / 4) / 2) - (s / 12), s / 4, s / 4);
        ctx.fillText("# of players:", s * (4.6 / 8), s * (3.0675 / 4));
      }*/
    }
    localStorage.mobile = "true";
  }
}

function unstart(){
  onmousedown = ()=>{};
  ontouchstart = ()=>{};
  onmousemove = ()=>{};
  var opacity = 0;
  var multiplier = 2;
  var loopyThingy = setInterval(function(){
    if(opacity >= 0) opacity += 0.02 * multiplier;
    if(opacity > 1){
      opacity = 1;
      multiplier = -1;
      startOverAll();
    }
    if(opacity < 0){
      opacity = 0;
    }
    document.getElementById("cover").style.opacity = opacity;

    if(opacity == 0){
      clearInterval(loopyThingy);
    }
  }, 1000/60);
}

function setTimerColor(color){
  document.getElementById("time").style.color = color;
}

function multiplayerBox(){
  multiplayer = !multiplayer;
  link = "http://cleverlynamedwebsite.pw/hexa////#" + (Math.random() + "").replace("0.", "") + "-" + players;

  document.getElementById("actualMultiplayerBox").value = link;

  if(multiplayer){
    document.getElementById("multiplayerBox").style.display = "block";
    document.getElementById("multiplayerBox").display = "block";
    document.getElementById("playLink").href = link;
  } else {
    document.getElementById("multiplayerBox").style.display = "none";
    document.getElementById("multiplayerBox").display = "none";
    document.getElementById("playLink").href = "javascript:start();";
  }

  setTimeout(()=>{if(multiplayer)copyMultiplayerLink();}, 100);
}

function copyMultiplayerLink() {
  /* Get the text field */
  var copyText = document.getElementById("actualMultiplayerBox");

  /* Select the text field */
  copyText.select();
  copyText.setSelectionRange(0, 99999); /*For mobile devices*/

  /* Copy the text inside the text field */
  document.execCommand("copy");

  /* Alert the copied text */
  alert("Link copied to clipboard!");
}

function nonLinearTransform(n){
  with(Math){
      return (-(cos((2/PI * acos(sqrt(-(n-1)))+0.06)*PI/2)**2) + 1);
  }
}

var didOpenInstructions = false;

function openInstructions(){
  if(document.getElementById('instructionsScreen').style.display != 'block'){
    document.getElementById('instructionsScreen').style.display = 'block';
    if(!didOpenInstructions) {
      document.getElementById('iframe').contentWindow.drawCanvas.doStuff();
      didOpenInstructions = true;
    }
  } else {
    document.getElementById('instructionsScreen').style.display = 'none';
  }
}


if(creds.length != 0){

  players = creds[1];

  document.getElementById("turnTimerCheckBox").disabled = true;
  document.getElementById("chessTimerCheckBox").disabled = true;
  document.getElementsByClassName("timeStuff")[0].style.color = "darkgrey";
  document.getElementsByClassName("timeStuff")[1].style.color = "darkgrey";
  document.getElementById("actualPlayButton").style.opacity = 0;
  document.getElementById("actualPlayButton").parentNode.removeChild(document.getElementById("actualPlayButton"));
  drawHexagons();
  document.getElementById("BackButton").style.width = "20vh";
  document.getElementById("ReplayButton").style.width = "20vh";
  updateScoreboard();
  if(turnTimerBoxChecked){
    document.getElementById("timerContainer").style.display = "block";
    document.getElementById("time").style.display = "block";
  }
  if(chessTimerBoxChecked){
    setChessTimes();
  }
  started = true;
  bgColors = [255, 255, 255];
}