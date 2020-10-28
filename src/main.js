import {createElement, render, Component} from './toy-react'

class MyComponent extends Component {
  constructor() {
    super();
    this.state = {
      a: 1,
      b: 2
    }
  }
  render() {
    return <div>
    <h1>MyComponent</h1>
    <h2>a: {this.state.a.toString()}</h2>
     <button onclick={()=> { this.setState({a: this.state.a + 1 })}}>add</button>
    </div>
  }
}


render(
  <MyComponent id="a">
  </MyComponent>, document.body
)