import React, {Component} from 'react';
import Container from 'react-bootstrap/Container';
import {Navbar, Nav, Form, FormControl, Button, NavItem, NavDropdown} from 'react-bootstrap';
import {
    Route,
    withRouter,
    Switch,
    Link
} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import {getCurrentUser} from '../util/APIUtils';
import {ACCESS_TOKEN, API_BASE_URL} from '../constants';

import './App.css';

import Login from '../model/auth/login/Login';
import Signup from '../model/auth/signup/Signup';
import AppHeader from "../common/header/AppHeader";
import TestComponent from "../common/TestComponent";
import Content from "../common/content/Content";
import AdminControlPanel from "../common/adminControlPanel/AdminControlPanel";
import TableUsers from "../common/adminControlPanel/TableUsers";
import TableItems from "../common/adminControlPanel/TableItems";
import NewItem from "../model/item/NewItem";
import UserFullInfo from "../common/adminControlPanel/UserFullInfo";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import ItemFullInfo from "../common/adminControlPanel/ItemFullInfo";
import Profile from "../model/user/profile/Profile";
import ItemList from "../model/item/ItemList";
import Settings from "../model/user/profile/Settings/Settings";
import Item from "../model/item/Item";
import ActivateUser from "../model/auth/ActivateUser";
import Footer from "../common/footer/Footer";
import OauthLogin from "../model/auth/OauthLogin";
import Review from "../model/reviews/Reviews";
import NewReview from "../model/reviews/NewReview";
import RegistrationDashboard from "../common/adminControlPanel/RegistrationDashboard";
import NewAuction from "../model/auction/NewAuction";
import Auction from "../model/auction/Auction";
import AuctionList from "../model/auction/AuctionList";
import TableAuctions from "../common/adminControlPanel/TableAuctions";
import AuctionFullInfo from "../common/adminControlPanel/AuctionFullInfo";
import ResetPassword from "../model/auth/resetPassword/ResetPassword";
import InputPassword from "../model/auth/resetPassword/InputPassword";
import TableUsersReports from "../common/adminControlPanel/TableUsersReports.js";
import TableItemsReports from "../common/adminControlPanel/TableItemsReports";
import Chat from "../model/chat/Chat";
import ChatContainer from "../model/chat/Chat";
import ItemWrapper from "../model/item/Item";
import PrivateRoute from "../common/PrivateRoute";
import ItemPicture from "../model/item/ItemPicture";
import UserProfile from "../model/user/profile/UserProfile";
import UserProfileWrapper from "../model/user/profile/UserProfile";

