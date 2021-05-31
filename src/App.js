import React from 'react';
import logo from './logo.svg';
import './App.css';

// allowed operators for expression
const operators = ['+', '-', '*', '/'];

class App extends React.Component {

  // state variable
  state={
    data: [],       // variable to store csv values
    result: 0,      // variable to store result value
    equation: null, // variable to store the expression
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

  // this function will be invoked whenever user changes the value in result box
  handleResult = (e) => {
    this.setState({
      result: Number(e.target.value)
    })
  }

  // this function will be invoked whenever user uploads a csv file
  handleFile = (e) => {
    const content = e.target.result;
    // console.log('file content',  content);
    this.setState({
      data: content.split(",")
    });
    // this.findTheExpression();
  }

  // this function is used to read the file as text
  readFile = (file) => {
    let reader = new FileReader();
    reader.onloadend = this.handleFile;
    reader.readAsText(file);
  }

  // function to check the data variable and start building the expression
  findTheExpression = () => {
    if (this.state.data.length > 0) {
      let numbers = this.state.data.map(num => [Number(num), String(num)]);
      this.postfix(numbers, []);
    } else {
      alert('Select the csv file to continue!');
    }
  }

  // function to make all possible postfix expressions using stack
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

  // function to return the result of two numbers depending on the type of operator
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
