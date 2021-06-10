import {Navbar, Nav, NavItem, Button, Glyphicon} from 'react-bootstrap';
import React, {Component} from "react"
class Sidebar extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="sidebar">
                <Nav defaultActiveKey="/home" className="flex-column">
                    <Nav.Link href="/home">Active</Nav.Link>
                    <Nav.Link eventKey="link-1">Link</Nav.Link>
                    <Nav.Link eventKey="link-2">Link</Nav.Link>
                    <Nav.Link eventKey="disabled" disabled>
                        Disabled
                    </Nav.Link>
                </Nav>
            </div>
        )
    }
}

export default Sidebar;