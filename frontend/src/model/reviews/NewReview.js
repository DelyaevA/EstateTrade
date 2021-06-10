import React, {Component} from "react";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {Formik} from "formik";
import {VALIDATION_NEW_ITEM, VALIDATION_NEW_REVIEW} from "../auth/validatonShema";
import {createItem, createReview, getItem, getReview, updateReview} from "../../util/APIUtils";
import {toast} from "react-toastify";

class NewReview extends Component {
    constructor() {
        super();
        this.state = {
            review: null,
            score: null,
            sreview: null,
        };
        this.loadReview = this.loadReview.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    loadReview(userId) {
        this.setState({
            isLoading: true
        });

        getReview(userId)
            .then(response => {
                this.setState({
                    review: response,
                    score: response.score,
                    sreview: response.review,
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

    handleChange(e) {
        const type = e.target.name;
        const value = e.target.value;
        this.setState({
            [type]: value
        })
        this.props.handleChange(type, value);
    }

    componentDidMount() {
        const username = this.props.username;
        this.loadReview(username);
    }

    componentDidUpdate(nextProps) {
        if(this.props.username !== nextProps.username) {
            this.loadReview(nextProps.username);
        }
    }

    render() {
        return (
            <Container>
                <Row className="justify-content-center">
                    <Form
                        style={{width:"75%", marginTop: 15, justifyContent:"center"}}>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label><b>Оценка</b></Form.Label>
                            <Form.Control as="select" name="score" value={this.state.score} onChange={this.handleChange}>
                                <option value="5">5</option>
                                <option value="4">4</option>
                                <option value="3">3</option>
                                <option value="2">2</option>
                                <option value="1">1</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Label><b>Отзыв</b></Form.Label>
                            <Form.Control
                                as="textarea"
                                name="sreview"
                                value={this.state.sreview}
                                onChange={this.handleChange}
                                rows={3}
                            />
                        </Form.Group>
                    </Form>
                </Row>
            </Container>
        )
    }
}

export default NewReview;
