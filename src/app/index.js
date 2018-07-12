import $ from 'jQuery';
import '../style/css/fontawesome.min.css';
import '../style/css/fa-regular.min.css';
import '../style/css/fa-solid.min.css';
import '../style/main.css';
import isOdd from 'is-odd';
import {gameInit, dispIconSelect} from './gameInit';
import durationFormatter from 'format-duration';

//object to track the status of game globally.
const gameState = {
  size: 0,
  clickOne: false,
  clickTwo: false,
  moves: 0,
  score: 0,
  clicked:[],
  corrected:[],
  zFin:false,
  oFin:false,
  inProgess:false,
  deduction:0,
};

//reset the game state.
const resetGame = () => {
  Object.assign(gameState,{
    clickOne: false,
    clickTwo: false,
    moves: 0,
    score: 10,
    clicked:[],
    corrected:[],
    zFin:false,
    oFin:false,
    inProgess:false,
  });
  const container = $('#gameContainer').html('');
  $('#util').remove();
  clearInterval(timer);
  // $('div[data-type="game"],#score')? $('div[data-type="game"],#score').remove() :null;
};

//generate the finish screen when player successfully complete the game.
const gameCleared = ()=>{
  const container = $('#gameContainer');
  container.css({padding:'1px'});
  let score = gameState.score;
  container.html('');
  container.css({padding:'0 0 5px 0', borderRadius:'0px'});
  $(`<div>Congrats!<br>You scored: ${Math.round(gameState.score/10*3)} stars<br>Time consumed: ${durationFormatter(Date.now()-currentTime)}</div>`).css({margin:'auto auto', width:'auto',height:'100px',textAlign:'center'}).appendTo(container);
  $('<div>Try Again</div>').css({border:'white solid 1px','borderRadius':'5px', cursor:'pointer', margin:'5px auto',width:'70px'}).click(gameSetup).appendTo(container);
};

//function called when a move is completed(two cards are flipped)
const stepClear = () => {
  gameState.clickOne = false;
  gameState.clickTwo = false;
  gameState.clicked = [];
  gameState.zFin = false;
  gameState.oFin = false;
};

//function to update the number of moves performed.
const updateMoves = (moves) => {
  $('#moves').html('Moves:'+moves);
};

//function to handle the click event on each card.
function handleClick(){
  let target = $(this);
  //to confirm that previous flip is completed
  if(!gameState.clickTwo && !gameState.inProgess && !gameState.corrected.includes(target.attr('icon-name'))){
    //if it's the first card to be flipped
    if(!gameState.clickOne && target != gameState.clicked[0]){
      gameState.clicked.push(target);
      gameState.clickOne = target.attr('icon-name');
      tileAnimate(target, 'flip');
    }
    ////if it's the second card to be flipped
    else{
      if(!target.is(gameState.clicked[0])){
        gameState.clicked.push(target);
        gameState.clickTwo = target.attr('icon-name');
        //upon a successful flip(two cards are the same)
        if(gameState.clickOne == gameState.clickTwo){
          gameState.corrected.push(gameState.clickOne);
          gameState.moves++;
          updateMoves(gameState.moves);
          //callback functions implement a simple lock to ensure that before success animation of both cards completed, no further flip action could be performed.
          let cb = ()=>{
            let cb0 = ()=>{
              gameState.zFin = true;
              if(gameState.oFin == true){
                stepClear();
                gameState.inProgess = false;
              }
              //check whether all cards have been successfully found, if ture, call gameCleared() to prompt finish screen.
              if(gameState.corrected.length == gameState.size*gameState.size/2){
                gameCleared();
              }
            };
            let cb1 = ()=>{
              gameState.oFin = true;
              if(gameState.zFin == true){
                stepClear();
                gameState.inProgess = false;
              }
              if(gameState.corrected.length == gameState.size*gameState.size/2){
                gameCleared();
              }
            };
            tileAnimate(gameState.clicked[0],'right',cb0);
            tileAnimate(gameState.clicked[1],'right',cb1);
          };
          tileAnimate(target, 'flip', cb);
        }else{
          //if two flips are different, play the fail animation
          gameState.moves++;
          updateMoves(gameState.moves);
          let cb = ()=>{
            let cb0 = ()=>{
              gameState.zFin = true;
              if(gameState.oFin == true){
                stepClear();
                gameState.inProgess = false;
              }
            };
            let cb1 = ()=>{
              gameState.oFin = true;
              if(gameState.zFin == true){
                stepClear();
                gameState.inProgess = false;
              }
            };
            tileAnimate(gameState.clicked[0],'wrong',cb0);
            tileAnimate(gameState.clicked[1],'wrong',cb1);
          };
          //flip animation will always be called first, callback function depends on the result of  flip
          tileAnimate(target, 'flip', cb);
          //update the score
          gameState.score -= Math.floor(gameState.deduction/gameState.size);
          gameState.deduction = gameState.deduction >= gameState.size ? 0 : gameState.deduction+1;
          updateScore(gameState.score);
        }
      }

    }
  }
}

