import React from 'react';
import { getGhostImage } from './App';

export default function Square({ id, player, onSquareClick, colours}) {
    let colour;
    let content = "a";
    if(player==="Player1"){
      colour=colours[0];
    }
    else if(player==="Player2"){
      colour=colours[1];
    }
    content=getGhostImage(colour,"square-image",onSquareClick);
    return (
      <button id={id} className="square" onClick={onSquareClick}>{content}
      </button>
    );
  }
  