import {Component} from "react";
import { render } from 'react-dom';
class TestComponent extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <div className="TestComponent">
            <div><h1>TEST COMPONENT</h1></div>
            <div><h1>{this.props.name}</h1></div>
            </div>
        )
    }
}




export default TestComponent;
