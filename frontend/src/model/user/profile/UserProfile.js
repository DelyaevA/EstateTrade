import React, {Component} from "react";
import {Col, Container, Image, Nav, Navbar, Row, Button, Form} from "react-bootstrap";
import {addContact, addReportItem, addReportUser, createReview, getUserProfile} from "../../../util/APIUtils";
import {BASE_LOGO_PATH} from "../../../constants";
import logo from "../../../img/download.png";
import {Link} from "react-router-dom";
import AuctionList from "../../auction/AuctionList";
import ItemList from "../../item/ItemList";
import Reviews from "../../reviews/Reviews";
import {toast} from "react-toastify";
import Modal from "react-bootstrap/Modal";
import NewReview from "../../reviews/NewReview";
import {useRecoilState} from "recoil";
import {chatActiveContact} from "../../atom/globalState";

class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            typeComponent: 'USER_CREATED_ITEMS' ,
            user: null,
            showModal: false,
            show: false,
            review: null,
            score: null,
            reportModal: false,
            description: null,
            category: 1,
            value: "",
        }
        this.loadUserProfile = this.loadUserProfile.bind(this);
        this.changeComponent = this.changeComponent.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSuccessClose = this.handleSuccessClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.handleChangeReview = this.handleChangeReview.bind(this);
        this.writeToSeller = this.writeToSeller.bind(this);
        this.closeReportModal = this.closeReportModal.bind(this);
        this.openReportModalUser = this.openReportModalUser.bind(this);
        this.handleChangeCategory = this.handleChangeCategory.bind(this);
        this.handleChangeDescription = this.handleChangeDescription.bind(this);
        this.addReport = this.addReport.bind(this);
    }

    writeToSeller() {
        addContact(this.state.user.userId)
            .then(response => {
                let user = this.state.user;
                let newU = {
                    admin: user.admin,
                    email: user.email,
                    avatar: user.avatar,
                    id: user.userId,
                    score: user.score,
                    username: user.username,
                    value: ""
                }
                this.props.callback(newU);
                this.props.history.push('/chat');
            }).catch(error => {
            if(error.status === 401) {
                toast.error(
                    "Некорректный userId. Попробуйте снова!",
                    {position: toast.POSITION.BOTTOM_LEFT}
                )
            } else {
                toast.error(
                    error.message || "Что-то пошло не так. Попробуйте снова!",
                    {position: toast.POSITION.BOTTOM_LEFT}
                )
            }
        });
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
                this.props.history.push("/")
            } else {
                this.setState({
                    serverError: true,
                    isLoading: false
                });
            }
        });
    }

    handleChangeCategory(event){
        this.setState({category: event.target.value})
    }

    handleChangeDescription(event){
        this.setState({description: event.target.value})
    }

    componentDidMount() {
        const username = this.props.match.params.username;
        this.loadUserProfile(username);
    }

    componentDidUpdate(nextProps) {
        if (this.props.match.params.username !== nextProps.match.params.username) {
            this.loadUserProfile(nextProps.match.params.username);
        }
    }

    changeComponent(typeComponent) {
        this.setState({
            typeComponent: typeComponent
        })
    }

    handleClose() {
        this.setState({
            show: false,
        });
    }

    close(){
        this.setState({ showModal: false });
    }

    open(){
        this.setState({ showModal: true });
    }

    openReportModalUser(){
        this.setState({reportModal: true})
    }

    closeReportModal(){
        this.setState({reportModal: false})
    }



    handleSuccessClose() {
        createReview(this.state.user.username, {score: this.state.score, review: this.state.sreview})
            .then(response => {
                toast.success(
                    response.message,
                    {position: toast.POSITION.BOTTOM_LEFT}
                )
                setTimeout(() => {  window.location.reload(); }, 1500);
            }).catch(error => {
            if (error.status === 401) {
                toast.error(
                    "Форма заполнена некорректно. Попробуйте снова!",
                    {position: toast.POSITION.BOTTOM_LEFT}
                )
                console.log("Your Username or Password is incorrect. Please try again!")
            } else {
                toast.error(
                    error.message || "Упс! Что-то пошло не так. Попробуйте снова!",
                    {position: toast.POSITION.BOTTOM_LEFT}
                )
                console.log(error.message || 'Sorry! Something went wrong. Please try again!')
            }
        });

        this.setState({
            show: false,
        })
    }

    handleShow() {
        this.setState({
            show: true
        })
    }

    addReport(){
        addReportUser(this.state.user.userId, Object.assign({description: this.state.description, category: this.state.category}))
            .then(response => {
                toast.success(
                    "Жалоба успешно отправлена!",
                    {position: toast.POSITION.BOTTOM_LEFT}
                )
            }).catch(error => {
            if(error.status === 401) {
                toast.error(
                    "Форма заполнена некорректно. Попробуйте снова!",
                    {position: toast.POSITION.BOTTOM_LEFT}
                )
                console.log("Your Username or Password is incorrect. Please try again!")
            } else {
                toast.error(
                    error.message || "Упс! Что-то пошло не так. Попробуйте снова!",
                    {position: toast.POSITION.BOTTOM_LEFT}
                )
                console.log(error.message || 'Sorry! Something went wrong. Please try again!')
            }
        });
        this.closeReportModal();
    }

    handleChangeReview(type, value) {
        this.setState({
            [type]: value,
        })
    }


    render() {
        return (
            <div className="profile">
                {
                    this.state.user ? (
                        <Container className="user-profile">
                            <Row>
                                <Col xs={8} md={3} style={{paddingLeft: 0}}>
                                    <ProfileSideBar currentUser={this.state.user}
                                                    callback={this.changeComponent}
                                                    writecallback={this.writeToSeller} modalReportCallback={this.openReportModalUser}/>
                                </Col>
                                <Col className={"right-side block"} style={{width: "1px"}}>
                                    <div className={this.props.componentName + "-container"}>
                                        {
                                            this.state.typeComponent === "USER_CREATED_AUCTIONS" ? (
                                                <AuctionList type="USER_CREATED_AUCTIONS" currentUser={this.state.user}/>
                                            ) : null
                                        }
                                        {
                                            this.state.typeComponent === "USER_CREATED_ITEMS" ? (
                                                <ItemList type="USER_CREATED_ITEMS" currentUser={this.state.user}/>
                                            ) : null
                                        }
                                        {
                                            this.state.typeComponent === "USER_REVIEWS" ? (
                                               <Reviews username={this.state.user.username} type="USER_REVIEWS" modalcallback={this.handleShow}/>
                                            ) : null
                                        }
                                    </div>
                                </Col>
                            </Row>
                            <Modal show={this.state.show} onHide={this.handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Оценка продавца</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    {
                                        this.state.user ? (
                                            <NewReview username={this.state.user.username} handleChange={this.handleChangeReview}/>
                                        ) : null
                                    }
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button name="yes" variant="primary" onClick={this.handleSuccessClose}>
                                        Оценить
                                    </Button>
                                    <Button name="no" variant="secondary" onClick={this.handleClose}>
                                        Отмена
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                            <Modal show={this.state.reportModal} onHide={this.closeReportModal}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Отправить жалобу</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form id = "report">
                                        <Form.Group controlId="exampleForm.ControlSelect1">
                                            <Form.Label>Категория</Form.Label>
                                            <Form.Control
                                                as="select"
                                                name="category"
                                                value={this.state.category}
                                                onChange={this.handleChangeCategory}
                                            >
                                                <option value="1" data-marker="option">Свой вариант</option>
                                                <option value="2" data-marker="option(1)">Непорядочный продавец</option>
                                                <option value="3" data-marker="option(2)">Мошенник</option>
                                                <option value="4" data-marker="option(3)">Оскробления</option>
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group controlId="exampleForm.ControlTextarea1">
                                            <Form.Label>Описание</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                name="description"
                                                value={this.state.description}
                                                onChange={this.handleChangeDescription}
                                                rows={3}
                                            />
                                        </Form.Group>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button onClick={this.addReport}>Отправить</Button>
                                </Modal.Footer>
                            </Modal>
                        </Container>
                    ) : null
                }
            </div>
        )
    }
}


