import React, {Component} from "react";
import {Badge, Button, ButtonGroup, Col, Container, Form, Row} from "react-bootstrap";
import {ACCESS_TOKEN, CATEGORY, CONDITION, USER_LIST_SIZE} from "../../constants";
import {
    banUser,
    changeAuthority, deleteBet, formatDate,
    getAuctionFullInfo,
    getItem,
    getUser,
    login,
    moderate, unfreeze,
    updateUser
} from "../../util/APIUtils";
import {toast} from "react-toastify";
import {isContainWhiteSpace, isEmail, isEmpty, isLength} from "../../util/validator";
import {Formik} from "formik";
import {VALIDATION_CHANGE_AUTHORITY_SCHEMA, VALIDATION_MODERATING_SCHEMA} from "../../model/auth/validatonShema";

class AuctionFullInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.loadAuction = this.loadAuction.bind(this);
        this.deleteBetInAuction = this.deleteBetInAuction.bind(this);
        this.unfreezeAuction = this.unfreezeAuction.bind(this);
    }


    deleteBetInAuction() {
        this.setState({
            isLoading: true
        });

        deleteBet(this.state.auction.bets[0].id)
            .then(response => {
                this.setState({
                    isLoading: false
                });
                toast.success(
                    "Подозрительная ставка удалена!",
                    {position: toast.POSITION.BOTTOM_LEFT}
                );
                setTimeout(() => {  window.location.reload(); }, 1500);
            }).catch(error => {
            if (error.status === 404) {
                this.setState({
                    notFound: true,
                    isLoading: false
                });
            } else {
                toast.error(
                    error.message || "Извините! Что-то пошло не так. Попробуйте еще раз!",
                    {position: toast.POSITION.BOTTOM_LEFT}
                )
                this.setState({
                    serverError: true,
                    isLoading: false
                });
            }
        });
    }

    unfreezeAuction() {
        this.setState({
            isLoading: true
        });

        unfreeze(this.state.auction.id)
            .then(response => {
                this.setState({
                    isLoading: false
                });
                toast.success(
                    "Аукцион разморожен!",
                    {position: toast.POSITION.BOTTOM_LEFT}
                );
                setTimeout(() => {  window.location.reload(); }, 1500);
            }).catch(error => {
            if (error.status === 404) {
                this.setState({
                    notFound: true,
                    isLoading: false
                });
            } else {
                toast.error(
                    error.message || "Извините! Что-то пошло не так. Попробуйте еще раз!",
                    {position: toast.POSITION.BOTTOM_LEFT}
                )
                this.setState({
                    serverError: true,
                    isLoading: false
                });
            }
        });
    }

    loadAuction(auctionId) {
        this.setState({
            isLoading: true
        });

        getAuctionFullInfo(auctionId)
            .then(response => {
                this.setState({
                    auction: response,
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
        console.log(this.props.auctionId)
        const itemId = this.props.auctionId;
        this.loadAuction(itemId);
    }

    componentDidUpdate(nextProps) {
        if(this.props.auctionId !== nextProps.auctionId) {
            this.loadAuction(nextProps.auctionId);
        }
    }

    render() {
        return (
            <Container>
                <Container className="user-info block">
                    <h4>
                        <Badge variant="secondary">Информация о аукционе</Badge>
                    </h4>
                    {
                        this.state.auction ? (
                            <Form>
                                <Form.Group as={Row} controlId="formPlaintextPassword">
                                    <Form.Label column sm="2">
                                        Название
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control plaintext readOnly defaultValue={this.state.auction.name}/>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} controlId="formPlaintextPassword">
                                    <Form.Label column sm="2">
                                        Категория
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control plaintext readOnly defaultValue={CATEGORY[this.state.auction.category]}/>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} controlId="formPlaintextPassword">
                                    <Form.Label column sm="2">
                                        Состояние
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control plaintext readOnly defaultValue={CONDITION[this.state.auction.condition]}/>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} controlId="formPlaintextPassword">
                                    <Form.Label column sm="2">
                                        Описание
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control  as="textarea" rows={3} readOnly defaultValue={this.state.auction.description}/>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} controlId="formPlaintextPassword">
                                    <Form.Label column sm="2">
                                        Начальная цена
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control plaintext readOnly defaultValue={this.state.auction.minPrice + " ₽"}/>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} controlId="formPlaintextPassword">
                                    <Form.Label column sm="2">
                                        Цена выкупа
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control plaintext readOnly defaultValue={this.state.auction.endPrice + " ₽"}/>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} controlId="formPlaintextPassword">
                                    <Form.Label column sm="2">
                                        Время создания
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control plaintext readOnly defaultValue={formatDate(this.state.auction.creationDateTime)}/>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} controlId="formPlaintextPassword">
                                    <Form.Label column sm="2">
                                        Время окончания
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control plaintext readOnly defaultValue={formatDate(this.state.auction.expirationDateTime)}/>
                                    </Col>
                                </Form.Group>
                                <h5>
                                    <Badge variant="secondary">Создан</Badge>
                                </h5>
                                <Form.Group as={Row} controlId="formPlaintextPassword">
                                    <Form.Label column sm="2">
                                        Никнейм
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control plaintext readOnly defaultValue={this.state.auction.createdBy.username}/>
                                    </Col>
                                </Form.Group>
                            </Form>
                        ) : null
                    }
                </Container>
                {
                    this.state.auction && this.state.auction.freeze && this.state.auction.bets.length? (
                        <Container className={"unfreeze block"}>
                            <div>
                                <h4>
                                    <Badge variant="secondary">Модерация</Badge>
                                </h4>
                                <div>
                                    <h5>
                                        <Badge variant="secondary">Подозрительная ставка</Badge>
                                    </h5>
                                    <Form.Group as={Row} controlId="formPlaintextPassword">
                                        <Form.Label column sm="2">
                                            Номер ставки
                                        </Form.Label>
                                        <Col sm="10">
                                            <Form.Control plaintext readOnly defaultValue={this.state.auction.bets[0].id}/>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} controlId="formPlaintextPassword">
                                        <Form.Label column sm="2">
                                            Сумма ставки
                                        </Form.Label>
                                        <Col sm="10">
                                            <Form.Control plaintext readOnly defaultValue={this.state.auction.bets[0].price + " ₽"}/>
                                        </Col>
                                    </Form.Group>
                                    <h5>
                                        <Badge variant="secondary">Поставил</Badge>
                                    </h5>
                                    <Form.Group as={Row} controlId="formPlaintextPassword">
                                        <Form.Label column sm="2">
                                            Никнейм
                                        </Form.Label>
                                        <Col sm="10">
                                            <Form.Control plaintext readOnly defaultValue={this.state.auction.bets[0].createdBy.username}/>
                                        </Col>
                                    </Form.Group>
                                </div>
                                <h5>
                                    <Badge variant="secondary">Действие</Badge>
                                </h5>
                                <Container>
                                    <Row style={{marginTop: 20}}>
                                        <ButtonGroup className="mb-2">
                                            <Button onClick={this.deleteBetInAuction}>Удалить ставку</Button>
                                            <Button onClick={this.unfreezeAuction}>Разморозить аукцион</Button>
                                        </ButtonGroup>
                                    </Row>
                                </Container>
                            </div>
                        </Container>
                    ) : null
                }

                <Container className={"moderating block"}>
                    <Formik
                        initialValues={{isApproved: true, comment: ""}}
                        validationSchema={VALIDATION_MODERATING_SCHEMA}
                        onSubmit={(values, {setSubmitting, resetForm}) => {
                            /*  // When button submits form and form is in the process of submitting, submit button is disabled
                              setSubmitting(true);*/

                            moderate(this.state.auction.id, values, "auctions")
                                .then(response => {
                                    toast.success(
                                        "Объявление просмотрено!",
                                        {position: toast.POSITION.BOTTOM_LEFT}
                                    )
                                    setTimeout(() => {  window.location.reload(); }, 1500);
                                }).catch(error => {
                                toast.error(
                                    error.message || 'Что-то пошло не так. Попробуйте еще раз!',
                                    {position: toast.POSITION.BOTTOM_LEFT}
                                )
                                console.log(error.message || 'Что-то пошло не так. Попробуйте еще раз!')
                            });
                        }}
                    >
                        {({
                              values,
                              errors,
                              touched,
                              handleChange,
                              handleBlur,
                              handleSubmit,
                              isSubmitting
                          }) => (
                            <div>
                                <h4>
                                    <Badge variant="secondary">Модерация</Badge>
                                </h4>
                                <Form style={{width: "50%", justifyContent: "center"}}
                                      onSubmit={handleSubmit}>
                                    <Form.Group controlId="exampleForm.ControlSelect1" style={{marginTop:"1em"}}>
                                        <Form.Control as="select"
                                                      defaultValue={1}
                                                      name="isApproved"
                                                      onChange={handleChange}

                                                      onBlur={handleBlur}
                                                      value={values.authority}
                                        >
                                            <option value={true}>Одобрить</option>
                                            <option value={false}>Запретить</option>
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group controlId="exampleForm.ControlTextarea1">
                                        <Form.Label>Комментарий</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            name="comment"
                                            onBlur={handleBlur}
                                            value={values.comment}
                                            onChange={handleChange}
                                            rows={3}
                                        />
                                    </Form.Group>
                                    <Button variant="primary" type="submit">
                                        Сохранить
                                    </Button>
                                </Form>
                            </div>
                        )}
                    </Formik>
                </Container>
            </Container>
        )
    }
}

export default AuctionFullInfo;
