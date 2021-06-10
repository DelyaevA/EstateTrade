import React, {Component, useRef} from 'react';
import {Alert, Badge, Button, Card, Carousel, Col, Container, Form, Image, Nav, Row} from "react-bootstrap";
import {
    addContact,
    addReportItem,
    createAuction,
    createReview,
    deleteItemByUser,
    formatDate,
    getItem
} from "../../util/APIUtils";
import {getCoordinates} from "../../util/APIUtils";
import defItemImg from '../../img/Item-default-image.png'
import {ACCESS_TOKEN, API_BASE_URL, CATEGORY, ITEM_TYPE, CONDITION, BASE_LOGO_PATH, BASE_PICTURE_PATH} from "../../constants";
import {Map, Placemark, withYMaps, YMaps} from 'react-yandex-maps';
import {Link} from "react-router-dom";
import logo from "../../img/download.png";
import "./Item.css";
import Modal from "react-bootstrap/Modal";
import {toast} from "react-toastify";
import {useRecoilState} from "recoil";
import {chatActiveContact} from "../atom/globalState";
import NewReview from "../reviews/NewReview";
import StarRatingComponent from 'react-star-rating-component';
import {VALIDATION_NEW_AUCTION, VALIDATION_NEW_REPORT} from "../auth/validatonShema";
import {Formik} from "formik";

