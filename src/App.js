import { useState } from 'react';
import React from 'react';
import Board from './Board';
import title from "./public/title.png";
import red from './public/pacman-red.png';
import yellow from './public/pacman-yellow.png';
import blue from './public/pacman-blue.png';
import pink from './public/pacman-pink.png';
import pacman from './public/pacman.gif'

export function getGhostImage(colour,className, onSquareClick){
  let content;
  if(colour==="yellow"){
    content=<img className={className} src={yellow} alt="yellow" onClick={onSquareClick} />
  } 
  else if (colour==="red"){
    content=<img className={className} src={red} alt="red" onClick={onSquareClick} />
  }
  else if(colour==="blue"){
    content=<img className={className} src={blue} alt="blue" onClick={onSquareClick} />
  } 
  else if (colour==="pink"){
    content=<img className={className} src={pink} alt="pink" onClick={onSquareClick} />
  }
  return content;
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
  var iconColours=['red','yellow','pink','blue'];
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
    var buttonIcon = getGhostImage(iconColours[move%4],"button-icon");
    return(
      <li key={move}>
        <button className="select-move" onClick={() => jumpTo(move)}>{buttonIcon}{description}</button>
      </li>
    );
  });
  const moveLocations = moveHistory.map((move, count)=>{
    var description = move[0]+" selected square "+move[1];
    let colour = colours[1];
    if(move[0]==='Player1'){
      colour=colours[0];
    }
    if(move[0]){
      return(
      <li key={move} className='move-description'>{getGhostImage(colour,"button-icon")}{description}</li>
    );
    };
  });
  var player1Colour= <h4>Player 1: </h4>
  var player1Image = getGhostImage(colours[0],"icon");
  var player2Colour= <h4>Player 2: </h4>;
  var player2Image = getGhostImage(colours[1],"icon");
  return (
    <div className="game-border">
      <img src={pink} height={"60px"} alt="pink-ghost" className='ghost-pink'/>
      <img src={blue} height={"65px"} alt="pink-ghost" className='ghost-blue'/>
      <img src={pacman} height={"65px"} className="pacman"alt="pacman"/>
      <div className="game">
      <div className="game-info">
      <button className='select-colour' onClick={pickColour}>Change Colours</button>
        <div className='player-colour'>{player1Colour}{player1Image} </div><br></br>
        <div className='player-colour'>{player2Colour}{player2Image} </div>
        <h2 className='section-title'>Move History</h2>
        <ol>{moveLocations}</ol>
      </div>
      <div className="game-board">
        <img src={title} className="title" alt="title"/>
        <Board player1IsNext={player1IsNext} squares={currentSquares} onPlay={handlePlay} colours={colours}/>
        
      </div>
      <div className="game-info">
        <h2 className='section-title'>Previous Moves</h2>
        <ol>{moves}</ol>
      </div>     
    </div>
    
    </div>
    
  );
}

