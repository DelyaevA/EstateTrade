import React, {Component} from "react";
import {Col, Container, DropdownButton, Nav, Navbar, Row, Table} from "react-bootstrap";
import Sidebar from "../content/Sidebar";
import {SidebarData} from "./SideBarData";
import SubMenu from "./SubMenu";
import {Link} from "react-router-dom";
import TableUsers from "./TableUsers";
import "./AdminControlPanel.css"
import UserFullInfo from "./UserFullInfo";
import ItemFullInfo from "./ItemFullInfo";
import RegistrationDashboard from "./RegistrationDashboard";
import Auction from "../../model/auction/Auction";
import AuctionFullInfo from "./AuctionFullInfo";
import TableUsersReports from "./TableUsersReports";
import TableItemsReports from "./TableItemsReports";

class AdminControlPanel extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        let component;

        switch (this.props.nameComponent) {
            case 'tableUsers':
                component = this.props.component;
                break;
            case 'tableItems':
                component = this.props.component;
                break;
            case 'tableAuctions':
                component = this.props.component;
                break;
            case 'userFullInfo':
                component=<UserFullInfo username={this.props.match.params.username}/>
                break;
            case 'itemFullInfo':
                component=<ItemFullInfo itemId={this.props.match.params.itemId}/>
                break;
            case 'registrationDashboard':
                component=<RegistrationDashboard />
                break;
            case 'auctionFullInfo':
                component=<AuctionFullInfo auctionId={this.props.match.params.auctionId}/>
                break;
            case 'tableItemsReports':
                component=<TableItemsReports/>
                break;
            case 'tableUsersReports':
                component=<TableUsersReports/>
                break;
            default:
                break;
        }

        return (
            <Container className="admin-control-panel" style={{width:"100%", marginLeft:0, marginTop:20}}>
                {
                    (!this.props.isAuthenticated) ? (
                        <div>NOT AUTHENTICATED</div>
                    ) : null
                }
                {
                    (this.props.isAuthenticated && this.props.currentUser.admin === 0) ? (
                        <div>NOT AN ADMIN</div>
                    ) : null
                }
                {
                    (this.props.isAuthenticated && this.props.currentUser.admin) ? (
                        <Row>
                            <Col xs={3} style={{paddingLeft:0}}>
                                <SideNavbar/>
                            </Col>
                            <Col xs={9}>
                                {component}
                            </Col>
                        </Row>
                    ) : null
                }
            </Container>
        )
    }
}


class SideNavbar extends Component {
    render() {
        return (
            <Navbar className={"side-bar"}>
                <Nav className="flex-column">
                    <Nav.Link as={Link} to="/admin-control-panel/users">Пользователи</Nav.Link>
                    <Nav.Link as={Link} to="/admin-control-panel/items">Объявления</Nav.Link>
                    <Nav.Link as={Link} to="/admin-control-panel/auctions">Аукционы</Nav.Link>
                    <Nav.Link as={Link} to="/admin-control-panel/reports/items">Жалобы на объявления</Nav.Link>
                    <Nav.Link as={Link} to="/admin-control-panel/reports/users">Жалобы на пользователей</Nav.Link>
                    <Nav.Link as={Link} to="/admin-control-panel/dashboards/registration">График регистраций</Nav.Link>
                </Nav>
            </Navbar>
        )
    }
}

export default AdminControlPanel;