class Item extends Component {


    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            itemId: null,
            show: false,
            review: null,
            score: null,
            reportModal: false,
            description: null,
            category: 1
        }
        this.deleteItem = this.deleteItem.bind(this);
        this.loadItem = this.loadItem.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSuccessClose = this.handleSuccessClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.writeToSeller = this.writeToSeller.bind(this);
        this.handleChangeReview = this.handleChangeReview.bind(this);
        this.addReport = this.addReport.bind(this);
        this.closeReportModal = this.closeReportModal.bind(this);
        this.openReportModal = this.openReportModal.bind(this);
        this.handleChangeCategory = this.handleChangeCategory.bind(this);
        this.handleChangeDescription = this.handleChangeDescription.bind(this);
    }

    handleClose() {
        this.setState({
            show: false,
        });
    }

    handleSuccessClose() {
        createReview(this.state.item.createdBy.username, {score: this.state.score, review: this.state.sreview})
            .then(response => {
                toast.success(
                    response.message,
                    {position: toast.POSITION.BOTTOM_LEFT}
                )
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

    handleChangeReview(type, value) {
        this.setState({
            [type]: value,
        })
    }

    // addReport(reportData){
    //     debugger
    //     addReportItem(this.state.itemId, reportData)
    //         .then(response => {
    //             toast.success(
    //                 response.message || "Жалоба успешно отправлена!",
    //                 {position: toast.POSITION.BOTTOM_LEFT}
    //             );
    //         }).catch(error => {
    //         if (error.status === 404) {
    //             this.setState({
    //                 notFound: true,
    //                 isLoading: false
    //             });
    //         } else {
    //             toast.error(
    //                 error.message || "Sorry! Something went wrong. Please try again!",
    //                 {position: toast.POSITION.BOTTOM_LEFT}
    //             )
    //             this.setState({
    //                 serverError: true,
    //                 isLoading: false
    //             });
    //         }
    //     });
    // }

    deleteItem(){
        deleteItemByUser(this.state.itemId).then(response => {
            this.setState({
                isLoading: false
            });
            toast.success(
                "Объявление было успешно удалено!",
                {position: toast.POSITION.BOTTOM_LEFT}
            );
            this.props.history.push('/');
        }).catch(error => {
            if (error.status === 404) {
                this.setState({
                    notFound: true,
                    isLoading: false
                });
            } else {
                toast.error(
                    error.message || "Sorry! Something went wrong. Please try again!",
                    {position: toast.POSITION.BOTTOM_LEFT}
                )
                this.setState({
                    serverError: true,
                    isLoading: false
                });
            }
        });
    }

    writeToSeller() {
        addContact(this.state.item.createdBy.id)
            .then(response => {
                console.log(response);
                let seller = this.state.item.createdBy;
                this.props.callback(seller);
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

    close(){
        this.setState({ showModal: false });
    }

    open(){
        this.setState({ showModal: true });
    }

    openReportModal(){
        this.setState({reportModal: true})
    }

    closeReportModal(){
        this.setState({reportModal: false})
    }


    addReport(){
        addReportItem(this.state.item.id, Object.assign({description: this.state.description, category: this.state.category}))
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

    handleChangeCategory(event){
        this.setState({category: event.target.value})
    }

    handleChangeDescription(event){
        this.setState({description: event.target.value})
    }

    loadItem(itemId) {
        this.setState({
            isLoading: true
        });

        getItem(itemId)
            .then(response => {
                this.setState({
                    item: response,
                    itemId: response.id,
                    //TODO:Сделать чтобы дата была в state.item, а не в state (Через setState)
                    regDate: formatDate(response.createdBy.registrationDate),
                    isLoading: false
                });
            }).catch(error => {
            if(error.status === 404) {
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



    componentDidMount() {
        console.log(this.props.itemId)
        const itemId = this.props.match.params.itemId;
        this.loadItem(itemId);
    }

    componentDidUpdate(nextProps) {
        if(this.props.itemId !== nextProps.itemId) {
            this.loadItem(nextProps.itemId);
        }
    }


    render() {
        const { rating } = this.state;
        const imgViews = [];
        if (this.state.item)
            this.state.item.picturesLinks.forEach((imgLink, imgIndex) => {

                imgViews.push(
                    <Carousel.Item>
                        <img
                            src={BASE_PICTURE_PATH + this.state.item.id + "/" + imgLink}
                            alt="First slide"
                        />
                    </Carousel.Item>)
            });

        if (!imgViews.length) {
            imgViews.push(
                <Carousel.Item>
                    <img
                        className="d-block w-477px"
                        src={defItemImg}
                        alt="First slide"
                    />
                </Carousel.Item>
            )
        }

        return (
            <Container className="Item">
                <Row className={"justify-content-center"}>
                    <Col sm={7} className={"block"} style={{paddingTop: "15px", paddingBottom: "15px"}}>
                        <Container className="itemInfo">
                            {
                                this.state.item ? (
                                    <Form className="form-corrective">
                                        <div className="item_title">
                                            <h2>{this.state.item.name}</h2>
                                        </div>
                                        <div>
                                            <div className="item_category" >{CATEGORY[this.state.item.category]}</div>
                                        </div>
                                    </Form>
                                ) : null
                            }
                            <br/>
                            <Row>
                                <Carousel className={"item-pictures"}>
                                    {
                                        imgViews
                                    }
                                </Carousel>
                            </Row>
                        </Container>
                        <Container className="itemInfo">
                            {
                                this.state.item ? (
                                    <Form>
                                        <Row className="item_type">
                                            <div className="item_labels">Тип Объявления: </div>
                                            <div>{ITEM_TYPE[this.state.item.itemType]}</div>
                                        </Row>
                                        <Row className="item_condition">
                                            <div className="item_labels">Состояние: </div>
                                            <div>{CONDITION[this.state.item.condition]}</div>
                                        </Row>
                                        <Row className="item_amount">
                                            <div className="item_labels">Количество: </div>
                                            <div>{this.state.item.amount}</div>
                                        </Row>
                                        <Row  className="item_description">
                                            {this.state.item.description}
                                        </Row>
                                        <Row className="item_address">
                                            <div className="item_labels">Адрес: </div>
                                            <div style={{marginLeft: '5px'}}>{this.state.item.address.addressName}</div>
                                        </Row>
                                        <Row className="item_map">
                                            <YMaps
                                                enterprise
                                                query = {{
                                                    ns: 'use-load-option',
                                                    apikey : 'dbcdab62-3261-4418-beb2-b1628a85e8a0',
                                                    load: 'package.full'
                                                }}
                                            >
                                                <Map defaultState={{ center: [51.672, 39.1843], zoom: 11 }} width="80%" >
                                                    <Placemark
                                                        geometry={[this.state.item.address.geoLat, this.state.item.address.geoLon]}
                                                        properties={{
                                                            hintContent: this.state.item.name,
                                                            balloonContent: this.state.item.name +" " + this.state.item.price + "₽"
                                                        }}

                                                    />
                                                </Map>
                                            </YMaps>
                                        </Row>

                                    </Form>
                                ) : null
                            }
                        </Container>
                    </Col>
                    <Col sm={4} className={"block"} style={{marginLeft: "5px", paddingTop: "15px", paddingBottom: "15px", height: "100%"}}>
                        <Container className="itemInfo">
                            {
                                this.state.item ? (
                                    <Form className="form-corrective">
                                        <div className="item_price">
                                            <h2>{this.state.item.price + "₽"}</h2>
                                        </div>
                                    </Form>
                                ) : null
                            }
                        </Container>
                        <Container className="userInfo">
                            <h4>
                                <Badge className="form-corrective" variant="secondary">Информация о продавце</Badge>
                            </h4>
                            <Row>
                                <Col>
                                    {
                                        this.state.item ? (
                                            <Form>
                                                <Row className="user_username">
                                                    {this.state.item.createdBy.username}
                                                </Row>
                                                <Row className="user_rating">
                                                    Рейтинг:
                                                    <StarRatingComponent className={"star-rating"}
                                                        name="rating"
                                                        editing={false}
                                                        starCount={5}
                                                        value={this.state.item.createdBy.score}
                                                    />
                                                </Row>
                                                <Row className="user_accountType">
                                                    <b>Тип аккаунта:</b>
                                                </Row>
                                                <Row>
                                                    Частное лицо
                                                </Row>
                                                <Row className="user_regDate" style={{marginTop: "8px"}}>
                                                    <b>Дата регистрации: </b>
                                                </Row>
                                                <Row>
                                                    {this.state.regDate}
                                                </Row>
                                            </Form>

                                        ) : null
                                    }
                                </Col>
                                <Col>
                                    {
                                        this.state.item && this.state.item.createdBy.avatar ? (
                                            this.state.item.createdBy.avatar.match("googleusercontent.com") ? (
                                                <Image src={this.state.item.createdBy.avatar} roundedCircle fluid className={"user-avatar"}/>
                                            ): (
                                                <Image src={BASE_LOGO_PATH + this.state.item.createdBy.username} roundedCircle fluid className={"user-avatar"}/>
                                            )
                                        ) : (
                                            <Image src={logo} roundedCircle fluid className={"user-avatar"}/>
                                        )
                                    }

                                </Col>
                            </Row>
                            {
                                this.state.item ? (
                                    this.props.currentUser && this.state.item.createdBy.username !== this.props.currentUser.username ? (
                                        <Form>
                                            <Row className="itemButton">
                                                <Button block={true} variant="primary" size="lg" onClick={this.writeToSeller}>Написать продавцу</Button>
                                            </Row>
                                            <Row className="itemButton">
                                                <Button as={Link} to={"/profile/" + this.state.item.createdBy.username} block={true} variant="primary" size="lg">Посмотреть профиль</Button>
                                            </Row>
                                            <Row className="itemButton">
                                                <Button block={true} variant="danger" size="lg" onClick = {this.openReportModal}>Отправить жалобу</Button>
                                            </Row>
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
                                                                value={this.state.value}
                                                                onChange={this.handleChangeCategory}
                                                            >
                                                                <option value="1" data-marker="option">Свой вариант</option>
                                                                <option value="2" data-marker="option(1)">Неверное описание, фото</option>
                                                                <option value="3" data-marker="option(2)">Мошенник</option>
                                                                <option value="4" data-marker="option(3)">Объявление нарушает правила</option>
                                                                <option value="5" data-marker="option(4)">Уже продано</option>
                                                            </Form.Control>
                                                        </Form.Group>
                                                        <Form.Group controlId="exampleForm.ControlTextarea1">
                                                            <Form.Label>Описание</Form.Label>
                                                            <Form.Control
                                                                as="textarea"
                                                                name="description"
                                                                value={this.state.value}
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
                                            </Form>
                                    ):(
                                        this.props.currentUser && this.state.item.createdBy.username === this.props.currentUser.username ? (
                                        <Form>
                                            <Row className="itemButton">
                                                <Button block={true} as = {Link} variant="primary" size="lg"
                                                        to={"/editItem/" + this.state.item.id}>Изменить объявление</Button>
                                            </Row>
                                            <Row className="itemButton">
                                                <Button block={true} variant="primary" size="lg" onClick = {this.open}>Удалить объявление</Button>
                                            </Row>
                                            <Modal show={this.state.showModal} onHide={this.close}>
                                                <Modal.Header closeButton>
                                                    <Modal.Title>Удаление объявления</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <div>Вы готовы удалить объявление?</div>
                                                </Modal.Body>
                                                <Modal.Footer>
                                                    <Button onClick={this.deleteItem} to="/">Да</Button>
                                                    <Button onClick={this.close}>Нет</Button>
                                                </Modal.Footer>
                                            </Modal>
                                        </Form>
                                        ):(
                                            <Row className="itemButton">
                                                <Button as={Link} to={"/profile/" + this.state.item.createdBy.username} block={true} variant="primary" size="lg">Посмотреть профиль</Button>
                                            </Row>
                                        )
                                    )
                                ) : null
                            }
                        </Container>
                    </Col>
                </Row>

                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Оценка продавца</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {
                            this.state.item ? (
                                <NewReview username={this.state.item.createdBy.username} handleChange={this.handleChangeReview}/>
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
            </Container>

        );
    }
}


const ItemWrapper = (props) => {
    const [activeContact, setActiveContact] = useRecoilState(chatActiveContact);

    const setActive = (contact) => {
        setActiveContact(contact);
    };

    return <Item callback={setActive}{...props} />
}



export default ItemWrapper;
