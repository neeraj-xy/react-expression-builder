import React from 'react';
import logo from './logo.svg';
import './App.css';

const operators = ['+', '-', '*', '/'];

class App extends React.Component {

  state={
    data: [],
    result: 0,
    equation: null,
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <input type="file" accept=".csv" onChange={ e => this.readFile(e.target.files[0])} />
          <hr />
          Target Number: <input defaultValue="0" type="number" min="0" onChange={this.handleResult}/>
          <button onClick={this.findTheExpression}>Click to find</button>
          <br />
          <span><b>Numbers : </b> {this.state.data.join(",")}</span>
          {this.state.equation ?
            <div>Expression: { this.state.equation }</div>
          :
            <div>Expression not available!</div>
          }
        </header>
      </div>
    );
  }

  handleResult = (e) => {
    this.setState({
      result: Number(e.target.value)
    })
  }

  handleFile = (e) => {
    const content = e.target.result;
    // console.log('file content',  content);
    this.setState({
      data: content.split(",")
    });
    // this.findTheExpression();
  }
  
  readFile = (file) => {
    let reader = new FileReader();
    reader.onloadend = this.handleFile;
    reader.readAsText(file);
  }

  findTheExpression = () => {
    if (this.state.data.length > 0) {
      let numbers = this.state.data.map(num => [Number(num), String(num)]);
      this.postfix(numbers, []);
    } else {
      alert('Select the csv file to continue!');
    }
  }

  postfix = (nums, stack) => {
    if (stack.length >= 2) {
      let val2 = stack.pop();
      let val1 = stack.pop();

      for (let index = 0; index < operators.length; index++) {
        if (!(operators[index] === '/' && val2[0] === 0)) {
          let op_res = this.operations(operators[index], val1[0], val2[0]);
          stack.push([op_res, '(' + val1[1] + operators[index] + val2[1] + ')']);
          if (this.postfix([], stack)) {return 1;}
          if (this.postfix(nums, stack)) {return 1;}
          stack.pop();
        }
      }
      stack.push(val1);
      stack.push(val2);
    }
    else if (nums.length === 0) {
      let value = stack[0][0];
      let expr = stack[0][1];
      if (value === this.state.result) {
        this.setState({
          equation: expr
        });
      }
      return value === this.state.result;
    }
    let tempNums = nums.slice();
    for (let index = 0; index < tempNums.length; index++) {
      stack.push(tempNums[index]);
      nums.shift();
      if (this.postfix(nums, stack)) {
        return true;
      }
      stack.pop();
      nums.push(tempNums[index]);
    }
  }

  operations = (operator, num1, num2) => {
    switch (operator) {
      case '+':
        return num1 + num2;

      case '-':
        return num1 - num2;

      case '*':
        return num1 * num2;

      case '/':
        return num1 / num2;
    
      default:
        break;
    }
  }

}

export default App;
