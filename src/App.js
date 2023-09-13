import { useState } from 'react';
import React from 'react';
import ConfettiExplosion from 'react-confetti-explosion';
import title from "./title.png";
import red from './pacman-red.png';
import yellow from './pacman-yellow.png';
import blue from './pacman-blue.png';
import pink from './pacman-pink.png';
import pacman from './pacman.gif'
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}

function checkDraw(squares){
  for (let i = 0; i < squares.length; i++){
    if(squares[i]===null){
      return false;
    }
  }
    return true;
}

function Square({ id, player, onSquareClick, colours}) {
  let colour,content;
  if(player==="Player1"){
    colour=colours[0];
  }
  else if(player==="Player2"){
    colour=colours[1];
  }
  
  if(colour==="yellow"){
    content=<img className="squareImage" src={yellow} alt="yellow" onClick={onSquareClick} />
  } 
  else if (colour==="red"){
    content=<img className="squareImage" src={red} alt="red" onClick={onSquareClick} />
  }
  else if(colour==="blue"){
    content=<img className="squareImage" src={blue} alt="blue" onClick={onSquareClick} />
  } 
  else if (colour==="pink"){
    content=<img className="squareImage" src={pink} alt="pink" onClick={onSquareClick} />
  }
  return (
    <button id={id} className="square" onClick={onSquareClick}>{content}
    </button>
  );
}


function Board({ player1IsNext, squares, onPlay, colours}) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]||checkDraw(squares)) {
      return;
    }
    let player;
    const nextSquares = squares.slice();
    if (player1IsNext) {
      player='Player1'
    } else {
      player='Player2';
    }
    nextSquares[i] = player;
    onPlay(nextSquares,player,i);
  }
  const winner = calculateWinner(squares);
  const draw = checkDraw(squares);
  
  let gameStatus;
  if (winner) {
    for(var i=0;i<winner.length;i++){
      document.getElementById(winner[i].toString()).classList.add('win');
    }
    gameStatus = 'Winner: ' + squares[winner[0]]; 
  } 
  else if(draw){
    gameStatus = 'It\'s a Draw';
    for (let i = 0; i < squares.length; i++){
      document.getElementById(i.toString()).classList.add(squares[i].toLowerCase());
    }
  }
  else {
    gameStatus = 'Next player: ' + (player1IsNext ? 'Player1' : 'Player2');
  }
  const rowCount = 3, colCount = 3;
  return (
    <div>
      <div className="game-status"><h2>{gameStatus}</h2></div>
      {winner && <ConfettiExplosion />}
      <div>
        {[...new Array(rowCount)].map((x, rowIndex) => {
          return (
            <div className="board-row" key={rowIndex}>
              {[...new Array(colCount)].map((y, colIndex) => {
                  const position = rowIndex * colCount + colIndex;
                  return <Square id={position} player={squares[position]} onSquareClick={() => handleClick(position)} colours={colours} />
                }
              )}
            </div>
          )
        })
      }
      </div>
  </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [moveHistory, setMoveHistory] = useState([Array(9).fill(null)]);
  const [currentMove,setCurrentMove] = useState(0);
  const [colours,setColours] = useState(['yellow','red']);
  const currentSquares = history[currentMove];
  const player1IsNext = currentMove % 2 === 0;
  function pickColour(){
    var array = ['red','yellow','pink','blue']
    var shuffled = array.sort(function(){ return 0.5 - Math.random() });
    var selected = shuffled.slice(0,2);
    setColours(selected);
  }
  function handlePlay(nextSquares,player,location) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    const nextMoveHistory = moveHistory.slice(0, currentMove + 1);
    nextMoveHistory.push([player,location+1]);
    setMoveHistory(nextMoveHistory);
    setCurrentMove(nextHistory.length - 1);
  }
  function jumpTo(nextMove){
    setCurrentMove(nextMove);
    for(var i=0;i<9;i++){
      document.getElementById(i.toString()).className="square";
    }
  }
  const moves = history.map((squares, move)=>{
    let description;
    if (move===currentMove){
      description="You are at move "+move;
      return <li key={"current"}>{description}</li>;
    }
    else if(move>0){
      description="Go to move "+move;
    }
    else{
      description="Reset Game";
    }
    return(
      <li key={move}>
        <button className="selectMove" onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });
  const moveLocations = moveHistory.map((move, count)=>{
    var description = move[0]+" selected square "+move[1];
    if(move[0]){
      return(
      <li key={move}>{description}</li>
    );
    }
    ;
  });
  var player1Colour= "Player 1: "+colours[0];
  var player2Colour= "Player 2: "+colours[1];
  return (
    <div className="game-border">
      <img src={blue} height={"65px"} alt="blue-ghost" className='blue-ghost'/>
      <img src={pacman} height={"65px"} className="pacman"alt="pacman"/>
      <div class="food">
        <div class="pacman__food"></div>
        <div class="pacman__food"></div>
        <div class="pacman__food"></div>
        <div class="pacman__food"></div>
        <div class="pacman__food"></div>
        <div class="pacman__food"></div>
        <div class="pacman__food"></div>
        <div class="pacman__food_end"></div>
      </div>
      
      
      <div className="game">
      
      <div className="game-info">
        <h2>Move History</h2>
        <ol>{moveLocations}</ol>
      </div>
      <div className="game-board">
        <img src={title} height={"60px"} className="title"/>
        <Board player1IsNext={player1IsNext} squares={currentSquares} onPlay={handlePlay} colours={colours}/>
        <button className='selectMove' onClick={pickColour}>Change Colours</button>
        <h2>Current Colours:</h2>
        <h2>{player1Colour} </h2>
        <h2>{player2Colour} </h2>
      </div>
      <div className="game-info">
        <h2>Previous Moves</h2>
        <ol>{moves}</ol>
      </div>
      
    </div>
    
    </div>
    
  );
}

