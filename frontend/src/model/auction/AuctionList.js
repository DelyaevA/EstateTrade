import React, {Component} from 'react';
import '../item/ItemList.css'
import {run as runHolder} from 'holderjs/holder';
import {Alert, Button, Card, CardColumns, CardDeck, Col, Container, Form, Row} from "react-bootstrap";
import {BASE_AUCTION_PICTURE_PATH, LIST_SIZE} from "../../constants";
import {
    getAllAuctions,
    getAllItems, getAuctionsByQuery,
    getItemsByQuery,
    getUserCreatedAuctions,
    getUserCreatedItems, getUserFCreatedAuctions
} from "../../util/APIUtils";
import {Link} from "react-router-dom";
import defItemImg from "../../img/noImage.png";

class AuctionList extends Component {
    constructor() {
        super();
        this.state = {
            auctions: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            currentVotes: [],
            isLoading: false
        };
        this.runHolder = runHolder;
        this.loadAuctionList = this.loadAuctionList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
    }

    loadAuctionList(page = 0, size = LIST_SIZE) {
        let promise;

        if (this.props.isAuthenticated || this.props.currentUser) {
            if (this.props.type === 'MY_CREATED_AUCTIONS') {
                promise = getUserCreatedAuctions(this.props.currentUser.username, page, size);
            }
            if (this.props.type === 'USER_CREATED_AUCTIONS') {
                promise = getUserFCreatedAuctions(this.props.currentUser.username, page, size);
            }
        } else {
            if (this.props.searchOptions) {
                promise = getAuctionsByQuery(this.props.searchOptions, page, size);
            } else {
                promise = getAllAuctions(page, size);
            }
        }
        if (!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });

        promise
            .then(response => {
                const auctions = this.state.auctions.slice();
                const currentVotes = this.state.currentVotes.slice();

                this.setState({
                    auctions: auctions.concat(response.content),
                    page: response.page,
                    size: response.size,
                    totalElements: response.totalElements,
                    totalPages: response.totalPages,
                    last: response.last,
                    currentVotes: currentVotes.concat(Array(response.content.length).fill(null)),
                    isLoading: false
                })
            }).catch(error => {
            this.setState({
                isLoading: false
            })
        });

    }

    handleLoadMore() {
        this.loadAuctionList(this.state.page + 1);
    }


    componentDidMount() {
        this.runHolder();
        this.loadAuctionList();
    }

    componentDidUpdate(nextProps) {
        if (this.props.isAuthenticated !== nextProps.isAuthenticated ||
            this.props.type !== nextProps.type ||
            (this.props.type === "OFFERS_BY_SEARCH_PARAMS" && (this.props.searchOptions !== nextProps.searchOptions))) {
            // Reset State
            this.setState({
                auctions: [],
                page: 0,
                size: 10,
                totalElements: 0,
                totalPages: 0,
                last: true,
                currentVotes: [],
                isLoading: false
            });
            this.loadAuctionList();
        }
    }


    render() {
        function declOfNum(n, text_forms) {
            n = Math.abs(n) % 100;
            var n1 = n % 10;
            if (n > 10 && n < 20) {
                return text_forms[2];
            }
            if (n1 > 1 && n1 < 5) {
                return text_forms[1];
            }
            if (n1 == 1) {
                return text_forms[0];
            }
            return text_forms[2];
        }

        const auctionViews = [];
        this.state.auctions.forEach((auction, auctionIndex) => {
            let currentTime = new Date();
            let creationTime = new Date(`${auction.creationDateTime}`);
            let strTimeAgo = ""
            let timeAgo = currentTime.getDate() - creationTime.getDate();
            if (timeAgo === 0) {
                timeAgo = currentTime.getHours() - creationTime.getHours();
                if (timeAgo === 0) {
                    timeAgo = currentTime.getMinutes() - creationTime.getMinutes();
                    strTimeAgo = timeAgo + " " + declOfNum(timeAgo, ["минуту", "минуты", "минут"])
                } else {
                    strTimeAgo = timeAgo + " " + declOfNum(timeAgo, ["час", "часа", "часов"])
                }
            } else {
                strTimeAgo = timeAgo + " " + declOfNum(timeAgo, ["день", "дня", "дней"])
            }

            let isModerated = !auction.isModerated ? (<Alert variant="info">
                <Alert.Heading>Проверяется администратором</Alert.Heading>
            </Alert>) : null

            auctionViews.push(
                <Card>
                    {isModerated}
                    {
                        auction.picturesLinks.length ? (
                            <Card.Img variant="top" src={BASE_AUCTION_PICTURE_PATH + auction.id + "/" + auction.picturesLinks[0]}/>
                        ) : (
                            <Card.Img variant="top" src={defItemImg}/>
                        )
                    }

                    <Card.Body>
                        <Card.Title>{auction.name}</Card.Title>
                        <Card.Text>{auction.endPrice} ₽</Card.Text>
                        <Button as={Link} variant="primary" className="stretched-link" to={"/auctions/" + auction.id}>Перейти
                            к аукциону</Button>
                    </Card.Body>
                    <Card.Footer>
                        <small className="text-muted">{strTimeAgo} назад</small>
                    </Card.Footer>
                </Card>)
        });
        return (
            <div className="my-auctions">

                <CardColumns>
                    {auctionViews}
                </CardColumns>

                {
                    !this.state.isLoading && this.state.auctions.length === 0 && this.props.currentUser && this.props.type === "MY_CREATED_AUCTIONS" ? (
                        <div className="no-polls-found">
                            <Alert variant="info">
                                <Alert.Heading>Аукционы</Alert.Heading>
                                <p>
                                    У вас нет ни одного активного аукциона
                                </p>
                            </Alert>
                        </div>
                    ) : null
                }

                {
                    !this.state.isLoading && this.state.auctions.length === 0 && this.props.currentUser && this.props.type === "USER_CREATED_AUCTIONS" ? (
                        <div className="no-polls-found">
                            <Alert variant="info">
                                <Alert.Heading>Аукционы</Alert.Heading>
                                <p>
                                   Нет ни одного активного аукциона
                                </p>
                            </Alert>
                        </div>
                    ) : null
                }

                {
                    !this.state.isLoading && this.state.auctions.length === 0 && !this.props.currentUser? (
                        <div className="no-polls-found">
                            <Alert variant="info">
                                <Alert.Heading>Аукционы</Alert.Heading>
                                <p>
                                    Нет активных аукционов в данной категории
                                </p>
                            </Alert>
                        </div>
                    ) : null
                }

                {
                    !this.state.isLoading && !this.state.last ? (
                        <Row className="load-more-polls justify-content-md-center" >
                            <Button type="dashed" onClick={this.handleLoadMore} disabled={this.state.isLoading}>
                                Загрузить больше
                            </Button>
                        </Row>) : null
                }

                {
                    this.state.isLoading ?
                        <div>loading</div> : null
                }
            </div>
        )
    }
}

export default AuctionList;
