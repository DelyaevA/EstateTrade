import React, {Component} from "react";
import {getItem, getReviews} from "../../util/APIUtils";
import {Badge, Button, Card, CardColumns, Col, Container, Form, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import "./Reviews.css";
import StarRatingComponent from 'react-star-rating-component';

class Review extends Component {
    constructor() {
        super();
        this.state = {
            reviewed: null,
            avgScore: null,
            reviews: []
        }
        this.loadReviews = this.loadReviews.bind(this);
    }
    loadReviews(username) {
        this.setState({
            isLoading: true
        });

        getReviews(username)
            .then(response => {
                this.setState({
                    reviewed: response.reviewed,
                    reviews: response.reviews,
                    avgScore: response.avgScore,
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

    createReview() {

    }

    componentDidMount() {
        const username = this.props.username;
        this.loadReviews(username);
    }

    componentDidUpdate(nextProps) {
        if(this.props.username !== nextProps.username) {
            this.loadReviews(nextProps.username);
        }
    }
    render() {
        const { rating } = this.state;
        const reviews = [];
        this.state.reviews.forEach((review, reviewIndex) => {
            reviews.push(
                <Card>
                    <Card.Body>
                        <Card.Title>@{review.creator.username}</Card.Title>
                        {
                            review.review ? (
                                <Card.Text>{review.review}</Card.Text>
                            ) : (
                                <Card.Text>Нет комментария</Card.Text>
                            )
                        }
                    </Card.Body>
                    <Card.Footer>
                        <small className="text-muted">Оценка:
                            <StarRatingComponent className={"small_star-rating"}
                            name="rating"
                            editing={false}
                            starCount={5}
                            value={review.score}
                        /></small>
                    </Card.Footer>
                </Card>)
        });
        return (
            <Container className={"reviews"} style={{marginTop: 20}}>
                    {
                        this.state.reviewed ? (
                            <h4>
                                <Badge variant="secondary">Отзывы о пользователе @{this.state.reviewed.username}</Badge>
                                <Button className="review_button" style={{marginTop: "15px", padding: "0.4em 0.3em !important"}} variant="info" size="l" onClick={()=>{this.props.modalcallback()}}>Оставить отзыв</Button>
                            </h4>
                        ) : null
                    }
                    {
                        this.state.avgScore >= 0? (
                            <h5>Средняя оценка:
                                <StarRatingComponent className={"big_star-rating"}
                                    name="rating"
                                    editing={false}
                                    starCount={5}
                                    value={this.state.avgScore}
                                />
                                </h5>
                        ) : null
                    }
                    <CardColumns style={{columnCount: 1, marginTop: 15}}>
                        {
                            reviews
                        }
                        {
                            reviews.length === 0 ? (
                                <div>
                                    Нет отзывов на пользователя
                                </div>
                            ) : null
                        }
                    </CardColumns>

            </Container>
        )
    }
}

export default Review;
