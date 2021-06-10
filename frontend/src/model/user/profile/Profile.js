import React, {Component} from 'react';
import {getUserProfile} from "../../../util/APIUtils";
import {Col, Container, Image, Nav, Navbar, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import logo from '../../../img/download.png';
import {BASE_LOGO_PATH} from "../../../constants";
import "./Profile.css"
console.log(logo); // /logo.84287d09.png

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: false
        }
        this.loadUserProfile = this.loadUserProfile.bind(this);
    }

    loadUserProfile(username) {
        this.setState({
            isLoading: true
        });

        getUserProfile(username)
            .then(response => {
                this.setState({
                    user: response,
                    isLoading: false
                });
            }).catch(error => {
            if (error.status === 404) {
                this.setState({
                    notFound: true,
                    isLoading: false
                });
            } else {
                this.setState({
                    serverError: true,
                    isLoading: false
                });
            }
        });
    }

    render() {
        return (
            <div className="profile">
                {
                    this.props.currentUser ? (
                        <Container className="user-profile">
                        <Row>
                            <Col xs={8} md={3} style={{paddingLeft: 0}}>
                                <ProfileSideBar currentUser={this.props.currentUser}/>
                            </Col>
                            <Col className={"right-side block"} style={{width: "1px"}}>
                                <div className={this.props.componentName + "-container"}>{this.props.component}</div>
                            </Col>
                        </Row>
                    </Container>
                    ) : null
                }
            </div>
        );
    }
}

class ProfileSideBar extends Component {
    render() {
        console.log(this.props.currentUser)
        return (
            <div className="side-bar block">
                <Navbar>
                    <Nav className="flex-column">
                        {
                            this.props.currentUser.avatar ? (
                                this.props.currentUser.avatar.match("googleusercontent.com") ? (
                                    <Image src={this.props.currentUser.avatar} roundedCircle fluid className={"user-avatar"}/>
                                ): (
                                    <Image src={BASE_LOGO_PATH + this.props.currentUser.username} roundedCircle fluid className={"user-avatar"}/>
                                )
                            ) : (
                                <Image src={logo} roundedCircle fluid className={"user-avatar"}/>
                            )
                        }


                        <Navbar.Brand>@{this.props.currentUser.username}</Navbar.Brand>
                        <Nav.Link as={Link} to="/profile">Мои объявления</Nav.Link>
                        <Nav.Link as={Link} to="/profile/auctions">Мои аукционы</Nav.Link>
                        <Nav.Link as={Link} to="/profile/settings">Настройки</Nav.Link>
                    </Nav>
                </Navbar>
            </div>
        )
    }
}

export default Profile;
