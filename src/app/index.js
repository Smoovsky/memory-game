import $ from 'jQuery';
import '../style/css/fontawesome.min.css';
import '../style/css/fa-regular.min.css';
import '../style/main.css';
import isOdd from 'is-odd';
import {gameInit, dispIconSelect} from './gameInit';

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
  const container = $('#gameContainer');
  $('div[data-type="game"],#score')? $('div[data-type="game"],#score').remove() :null;
};

const gameCleared = ()=>{
  const container = $('#gameContainer');
  resetGame();
  $(`<div>Congrats! You scored ${gameState.score}</div>`).css({margin:'auto auto', width:'auto',height:'100px',textAlign:'center'}).appendTo(container);
};

const stepClear = () => {
  gameState.clickOne = false;
  gameState.clickTwo = false;
  gameState.clicked = [];
  gameState.zFin = false;
  gameState.oFin = false;
};

function handleClick(){
  let target = $(this);
  if(!gameState.clickTwo && !gameState.inProgess && !gameState.corrected.includes(target.attr('icon-name'))){
    if(!gameState.clickOne && target != gameState.clicked[0]){
      gameState.clicked.push(target);
      gameState.clickOne = target.attr('icon-name');
      tileAnimate(target, 'flip');
    }
    else{
      gameState.clicked.push(target);
      gameState.clickTwo = target.attr('icon-name');

      if(gameState.clickOne == gameState.clickTwo){
        //console.log((gameState.clicked)[0], gameState.clicked[1]);
        gameState.corrected.push(gameState.clickOne);
        let cb = ()=>{

          let cb0 = ()=>{

            gameState.zFin = true;
            if(gameState.oFin == true){
              stepClear();
              gameState.inProgess = false;
            }
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
        tileAnimate(target, 'flip', cb);
        gameState.score -= Math.floor(gameState.deduction/gameState.size);
        gameState.deduction = gameState.deduction >= gameState.size ? 0 : gameState.deduction+1;
        $('#score').html(`Your Score: ${gameState.score}`);
      }
    }
  }
}
// console.log(gameState);

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

const gameSetup = function(){
  resetGame();
  const container = $('#gameContainer');
  let form = $('<form id="game-setup">Please enter the level:<br /><input /><input type="submit" value="start"></input><br />[even numder, smaller than 20]</form>').appendTo(container);
  let handleSubmit = (e) => {
    e.preventDefault();
    if(isOdd(e.target[0].value) || e.target[0].value <= 0 || e.target[0].value > 20)
    {
      return false; //proper notification required
    }
    gameEntity(e.target[0].value);
    $('#game-setup').remove();
    return false;
  };
  form.submit(handleSubmit);
};


const gameEntity = (size) => {
  size = Number(size);
  gameState.size = size;
  if(isOdd(size) || size < 0 || size > 20)
  {
    return false; //proper notification required
  }

  gameInit(size * size);

  let width = ((size + 1) * 10 + size * 50) + 'px';

  const container = $('#gameContainer');
  $(`<div id="score">Your Score: ${gameState.score}</div>`).insertBefore(container);
  container.css({width, height: width, backgroundColor:'#2979FF',color:'#fff', padding:'10px'});

  const board = [];

  for(let i = 0; i < size; i++){
    board[i] = [];
    let row = $('<div>').attr({'data-type':'game'}).css({width, height:'50px',margin:'10px 0px',padding:'0px 5px'});
    for(let j = 0; j < size; j++){
      let iconName = dispIconSelect();
      board[i][j] = $('<div>').css({margin:'0px 5px',width:'50px',height:'50px',lineHeight:'50px', textAlign:'center',display:'inline-block', backgroundColor:'rgba(0,0,0,0.08)',borderRadius:'10%', color:'rgba(72,114,253,0.08)'}).appendTo(row);
      board[i][j].attr({'icon-name':iconName});
      board[i][j].click(handleClick);
      $('<i>').addClass('far '+'fa-'+iconName).appendTo(board[i][j]);
    }
    row.appendTo(container);
  }
};

gameSetup();
