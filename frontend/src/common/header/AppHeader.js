import React, { Component } from 'react';
import {
    Link,
    withRouter
} from 'react-router-dom';
import './AppHeader.css';
import {Button, Dropdown, Nav, Navbar, NavDropdown} from "react-bootstrap";
import logo from "../../img/logo.png";

class AppHeader extends Component {
    constructor(props) {
        super(props);
        this.handleMenuClick = this.handleMenuClick.bind(this);
    }

    handleMenuClick(event) {
        if(event.name === "logout") {
            this.props.onLogout();
        }
    }

    handleMainClick(){
        this.props.history.push("/");
    }

    render() {
        let menuItems;
        let br = this.props.currentUser ?
                    this.props.currentUser.countUnreadMessages ?
                        this.props.currentUser.username + " (" + (this.props.currentUser.countUnreadMessages) + ")" :
                        this.props.currentUser.username
                        :
                    "";
        if(this.props.currentUser) {
            menuItems = [
                <Nav.Link as={Link} to="/" >
                    Домой
                </Nav.Link>,
                <NavDropdown title="Новый товар" id="collasible-nav-dropdown">
                    <NavDropdown.Item href="/newAuction">Создать аукцион</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/newItem">Создать объявление</NavDropdown.Item>
                </NavDropdown>,
                <NavDropdown title={br} id="collasible-nav-dropdown">
                    <NavDropdown.Item href="/profile">Профиль</NavDropdown.Item>
                    <NavDropdown.Item href="/chat">
                        Чат
                        {
                            this.props.currentUser.countUnreadMessages ? (
                                <span style={{color: "red"}}> ({this.props.currentUser.countUnreadMessages})</span>
                            ) : null
                        }
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item name="logout" onClick={(e) => this.handleMenuClick(e.currentTarget)}>
                        Выйти
                    </NavDropdown.Item>
                </NavDropdown>,
            ];
            if (this.props.currentUser.admin) {
                menuItems.unshift(
                    <Nav.Link as={Link} to="/admin-control-panel">
                        Админка
                    </Nav.Link>
                )
            }
        } else {
            menuItems = [
                <Nav.Link as={Link} to="/login">
                    Войти
                </Nav.Link>,
                <Nav.Link as={Link} to="/signup">
                    Зарегистрироваться
                </Nav.Link>,
            ];
        }
        return (
            <header className="app-header">
                <Navbar>
                    <Navbar.Brand href="/">
                        <img
                            src={logo}
                            width="113"
                            height="40"
                            className="d-inline-block align-top"
                            alt="Site logo"
                        />
                    </Navbar.Brand>
                    <Navbar.Collapse>
                        <Nav className="mr-auto">

                        </Nav>
                        <Nav>
                            {menuItems}
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </header>
        );
    }
}


export default withRouter(AppHeader);
