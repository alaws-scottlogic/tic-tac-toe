import React from 'react';
import ConfettiExplosion from 'react-confetti-explosion';

import Square from './Square';
import { getGhostImage } from './App';

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

export default function Board({ player1IsNext, squares, onPlay, colours}) {
    function handleClick(i) {
      if (calculateWinner(squares) || squares[i]||checkDraw(squares)) {
        return;
      }
      const nextSquares = squares.slice();
      const player = player1IsNext ? 'Player1' : 'Player2';
      nextSquares[i] = player;
      onPlay(nextSquares,player,i);
    }
    const winner = calculateWinner(squares);
    const draw = checkDraw(squares);
    
    let gameStatus,iconColour, image;
    if (winner) {
      for(var i=0;i<winner.length;i++){
        document.getElementById(winner[i].toString()).classList.add('win');
      }
      gameStatus = 'Winner: ' + squares[winner[0]]; 
      
      if (squares[winner[0]]==="Player1"){
        iconColour=colours[0];
      }
      else{
        iconColour=colours[1];
      }
      image = getGhostImage(iconColour,"icon");
    } 
    else if(draw){
      gameStatus = 'It\'s a Draw';
      for (let i = 0; i < squares.length; i++){
        let colour;
        if(squares[i].toLowerCase()==="player1"){
          colour=colours[0];
        }
        if(squares[i].toLowerCase()==="player2"){
          colour=colours[1];
        }
        document.getElementById(i.toString()).classList.add(colour);
      }
      const image1 = getGhostImage(colours[0],"icon");
      const image2 = getGhostImage(colours[1],"icon");
      image = <div>{image1}{image2}</div>;
    }
    else {
      gameStatus = 'Next player: ' + (player1IsNext ? 'Player1' : 'Player2');
      iconColour = player1IsNext ? colours[0] : colours[1];
      image = getGhostImage(iconColour,"icon")
    }
    const rowCount = 3, colCount = 3;
    return (
      <div>
        <div className="game-status"><h4>{gameStatus}</h4>{image}</div>
        
        {winner && <ConfettiExplosion />}
        <div className = "boardContainer">
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