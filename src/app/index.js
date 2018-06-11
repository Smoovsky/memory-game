import $ from 'jQuery';
import '../style/css/fontawesome.min.css';
import '../style/css/fa-regular.min.css';
import isOdd from 'is-odd';
import {gameInit, dispIconSelect} from './gameInit';

console.log(gameInit);

const gameState = {};



const gameEntity = (size) => {
  if(isOdd(size) || size < 0 || size > 20)
  {
    return false; //proper notification required
  }

  gameInit(size * size);

  let width = ((size + 1) * 10 + size * 50) + 'px';

  const container = $('#gameContainer');
  container.css({width, height: width, backgroundColor:'#2979FF',color:'#fff', padding:'10px'});

  const board = [];


  for(let i = 0; i < size; i++){
    board[i] = [];
    let row = $('<div>').css({width, height:'50px',margin:'10px 0px',padding:'0px 5px'});
    for(let j = 0; j < size; j++){
      let iconName = dispIconSelect();
      board[i][j] = $('<div>').css({margin:'0px 5px',width:'50px',height:'50px',lineHeight:'50px', textAlign:'center',display:'inline-block', backgroundColor:'rgba(0,0,0,0.08)',borderRadius:'10%'}).appendTo(row);
      board[i][j].attr({'icon-name':iconName});
      $('<i>').addClass('far '+'fa-'+iconName).appendTo(board[i][j]);
    }
    row.appendTo(container);
  }
  console.log(board);
};

gameEntity(4);
