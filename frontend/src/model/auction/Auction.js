import React, { Component } from 'react';
import {Badge, Button, Carousel, Col, Container, Form, Image, Row} from "react-bootstrap";
import {
    castBet,
    createAuction,
    endAuction,
    endAuctionNow,
    formatDate,
    getAllBetForAuction,
    getAuction
} from "../../util/APIUtils";
import defItemImg from '../../img/Item-default-image.png'
import {BASE_LOGO_PATH, CATEGORY, CONDITION, BASE_AUCTION_PICTURE_PATH} from "../../constants";
import {Map, Placemark, withYMaps, YMaps} from 'react-yandex-maps';
import {Link} from "react-router-dom";
import logo from "../../img/download.png";
import {forEach} from "react-bootstrap/ElementChildren";
import "./Auction.css";
import Modal from "react-bootstrap/Modal";
import * as util from "util";
import {VALIDATION_NEW_AUCTION} from "../auth/validatonShema";
import {toast} from "react-toastify";
import {Formik} from "formik";
import StarRatingComponent from 'react-star-rating-component';

class Auction extends Component {

    constructor(props) {
        super(props);
        this.count = this.count.bind(this);
        this.state = {
            days: 0,
            showModal: false,
            deadline: null,
            x: null,
            minutes: 0,
            bet: null,
            hours: 0,
            seconds: 0,
            auction: null,
            auctionId: null,
            auctionText: "Аукцион закончится через:",
            PageLoaded: false,
            active: true,
            lowBet: null,
            userBet: "",
            isNeedUpdate: true
        }
        this.loadAuction = this.loadAuction.bind(this);
        //this.loadBets = this.loadBets.bind(this);
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCanstBet = this.handleCanstBet.bind(this);
        this.endsAuctionNow = this.endsAuctionNow.bind(this);
    }

    endsAuctionNow(){
        this.close();
        endAuctionNow(this.props.match.params.auctionId)
            .then(response => {
                toast.success(
                    "Аукцион окончен!",
                    {position: toast.POSITION.BOTTOM_LEFT}
                )
                setTimeout(() => {  window.location.reload(); }, 1500);

            }).catch(error => {
            toast.error(
                error.message || "Упс! Что-то пошло не так. Попробуйте снова!",
                {position: toast.POSITION.BOTTOM_LEFT}
            )
            console.log(error.message || 'Sorry! Something went wrong. Please try again!')
        });
        this.close();
    }

    loadBets(auctionId){
        this.setState({
            isLoading : true
        });
        getAllBetForAuction(auctionId)
            .then(response => {
                this.setState({
                    bets: response,
                    isLoading: false
                });
            });
    }