toast.configure()

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            isAuthenticated: false,
            isLoading: false
        }
        this.handleLogout = this.handleLogout.bind(this);
        this.loadCurrentUser = this.loadCurrentUser.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.test = this.test.bind(this);

    }


    test() {
        console.log("OK");
    }

    loadCurrentUser() {
        this.setState({
            isLoading: true
        });
        getCurrentUser()
            .then(response => {
                this.setState({
                    currentUser: response,
                    isAuthenticated: true,
                    isLoading: false
                });
            }).catch(error => {
            this.setState({
                isLoading: false
            });
        });
        console.log(this.state.currentUser)
    }


    componentDidMount() {
        this.loadCurrentUser();
    }

    handleLogout(redirectTo = "/", notificationType = "success", description = "Возвращайтесь снова!") {
        localStorage.removeItem(ACCESS_TOKEN);

        this.setState({
            currentUser: null,
            isAuthenticated: false
        });

        this.props.history.push(redirectTo);

        toast[notificationType](
            description,
            {position: toast.POSITION.BOTTOM_LEFT}
        )
    }

    handleLogin(redirectTo = "/") {
        toast.success(
            "Вход выполнен!",
            {position: toast.POSITION.BOTTOM_LEFT}
        )
        this.loadCurrentUser();
        this.props.history.push("/");
    }

    handleActivate(redirectTo = "/"){
        toast.success(
            "На вашу почту выслано письмо!",
            {position: toast.POSITION.BOTTOM_LEFT}
        )
        this.props.history.push("/");
    }

    handleReset(redirectTo = "/login"){
        toast.success(
            "Вы поменяли пароль!",
            {position: toast.POSITION.BOTTOM_LEFT}
        )
        this.props.history.push("/login")
    }

    render() {
        const notify = () => {

        }
        return (
            <div className="app">
                <AppHeader isAuthenticated={this.state.isAuthenticated}
                           currentUser={this.state.currentUser}
                           onLogout={this.handleLogout}/>

                <div className="auth-wrapper">
                    <div className="auth-inner">
                        <Switch>
                            <Route exact path='/' component={Content}/>
                            <Route exact path='/profile' render={
                                (props) =>
                                    <Profile
                                        currentUser={this.state.currentUser}
                                        componentName="my-items"
                                        component={<ItemList
                                            isAuthenticated={this.state.isAuthenticated}
                                            currentUser={this.state.currentUser}
                                            type={"MY_CREATED_ITEMS"}
                                        />}
                                        {...props} />
                            }/>
                            <Route exact path='/profile/auctions' render={
                                (props) =>
                                    <Profile
                                        currentUser={this.state.currentUser}
                                        componentName="my-auctions"
                                        component={<AuctionList
                                            isAuthenticated={this.state.isAuthenticated}
                                            currentUser={this.state.currentUser}
                                            type={"MY_CREATED_AUCTIONS"}
                                        />}
                                        {...props} />
                            }/>
                            <Route exact path='/profile/settings' render={
                                (props) =>
                                    <Profile
                                        currentUser={this.state.currentUser}
                                        componentName="my-items"
                                        component={<Settings currentUser={this.state.currentUser}/>}
                                        {...props} />
                            }/>
                            <Route path="/login"
                                   render={
                                       (props) =>
                                           <Login onLogin={this.handleLogin} {...props} />
                                   }/>
                            <Route path="/signup" component={Signup}/>
                            <Route exact path="/admin-control-panel"
                                   render={
                                       (props) =>
                                           <AdminControlPanel
                                               isAuthenticated={this.state.isAuthenticated}
                                               currentUser={this.state.currentUser}
                                               isTable={false}
                                               {...props} />
                                   }/>
                            <Route exact path="/admin-control-panel/users"
                                   render={
                                       (props) =>
                                           <AdminControlPanel
                                               isAuthenticated={this.state.isAuthenticated}
                                               currentUser={this.state.currentUser}
                                               component={<TableUsers></TableUsers>}
                                               nameComponent={'tableUsers'}
                                               isTable={true}
                                               {...props} />
                                   }/>
                            <Route exact path="/admin-control-panel/reports/users"
                                   render={
                                       (props) =>
                                           <AdminControlPanel
                                               isAuthenticated={this.state.isAuthenticated}
                                               currentUser={this.state.currentUser}
                                               component={<TableUsersReports></TableUsersReports>}
                                               nameComponent={'tableUsersReports'}
                                               isTable={true}
                                               {...props} />
                                   }/>
                            <Route exact path="/admin-control-panel/reports/items"
                                   render={
                                       (props) =>
                                           <AdminControlPanel
                                               isAuthenticated={this.state.isAuthenticated}
                                               currentUser={this.state.currentUser}
                                               component={<TableItemsReports></TableItemsReports>}
                                               nameComponent={'tableItemsReports'}
                                               isTable={true}
                                               {...props} />
                                   }/>
                            <Route exact path="/admin-control-panel/items"
                                   render={
                                       (props) =>
                                           <AdminControlPanel
                                               isAuthenticated={this.state.isAuthenticated}
                                               currentUser={this.state.currentUser}
                                               component={<TableItems></TableItems>}
                                               nameComponent={'tableItems'}
                                               isTable={true}
                                               {...props} />
                                   }/>
                            <Route exact path="/admin-control-panel/auctions"
                                   render={
                                       (props) =>
                                           <AdminControlPanel
                                               isAuthenticated={this.state.isAuthenticated}
                                               currentUser={this.state.currentUser}
                                               component={<TableAuctions></TableAuctions>}
                                               nameComponent={'tableAuctions'}
                                               isTable={true}
                                               {...props} />
                                   }/>
                            <Route path="/api/activate/:code"
                                   render={(props) => <ActivateUser onLogin={this.handleActivate} {...props} />}/>
                            <Route exact path="/api/auth/oauth_login/:code"
                                   render={(props) => <OauthLogin onLogin={this.handleLogin} {...props} />}/>
                            <Route exact path="/resetPassword"
                                   render={(props) => <ResetPassword {...props} />}/>
                            <Route exact path="/api/resetPassword/:code"
                                   render={(props) => <InputPassword {...props} />}/>
                            <Route exact path="/newItem"
                                   render={
                                       (props) =>
                                           <NewItem
                                               type = {"NEW"}
                                               isAuthenticated={this.state.isAuthenticated}
                                               currentUser={this.state.currentUser}
                                               {...props} />
                                   }/>
                            <Route exact path="/newAuction"
                                   render={
                                       (props) =>
                                           <NewAuction
                                               isAuthenticated={this.state.isAuthenticated}
                                               currentUser={this.state.currentUser}
                                               {...props} />
                                   }/>
                            <Route exact path="/editItem/:id"
                                   render={
                                       (props) =>
                                           <NewItem
                                               type = {"EDIT"}
                                               isAuthenticated={this.state.isAuthenticated}
                                               currentUser={this.state.currentUser}
                                               {...props} />
                                   }/>
                            <Route exact path="/admin-control-panel/users/:username"
                                   render={
                                       (props) =>
                                           <AdminControlPanel
                                               isAuthenticated={this.state.isAuthenticated}
                                               currentUser={this.state.currentUser}
                                               component={<UserFullInfo currentUser={this.state.currentUser}/>}
                                               nameComponent={'userFullInfo'}
                                               isTable={false}
                                               {...props} />
                                   }/>
                            <Route exact path="/admin-control-panel/items/:itemId"
                                   render={
                                       (props) =>
                                           <AdminControlPanel
                                               isAuthenticated={this.state.isAuthenticated}
                                               currentUser={this.state.currentUser}
                                               component={<ItemFullInfo/>}
                                               nameComponent={"itemFullInfo"}
                                               isTable={false}
                                               {...props} />
                                   }
                            />
                            <Route exact path="/admin-control-panel/auctions/:auctionId"
                                   render={
                                       (props) =>
                                           <AdminControlPanel
                                               isAuthenticated={this.state.isAuthenticated}
                                               currentUser={this.state.currentUser}
                                               component={<AuctionFullInfo/>}
                                               nameComponent={"auctionFullInfo"}
                                               isTable={false}
                                               {...props} />
                                   }
                            />
                            <Route exact path="/admin-control-panel/dashboards/registration"
                                   render={
                                       (props) =>
                                           <AdminControlPanel
                                               isAuthenticated={this.state.isAuthenticated}
                                               currentUser={this.state.currentUser}
                                               component={<RegistrationDashboard/>}
                                               nameComponent={"registrationDashboard"}
                                               isTable={false}
                                               {...props} />
                                   }
                            />
                            <Route exact path="/items/:itemId"
                                   render={
                                       (props) =>
                                           <ItemWrapper
                                               isAuthenticated={this.state.isAuthenticated}
                                               currentUser={this.state.currentUser}
                                               {...props} />
                                   }
                            />
                            <Route path="/auctions/:auctionId"
                                   render={
                                       (props) =>
                                           <Auction
                                               isAuthenticated={this.state.isAuthenticated}
                                               currentUser={this.state.currentUser}
                                               {...props} />
                                   }
                            />
                            <Route exact path="/reviews/:username" render={(props) => <Review {...props}/>}/>
                            <Route path="/reviews/:username/create" render={(props) => <NewReview {...props} type={"CREATE_REVIEW"}/>}/>
                            <Route path="/reviews/:username/update" render={(props) => <NewReview {...props} type={"UPDATE_REVIEW"}/>}/>
                            <Route path="/profile/:username" render={(props) => <UserProfileWrapper  isAuthenticated={this.state.isAuthenticated}
                                                                                                     currentUser={this.state.currentUser} {...props}/>}/>
                            <Route exact path="/chat" render={(props) => <ChatContainer currentUser={this.state.currentUser} {...props} />} />
                            <PrivateRoute authenticated={this.state.isAuthenticated} exact path="/items/:itemId/addImg" component={ItemPicture}/>
                        </Switch>
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }
}


export default withRouter(App);