//update the score(stars)
function updateScore(score){
  let scoreDOM = $('#score').children();
  score = Math.round(3*score/10);
  //console.log(scoreDOM.children());
  if(score == 2){
    //window.score = scoreDOM;
    $(scoreDOM[2]).removeClass('fas').addClass('far');
  }
  else if(score == 1){
    $(scoreDOM[1]).removeClass('fas').addClass('far');
  }
  else if(score == 0){
    $(scoreDOM[0]).removeClass('fas').addClass('far');
  }
}

//control the animation of tile depends on different outcomes
function tileAnimate(target, action, cb){

  gameState.inProgess = true;
  if(action == 'flip'){
    let handler = function(){
      target.unbind('animationend',handler);
      target.removeClass('animate-flip-t');
      if(cb){
        cb();
      }
      else{
        gameState.inProgess = false;
      }
    };
    target.bind('animationend', handler);
    target.addClass('flipped');
    target.addClass('animate-flip-t');
    setTimeout(()=>{target.css({color:'#fff'});},250);
    return null;
  }

  if(action == 'wrong'){
    let handler = function(){
      target.unbind('animationend',handler);
      target.removeClass('animate-wrong');
      let handler1 = function(){
        target.unbind('animationend',handler1);
        target.removeClass('animate-flip-b flipped');
        if(cb){
          cb();
        }
      };
      target.bind('animationend',handler1);
      target.addClass('animate-flip-b');
    };
    target.bind('animationend',handler);
    target.addClass('animate-wrong');
    setTimeout(()=>{target.css({color:'rgba(72,114,253,0.08)'});},250);
    return null;
  }

  if(action == 'right'){
    let handler = function(){
      target.unbind('animationend',handler);
      target.removeClass('animate-right');
      if(cb){
        cb();
      }
    };
    target.bind('animationend', handler);
    target.addClass('animate-right');
    return null;
  }
}

let timer;

function updateTimer(){
  //console.log(currentTime);
  $('#timer').html('Time elapsed: '+durationFormatter(Date.now() - currentTime));
}

let currentTime = Date.now();

//initial setup screen to allow player choose the level difficulty
const gameSetup = function(){
  resetGame();
  const container = $('#gameContainer');
  let form = $('<form id="game-setup">Please enter the level:<br /><input size="10" style="border-radius:5px"/><input style="background-color:transparent; border:1px solid white; border-radius:2px; margin-left:5px; color:white" type="submit" value="start"></input><br /><span style="font-size:10px">[even numder, smaller or equal to 14]</span></form>').appendTo(container);
  let handleSubmit = (e) => {
    e.preventDefault();
    if(isOdd(e.target[0].value) || e.target[0].value <= 0 || e.target[0].value > 14)
    {
      return false; //proper notification required
    }
    gameEntity(e.target[0].value);
    $('#game-setup').remove();
    return false;
  };
  container.css({width:'200px', color:'white', backgroundColor:'#2979FF',padding:'5px', borderRadius:'5px 5px 0 0'});
  form.submit(handleSubmit);
};


//function to initialize the game board, given the size(difficulty)
const gameEntity = (size) => {
  size = Number(size);
  gameState.size = size;
  if(isOdd(size) || size < 0 || size > 20)
  {
    return false; //proper notification required
  }

  gameInit(size * size);

  let base = 5;

  let width = 2 * base * size + 10 * base * size;

  currentTime = Date.now();

  if(width > $(window).width()){
    base = Math.floor(base * ($(window).width()/width));
  }

  width = 2 * base * size + 10 * base * size;

  const container = $('#gameContainer');
  let util = $('<div id="util">Score:</div>').css({width:width-2*base+'px',backgroundColor:'#2979FF',color:'#fff', padding:base+'px',borderRadius:'10px 10px 0 0', position:'relative' }).insertBefore(container);
  let score = $('<div id="score" style="display:inline-block">');
  for(let i = 0; i < 3; i++){
    score.append('<i class="fas fa-star">');
  }
  score.appendTo(util);
  let moves = $('<div id="moves">Moves:0</div>').appendTo(util);
  let refresh = $('<div><i class="fas fa-sync"></div>').appendTo(util);
  refresh.css({position:'absolute', right:base+'px',top:base+'px'});

  refresh.click(gameSetup);

  container.css({width, backgroundColor:'#2979FF',color:'#fff', padding:'0px'});
  const board = [];

  for(let i = 0; i < size; i++){
    //console.log(base);
    board[i] = [];
    let row = $('<div>').attr({'data-type':'game'}).css({width:width+'px', height:10*base + 'px',margin:'0px 0px',padding:base+'px 0px'});
    for(let j = 0; j < size; j++){
      let iconName = dispIconSelect();
      board[i][j] = $('<div>').css({margin:'0px '+base+'px',width:10* base + 'px',height:10*base + 'px',lineHeight:10*base+'px', textAlign:'center',display:'inline-block', backgroundColor:'rgba(0,0,0,0.08)',borderRadius:'10%', color:'rgba(72,114,253,0.08)'}).appendTo(row);
      board[i][j].attr({'icon-name':iconName});
      board[i][j].click(handleClick);
      $('<i>').addClass('far '+'fa-'+iconName).appendTo(board[i][j]);
    }
    row.appendTo(container);
  }
  $('<div id="timer" style="float:right">Time elapsed:00:00</div>').appendTo(container);
  $('<div style="clear:both"></div>').appendTo(container);
  timer = setInterval(updateTimer, 1000);
};

gameSetup();