    loadAuction(auctionId) {
        this.setState({
            isLoading: true
        });
        getAuction(auctionId)
            .then(response => {
                this.setState({
                    auction: response,
                    deadline: new Date( `${response.expirationDateTime}`).getTime(),
                    x: setInterval(this.count, 1000),
                    auctionId: response.id,
                    lowBet: response.minPrice,
                    //TODO:Сделать чтобы дата была в state.item, а не в state (Через setState)
                    regDate: formatDate(response.createdBy.registrationDate),
                    userBet: response.createdBy.username,
                    isLoading: false
                });
                if (response.bets[0].price === null){
                    this.setState({
                        userBet: response.createdBy.username,
                        lowBet: response.minPrice,
                    });
                }
                else {
                    this.setState({
                        userBet: response.bets[response.bets.length - 1].createdBy.username,
                        lowBet: response.bets[response.bets.length - 1].price,
                    });
                }
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

    close(){
        this.setState({ showModal: false });
    }

    open(){
        this.setState({ showModal: true });
    }

    handleCanstBet(value){
        console.log(value)

        castBet(this.props.match.params.auctionId, {price: value})
            .then(response => {
                toast.success(
                    "Ставка сделана!",
                    {position: toast.POSITION.BOTTOM_LEFT}
                )
                setTimeout(() => {  window.location.reload(); }, 1500);
            }).catch(error => {
            toast.error(
                error.message || "Упс! Что-то пошло не так. Попробуйте снова!",
                {position: toast.POSITION.BOTTOM_LEFT}
            )
            console.log(error.message || 'Sorry! Something went wrong. Please try again!')
        });
    }

    handleChange(event) {
        this.setState({bet: event.target.value});
    }

    count () {
        var now = new Date().getTime();
        var t = this.state.deadline - now;
        var days = Math.floor(t / (1000 * 60 * 60 * 24));
        var hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((t % (1000 * 60)) / 1000);
        this.setState({days, minutes, hours, seconds})
        if (t < 0) {
            clearInterval(this.x);
            this.setState({ days: 0, minutes: 0, hours: 0, seconds: 0, auctionText: "Аукцион завершен!", active: false })
        }
    }

    componentDidMount() {
        console.log(this.props.auctionId)
        const auctionId = this.props.match.params.auctionId;
        this.loadAuction(auctionId);
    }

    componentDidUpdate(nextProps) {
        if(this.props.match.params.auctionId !== nextProps.match.params.auctionId) {
            this.loadAuction(nextProps.auctionId);
        }
    }

    render() {
        const { rating } = this.state;

        const imgViews = [];
        if (this.state.auction)
            this.state.auction.picturesLinks.forEach((imgLink, imgIndex) => {

                imgViews.push(
                    <Carousel.Item>
                        <img
                            src={BASE_AUCTION_PICTURE_PATH + this.state.auction.id + "/" + imgLink}
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

        const { days, seconds, hours, minutes, auctionText, modalOpen } = this.state;
        return (
            <Container className="Auction">
                <Row>
                    <Col sm={8} className={"block"} style={{paddingTop: "15px", paddingBottom: "15px", height: "100%"}}>
                        <Container className="auctionInfo">
                            {
                                this.state.auction ? (
                                    <Form>
                                        <div className="auctionTitle">
                                            <h2>{this.state.auction.name}</h2>
                                        </div>
                                        <div>
                                            <div style={{color: "black"}}>{CATEGORY[this.state.auction.category]}</div>
                                        </div>
                                    </Form>
                                ) : null
                            }
                            <br/>
                            <Row>
                                <Carousel className={"auction-pictures"}>
                                    {
                                        imgViews
                                    }
                                </Carousel>
                            </Row>
                        </Container>
                        <Container className="auctionInfo">
                            {
                                this.state.auction ? (
                                    <Form>
                                        <Row className="auction_condition">
                                            <div className="item_labels">Состояние: </div>
                                            <div>{CONDITION[this.state.auction.condition]}</div>
                                        </Row>
                                        <Row  className="auction_description">
                                            {this.state.auction.description}
                                        </Row>
                                        <Row className="auction_address">
                                            <div className="item_labels">Адрес: </div>
                                            <div>{this.state.auction.address.addressName}</div>
                                        </Row>
                                        <Row className="auctionMap">
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
                                                        geometry={[this.state.auction.address.geoLat, this.state.auction.address.geoLon]}
                                                        properties={{
                                                            hintContent: this.state.auction.name,
                                                            balloonContent: this.state.auction.name +" " + this.state.auction.endPrice + "₽"
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
                    <Col sm={4}>
                        <Container className={"block"} style={{marginLeft: "0px", paddingTop: "15px", paddingBottom: "15px"}}>
                            <h4>
                                <Badge variant="secondary">Информация о продавце</Badge>
                            </h4>
                            <Row style={{marginLeft: "5px"}}>
                                <Col>
                                    {
                                        this.state.auction ? (
                                            <Form>
                                                <Row className="user_username">
                                                    {this.state.auction.createdBy.username}
                                                </Row>
                                                <Row className="user_rating">
                                                    Рейтинг:
                                                    <StarRatingComponent className={"star-rating"}
                                                                         name="rating"
                                                                         editing={false}
                                                                         starCount={5}
                                                                         value={this.state.auction.createdBy.score}
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
                                        this.state.auction ? (
                                            this.state.auction.createdBy.avatar ? (
                                                this.state.auction.createdBy.avatar.match("googleusercontent.com") ? (
                                                    <Image src={this.state.auction.createdBy.avatar} roundedCircle fluid className={"user-avatar"}/>
                                                ): (
                                                    <Image src={BASE_LOGO_PATH + this.state.auction.createdBy.username} roundedCircle fluid className={"user-avatar"}/>
                                                )
                                            ) : (<Image src={logo} roundedCircle fluid className={"user-avatar"}/>)

                                        ) : null
                                    }

                                </Col>
                            </Row>
                            {
                                this.state.auction ? (
                                    this.props.currentUser && this.state.auction.createdBy.username !== this.props.currentUser.username ? (
                                        <Container className="userInfo">
                                            <Row className="itemButton">
                                                <Button as={Link} to={"/profile/" + this.state.auction.createdBy.username} block={true} variant="primary" size="lg">Посмотреть профиль</Button>
                                            </Row>
                                        </Container>
                                    ) : null
                                ) : null
                            }
                        </Container>
                        <Container className={"block"} style={{marginTop: "25px", marginLeft: "0px", paddingTop: "15px", paddingBottom: "15px"}}>
                            <Row className={"justify-content-center"}>
                                <div>
                                    <div className="countdown-title">{this.state.auctionText}</div>
                                    <div className="countdown">
                                        <span className="countdown-col">
                                          <span className="countdown-col-element">
                                            <strong className="countdown-col-element-number">{days}</strong>
                                            <span className="countdown-col-element-text">{days === 1 ? 'День' : 'Дней'}</span>
                                          </span>
                                        </span>

                                        <span className="countdown-col">
                                          <span className="countdown-col-element">
                                            <strong className="countdown-col-element-number">{hours}</strong>
                                            <span className="countdown-col-element-text">Часов</span>
                                          </span>
                                        </span>

                                        <span className="countdown-col">
                                          <span className="countdown-col-element">
                                            <strong className="countdown-col-element-number">{minutes}</strong>
                                            <span className="countdown-col-element-text">Минут</span>
                                          </span>
                                        </span>

                                        <span className="countdown-col">
                                          <span className="countdown-col-element">
                                            <strong className="countdown-col-element-number">{seconds}</strong>
                                            <span className="countdown-col-element-text">Секунд</span>
                                          </span>
                                        </span>
                                    </div>
                                </div>

                                {
                                    this.state.auction ?(
                                        !this.state.auction.freeze ?(
                                        this.props.currentUser && this.state.userBet !== this.props.currentUser.username ? (
                                            <div>
                                                <Row>
                                                    <Col sm={5} >
                                                        <div className="betLabel">Текущая ставка:</div>
                                                    </Col>
                                                    <Col sm={4}>
                                                        <div className="betPrice">{this.state.lowBet}₽</div>
                                                    </Col>
                                                </Row>
                                            </div>
                                        ) : (
                                            <div>
                                                <Col sm={5} >
                                                    <div className="betLabelLong">Текущая ставка(Ваша):</div>
                                                </Col>
                                                <Col sm={4}>
                                                    <div className="betPriceLong">{this.state.lowBet}₽</div>
                                                </Col>
                                            </div>
                                        )
                                        ) : (
                                            <div>
                                                <Col sm={5} >
                                                    <div className="betLabelLong">Аукцион продан за:</div>
                                                </Col>
                                                <Col sm={4}>
                                                    <div className="betPriceLong">{this.state.lowBet}₽</div>
                                                </Col>
                                            </div>
                                        )
                                    ) : null
                                }
                            </Row>

                            <Row style={{marginLeft: "2px", marginRight: "2px"}}>
                                <Col>
                                    {
                                        this.state.auction ? (
                                            this.props.currentUser && this.state.auction.createdBy.username !== this.props.currentUser.username ? (
                                                <Form.Label>Ставка</Form.Label>,
                                                    <Form.Control
                                                        className= "betInput"
                                                        size="lg"
                                                        type="text"
                                                        name="bet"
                                                        value={this.state.value}
                                                        onChange={this.handleChange}
                                                        placeholder="Введите ставку"
                                                    />
                                            ): null
                                        ) : null
                                    }
                                </Col>
                                <Col>
                                    {
                                        this.state.auction ? (
                                            this.props.currentUser && this.state.auction.createdBy.username !== this.props.currentUser.username ? (
                                                <Row className="auctionButton">
                                                    <Button disabled={this.state.auction.freeze} style={{padding: "0.45em 0.5em"}} block={true} variant="primary" size="l" onClick={() => this.handleCanstBet(this.state.bet)}>Сделать ставку</Button>
                                                </Row>
                                            ): null
                                        ) : null
                                    }
                                </Col>
                            </Row>
                            <Row className="justify-content-center">
                                {
                                    this.state.auction ? (
                                        this.props.currentUser && this.state.auction.createdBy.username !== this.props.currentUser.username ? (
                                            <Form>
                                                <div>
                                                    <Row className="auctionButton">
                                                        <Button disabled={this.state.auction.freeze} style={{paddingLeft: "1.7em", paddingRight: "1.7em"}} block={true} variant="primary" size="lg" onClick = {this.open}>Выкупить товар за {this.state.auction.endPrice + "₽"}</Button>
                                                    </Row>
                                                    <Modal show={this.state.showModal} onHide={this.close}>
                                                        <Modal.Header closeButton>
                                                            <Modal.Title>Выкуп аукциона</Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body>
                                                            <div>Вы готовы выкупить аукцион за {this.state.auction.endPrice + "₽"}?</div>
                                                        </Modal.Body>
                                                        <Modal.Footer>
                                                            <Button onClick={this.endsAuctionNow}>Да</Button>
                                                            <Button onClick={this.close}>Нет</Button>
                                                        </Modal.Footer>
                                                    </Modal>
                                                </div>
                                            </Form>
                                        ): null
                                    ) : null
                                }
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </Container>

        );
    }
}

export default Auction
