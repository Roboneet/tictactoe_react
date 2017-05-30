import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

function Square(props){
    return (
      <button className="square" onClick={() => props.onClick()}>
        {props.value}
      </button>
    );
}

function calculateWinner(squares){
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

  for(let i=0; i< lines.length;i++){
    const [a,b,c] = lines[i];
    if(squares[a] && squares[a]===squares[b] && squares[a] === squares[c]){
      return squares[a]
    }
  }
  return null;
}

class Board extends React.Component {
  

  

  renderSquare(i) {
    return (
      <Square
      value={this.props.squares[i]}
      onClick={()=>this.props.onClick(i)} />);
  }

  render() {
    let board = [[0,1,2],[3,4,5],[6,7,8]]

    let my_dom = board.map((row,i) => {
      
      var k = row.map((ele,j)=>{
        return this.renderSquare(ele);
      },this);
      return (<div className="board-row">
          {k}
        </div>
      );

      
    },this);

    return (
      <div>{my_dom}</div>
    );
  }
}

class Game extends React.Component {
  constructor(){
    super();
    this.state = {
      history:[{
        squares:Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext : true,
      reverse : false,
    }
  }

  handleClick(i){
    const history = this.state.history.slice(0,this.state.stepNumber+1);
    const current = history[history.length -1]; 
    const squares = current.squares.slice();
    if(calculateWinner(squares)|| squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext ? 'X': 'O';
    this.setState({
      history:history.concat([{squares:squares}]),
      stepNumber: history.length,
      xIsNext:!this.state.xIsNext,
    })
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step%2)? false:true,
    })

  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const len = history.length


    const moves = history.map((step,index) => {
      let move = index
      if(this.state.reverse)
        move = len -1 -index;
      const desc = move?
      'Move #'+move:
      'Game Start';
      if(move === this.state.stepNumber){
        return (
          <li key={move}>
            <a href="#" onClick={()=> this.jumpTo(move)} className="current" >{desc}</a>
          </li>
        );
      }
      return (
        <li key={move}>
          <a href="#" onClick={()=> this.jumpTo(move)}>{desc}</a>
        </li>
      );
    },this);

    let status;
    if(winner)
      status = 'Winner is '+ winner;
    else
      status = 'Next player:' +(this.state.xIsNext?'X':'O');

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares}
            onClick={(i)=>this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <button onClick={()=>{this.setState({reverse: !this.state.reverse})}}>toggle</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
