import { useState } from 'react';
import React from 'react';
import ConfettiExplosion from 'react-confetti-explosion';
//import title from "./title.png";
import red from './pacman-red.png';
import yellow from './pacman-yellow.png';
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

function Square({ id, letter, onSquareClick}) {
  let content;
  if(letter==="X"){
    content=<img className="squareImage" src={yellow} alt="yellow" onClick={onSquareClick} />
  } 
  else if (letter==="O"){
    content=<img className="squareImage" src={red} alt="red" onClick={onSquareClick} />
  }
  return (
    <button id={id} className="square" onClick={onSquareClick}>{content}
    </button>
  );
}


function Board({ xIsNext, squares, onPlay}) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]||checkDraw(squares)) {
      return;
    }
    let player;
    const nextSquares = squares.slice();
    if (xIsNext) {
      player='X'
    } else {
      player='O';
    }
    nextSquares[i] = player;
    onPlay(nextSquares,player,i);
  }
  const draw = checkDraw(squares);
  const winner = calculateWinner(squares);
  let gameStatus;
  if (winner) {
    for(var i=0;i<winner.length;i++){
      document.getElementById(winner[i].toString()).classList.add('win');
    }
    gameStatus = 'Winner: ' + squares[winner[0]]; 
  } 
  else if(draw){
    gameStatus = 'Draw';
  }
  else {
    gameStatus = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }
  const rowCount = 3, colCount = 3;
  return (
    <div>
      <div className="game-status">{gameStatus}</div>
      {winner && <ConfettiExplosion />}
      <div>
        {[...new Array(rowCount)].map((x, rowIndex) => {
          return (
            <div className="board-row" key={rowIndex}>
              {[...new Array(colCount)].map((y, colIndex) => {
                  const position = rowIndex * colCount + colIndex;
                  return <Square id={position} letter={squares[position]} onSquareClick={() => handleClick(position)} />
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
  const status = Array(9).fill(null);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [moveHistory, setMoveHistory] = useState([Array(9).fill(null)]);
  const [currentMove,setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;
  function handlePlay(nextSquares,player,location) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    const nextMoveHistory = moveHistory.slice(0, currentMove + 1);
    nextMoveHistory.push([player,location+1]);
    setMoveHistory(nextMoveHistory);
    setCurrentMove(nextHistory.length - 1);
  }
  function reset() {
    setCurrentMove(0);
    setHistory([Array(9).fill(null)]);
    setMoveHistory([Array(9).fill(null)]);
    for(var i=0;i<9;i++){
      document.getElementById(i.toString()).className="square";
    }
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
      return <p key={"current"}>{description}</p>;
    }
    else if(move>0){
      description="Go to move "+move;
    }
    else{
      description="Go to start of game";
    }
    return(
      <li key={move}>
        <button className="selectMove" onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });
  const moveLocations = moveHistory.map((move, count)=>{
    var description = "Player "+move[0]+" placed a tile in square "+move[1];
    if(move[0]){
      return(
      <li key={move}>{description}</li>
    );
    }
    
  });
  return (
    <div>
      {/*<img src={title} height={"100px"}/>*/}
      <div className="game">
      
      <div className="game-info">
        <h2>Move History</h2>
        <ol>{moveLocations}</ol>
      </div>
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
        <button onClick={()=>reset()} className="selectMove">Reset Game</button>
      </div>
      <div className="game-info">
        <h2>Previous Moves</h2>
        <ol>{moves}</ol>
      </div>
      
    </div>

    </div>
    
  );
}

