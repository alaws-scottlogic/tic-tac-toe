import { useState } from 'react';
import React from 'react';
import ConfettiExplosion from 'react-confetti-explosion';

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

function setTextColor(letter,status){
  if(status){
    return "white";
  }
  if(letter==="X"){
    return "#ffc09f";
  }
  else{
    return "#79addc";
  }
}

function setBackgroundColor(status){
  if(status==='win'){
    return "#3deb94";
  }
  else if (status==='X'){
    return "#ffc09f";
  }
  else if (status==='O'){
    return "#79addc";
  }
  return "white";
}

function Square({ id, letter, onSquareClick, status }) {
  return (
    <button id={id} className="square" onClick={onSquareClick} style={{ background: setBackgroundColor(status), color: setTextColor(letter,status) }}>
      {letter}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay,status}) {
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
      status[winner[i]]='win';
    }
    gameStatus = 'Winner: ' + squares[winner[0]]; 
  } 
  else if(draw){
    gameStatus = 'Draw';
    status=squares;
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
                  const position = rowIndex * colCount + colIndex
                  return <Square id={'square'+{position}} letter={squares[position]} onSquareClick={() => handleClick(position)} status={status[position]} />
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

  function jumpTo(nextMove){
    setCurrentMove(nextMove);
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
    <div className="game">
      <div className="game-info">
        <h2>Move History</h2>
        <ol>{moveLocations}</ol>
      </div>
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} status={status}/>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
      
    </div>
  );
}

