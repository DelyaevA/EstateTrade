import React, {Component} from 'react';
import './ItemList.css'
import {run as runHolder} from 'holderjs/holder';
import {Alert, Button, Card, CardColumns, CardDeck, Col, Container, Form, Row} from "react-bootstrap";
import {BASE_PICTURE_PATH, LIST_SIZE} from "../../constants";
import {
    getAllItems,
    deleteItem,
    deleteUser,
    getItemsByQuery,
    getUserCreatedItems,
    getUserFCreatedItems
} from "../../util/APIUtils";
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import defItemImg from '../../img/noImage.png'

class ItemList extends Component {
    constructor() {
        super();
        this.state = {
            items: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            currentVotes: [],
            isLoading: false
        };
        this.runHolder = runHolder;
        this.loadItemList = this.loadItemList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
        this.deleteItm = this.deleteItm.bind(this);
    }

    loadItemList(page = 0, size = LIST_SIZE) {
        let promise;

        if (this.props.isAuthenticated || this.props.currentUser) {
            if (this.props.type === 'MY_CREATED_ITEMS') {
                promise = getUserCreatedItems(this.props.currentUser.username, page, size);
            }
            if (this.props.type === 'USER_CREATED_ITEMS') {
                promise = getUserFCreatedItems(this.props.currentUser.username, page, size);
            }
        } else {
            if (this.props.searchOptions) {
                promise = getItemsByQuery(this.props.searchOptions, page, size);
            } else {
                promise = getAllItems(page, size);
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
                const items = this.state.items.slice();
                const currentVotes = this.state.currentVotes.slice();

                this.setState({
                    items: items.concat(response.content),
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

    deleteItm() {
        this.setState({
            isLoading: true
        });

        deleteItem(this.props.item.id)
            .then(response => {
                this.setState({
                    isLoading: false
                });
                toast.success(
                    "Объявление было успешно удалено!",
                    {position: toast.POSITION.BOTTOM_LEFT}
                );
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

    handleLoadMore() {
        this.loadItemList(this.state.page + 1);
    }


    componentDidMount() {
        this.runHolder();
        this.loadItemList();
    }

    componentDidUpdate(nextProps) {
        if (this.props.isAuthenticated !== nextProps.isAuthenticated ||
            this.props.type !== nextProps.type ||
            (this.props.type === "OFFERS_BY_SEARCH_PARAMS" && (this.props.searchOptions !== nextProps.searchOptions))) {
            // Reset State
            this.setState({
                items: [],
                page: 0,
                size: 10,
                totalElements: 0,
                totalPages: 0,
                last: true,
                currentVotes: [],
                isLoading: false
            });
            this.loadItemList();
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

        const itemViews = [];
        this.state.items.forEach((item, itemIndex) => {
            let currentTime = new Date();
            let creationTime = new Date(`${item.creationDateTime}`);
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

            let isModerated = !item.isModerated ? (<Alert variant="info">
                <Alert.Heading>Проверяется администратором</Alert.Heading>
            </Alert>) : null

            //TODO: Доделать дефолтную картинку
            itemViews.push(
                <Card>
                    {isModerated}
                    {
                        item.picturesLinks.length ? (
                            <Card.Img variant="top" src={BASE_PICTURE_PATH + item.id + "/" + item.picturesLinks[0]}/>
                        ) : (
                            <Card.Img variant="top" src={defItemImg}/>
                        )
                    }

                    <Card.Body>
                        <Card.Title>{item.name}</Card.Title>
                        <Card.Text>{item.price} ₽</Card.Text>
                        <Button as={Link} variant="primary" className="stretched-link" to={"/items/" + item.id}>Перейти
                            к товару</Button>
                        {/*<Button style={{marginLeft: 10}} onClick={this.deleteItm}>delete item</Button>*/}
                    </Card.Body>
                    <Card.Footer>
                        <small className="text-muted">{strTimeAgo} назад</small>
                    </Card.Footer>
                </Card>)
        });
        return (
            <div className="my-items">

                <CardColumns>
                    {itemViews}
                </CardColumns>

                {
                    !this.state.isLoading && this.state.items.length === 0 && this.props.currentUser && this.props.type === "MY_CREATED_AUCTIONS" ? (
                        <div className="no-items-found">
                            <Alert variant="success">
                                <Alert.Heading>Объявления</Alert.Heading>
                                <p>
                                    У вас нет ни одного активного объявления
                                </p>
                            </Alert>
                        </div>
                    ) : null
                }

                {
                    !this.state.isLoading && this.state.items.length === 0 && this.props.currentUser && this.props.type === "USER_CREATED_AUCTIONS" ? (
                        <div className="no-items-found">
                            <Alert variant="success">
                                <Alert.Heading>Объявления</Alert.Heading>
                                <p>
                                    Нет ни одного активного объявления
                                </p>
                            </Alert>
                        </div>
                    ) : null
                }

                {
                    !this.state.isLoading && this.state.items.length === 0 && !this.props.currentUser? (
                        <div className="no-items-found">
                            <Alert variant="success">
                                <Alert.Heading>Объявления</Alert.Heading>
                                <p>
                                    Нет активных объявлений в данной категории
                                </p>
                            </Alert>
                        </div>
                    ) : null
                }

                {
                    !this.state.isLoading && !this.state.last ? (
                        <Row className="load-more-items justify-content-md-center" >
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

export default ItemList;