class ProfileSideBar extends Component {
    render() {
        return (
            <div className="side-bar block">
                <Navbar>
                    <Nav className="flex-column">
                        {
                            this.props.currentUser.avatar ? (
                                this.props.currentUser.avatar.match("googleusercontent.com") ? (
                                    <Image src={this.props.currentUser.avatar} roundedCircle fluid className={"user-avatar"}/>
                                ) : (
                                    <Image src={BASE_LOGO_PATH + this.props.currentUser.username} roundedCircle fluid className={"user-avatar"}/>
                                )
                            ) : (
                                <Image src={logo} roundedCircle fluid className={"user-avatar"}/>
                            )
                        }
                        <Navbar.Brand>@{this.props.currentUser.username}</Navbar.Brand>
                        <Button style={{marginTop: "15px"}} onClick={()=>{this.props.callback("USER_CREATED_ITEMS")}}>Объявления пользователя</Button>
                        <Button style={{marginTop: "15px"}} onClick={()=>{this.props.callback("USER_CREATED_AUCTIONS")}}>Аукционы пользователя</Button>
                        <Button style={{marginTop: "15px"}} variant="warning" onClick={()=>{this.props.writecallback()}}>Написать продавцу</Button>
                        <Button style={{marginTop: "15px"}} variant="info" onClick={()=>{this.props.callback("USER_REVIEWS")}}>Отзывы на пользователя</Button>
                        <Button style={{marginTop: "15px"}} variant="danger" size="lg" onClick ={()=> {this.props.modalReportCallback()}}>Отправить жалобу</Button>
                    </Nav>
                </Navbar>
            </div>
        )
    }
}

const UserProfileWrapper = (props) => {
    const [activeContact, setActiveContact] = useRecoilState(chatActiveContact);

    const setActive = (contact) => {
        setActiveContact(contact);
    };

    return <UserProfile callback={setActive} {...props} />
}



export default UserProfileWrapper;
