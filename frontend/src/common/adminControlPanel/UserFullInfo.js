import React, {Component, useState} from "react";
import {Badge, Button, ButtonGroup, Col, Container, Form, ListGroup, Row} from "react-bootstrap";
import {ACCESS_TOKEN, CATEGORY_REPORTS, CATEGORY_REPORTS_USER, USER_LIST_SIZE} from "../../constants";
import {
    banUser, changeAuthority,
    deleteUser, getAllReportsByUserId,
    getUser, getUserFullI,
    login,
    makeAdmin,
    resetPasswordByAdmin, unbanUser,
    updateUser,
    updateUserByAdmin
} from "../../util/APIUtils";
import {toast} from "react-toastify";
import {isContainWhiteSpace, isEmail, isEmpty, isLength} from "../../util/validator";
import {Formik} from "formik";
import {
    VALIDATION_CHANGE_AUTHORITY_SCHEMA,
    VALIDATION_LOGIN_SCHEMA,
    VALIDATION_RESET_PASSWORD_SCHEMA,
    VALIDATION_UPDATE_SCHEMA
} from "../../model/auth/validatonShema";
import Modal from "react-bootstrap/Modal";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

class UserFullInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reports: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            show: false,
            action: null,
        }
        this.loadUser = this.loadUser.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSuccessClose = this.handleSuccessClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.ban = this.ban.bind(this);
        this.deleteUsr = this.deleteUsr.bind(this);
        this.unban = this.unban.bind(this);
    }


    loadUser(username) {
        this.setState({
            isLoading: true
        });

        getUserFullI(username)
            .then(response => {
                this.setState({
                    user: response,
                    reports: response.reports,
                    formData: {
                        username: response.username
                    },
                    isLoading: false
                });
            }).catch(error => {
            if (error.status === 404) {
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
        console.log(this.props.currentUser)
        const username = this.props.username;
        this.loadUser(username);
    }

    componentDidUpdate(nextProps) {
        if (this.props.username !== nextProps.username) {
            this.loadUser(nextProps.username);
        }
    }

    ban() {
        this.setState({
            isLoading: true
        });

        banUser(this.props.username)
            .then(response => {
                this.setState({
                    isLoading: false
                });
                toast.success(
                    "Пользователь забанен!",
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

    unban() {
        this.setState({
            isLoading: true
        });

        unbanUser(this.props.username)
            .then(response => {
                this.setState({
                    isLoading: false
                });
                toast.success(
                    "Пользователь разбанен!",
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


    deleteUsr() {
        this.setState({
            isLoading: true
        });

        deleteUser(this.props.username)
            .then(response => {
                this.setState({
                    isLoading: false
                });
                toast.success(
                    "Пользователь успешно удален!",
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


    handleClose() {
        this.setState({
            show: false,
            action: null
        });
    }

    handleSuccessClose() {
        switch (this.state.action) {
            case 'ban':
                this.ban()
                break;
            case 'deleteUser':
                this.deleteUsr()
                break;
            case 'unban':
                this.unban()
                break;
            default:
                break
        }
        this.setState({
            show: false,
            action: null
        })
    }

    handleShow(e) {
        this.setState({
            action: e.target.value,
            show: true
        })
    }

    render() {
        const products = [];
        const columns = [{
            dataField: 'description',
            text: 'Описание',
            sort: true
        }, {
            dataField: 'category',
            text: 'Категория',
            sort: true
        }];
        this.state.reports.forEach((report, reportIndex) => {
            products.push({
                description: report.description,
                category: CATEGORY_REPORTS_USER[report.category],
            })
        });
        const handleClose = () => this.setState({
            show: false
        });
        const handleCloseBanned = () => this.setState({
            show: false
        });
        const handleShow = () => this.setState({
            show: true
        });
        return (
            <Container>
                <Container className="user-info block">
                    <h4>
                        <Badge variant="secondary">Информация о пользователе</Badge>
                    </h4>
                    {
                        this.state.user ? (
                            <Form>
                                <Form.Group as={Row} controlId="formPlaintextPassword">
                                    <Form.Label column sm="2">
                                        Никнейм
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control plaintext readOnly defaultValue={this.state.user.username}/>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} controlId="formPlaintextEmail">
                                    <Form.Label column sm="2">
                                        Email
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control plaintext readOnly defaultValue={this.state.user.email}/>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} controlId="formPlaintextEmail">
                                    <Form.Label column sm="2">
                                        Бан
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control plaintext readOnly defaultValue={this.state.user.banned ? "Есть" : "Отсутствует"}/>
                                    </Col>
                                </Form.Group>
                            </Form>
                        ) : (
                            <h1>Пользователь не найден</h1>
                        )
                    }

                </Container>
                {
                    this.state.user ? (
                        <div>
                            <Container className={"change-authority block"}>
                                <Formik
                                    initialValues={{authority: "ROLE_USER"}}
                                    validationSchema={VALIDATION_CHANGE_AUTHORITY_SCHEMA}
                                    onSubmit={(values, {setSubmitting, resetForm}) => {
                                        /*  // When button submits form and form is in the process of submitting, submit button is disabled
                                          setSubmitting(true);*/
                                        changeAuthority(this.state.user.username, values)
                                            .then(response => {
                                                toast.success(
                                                    "Роль успешна изменена!",
                                                    {position: toast.POSITION.BOTTOM_LEFT}
                                                )
                                                setTimeout(() => {  window.location.reload(); }, 3000);
                                            }).catch(error => {
                                            toast.error(
                                                error.message || 'Что-то пошло не так. Попробуйте еще раз!',
                                                {position: toast.POSITION.BOTTOM_LEFT}
                                            )
                                            console.log(error.message || 'Sorry! Something went wrong. Please try again!')
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
                                                <Badge variant="secondary">Изменить роль</Badge>
                                            </h4>
                                            <Form style={{width: "50%", justifyContent: "center"}}
                                                  onSubmit={handleSubmit}>

                                                <Form.Group controlId="exampleForm.ControlSelect1" style={{marginTop:"1em"}}>
                                                    <Form.Control as="select"
                                                                  defaultValue="USER"
                                                                  name="authority"
                                                                  onChange={handleChange}

                                                                  onBlur={handleBlur}
                                                                  value={values.authority}
                                                    >
                                                        <option value="ROLE_USER">Пользователь</option>
                                                        <option value="ROLE_ADMIN">Админ</option>
                                                    </Form.Control>
                                                </Form.Group>
                                                <Button variant="primary" type="submit">
                                                    Сохранить
                                                </Button>
                                            </Form>
                                        </div>
                                    )}
                                </Formik>
                            </Container>
                            {/*
                            <Container className="reset-password block">
                                <Formik
                                    initialValues={{password: ""}}
                                    validationSchema={VALIDATION_RESET_PASSWORD_SCHEMA}
                                    onSubmit={(values, {setSubmitting, resetForm}) => {
                                        console.log(values)
                                        resetPasswordByAdmin(this.state.user.username, values)
                                            .then(response => {
                                                toast.success(
                                                    "Пароль успешно изменен!",
                                                    {position: toast.POSITION.BOTTOM_LEFT}
                                                )
                                            }).catch(error => {
                                            toast.error(
                                                error.message || 'Что-то пошло не так. Попробуйте еще раз!',
                                                {position: toast.POSITION.BOTTOM_LEFT}
                                            )
                                            console.log(error.message || 'Sorry! Something went wrong. Please try again!')
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
                                        <div style={{marginTop: "20px"}}>
                                            <h4>
                                                <Badge variant="secondary">Сменить пароль</Badge>
                                            </h4>
                                            <Form style={{width: "50%", justifyContent: "center"}} onSubmit={handleSubmit}>

                                                <Form.Group controlId="formBasicPassword" style={{marginTop:"1em"}}>
                                                    <Form.Control type="password"
                                                                  placeholder="Введите пароль"
                                                                  name="password"
                                                                  onChange={handleChange}
                                                                  onBlur={handleBlur}
                                                                  value={values.password}
                                                                  className={touched.password && errors.password ? "has-error" : null}
                                                    />
                                                    {touched.password && errors.password ? (
                                                        <div className="error-message">{errors.password}</div>
                                                    ) : null}
                                                </Form.Group>
                                                <Button variant="primary" type="submit">
                                                    Сохранить
                                                </Button>
                                            </Form>
                                        </div>
                                    )}
                                </Formik>
                            </Container>
                            */}
                            <div style={{marginTop: '20px', paddingTop: '15px', paddingBottom: '15px'}} className={"table-items block"}>
                                <h4>
                                    <Badge variant="secondary">Жалобы</Badge>
                                </h4>
                                <BootstrapTable keyField='id' data={ products } columns={ columns } pagination={ paginationFactory() } />
                            </div>
                            <Container className="admin-functions">
                                <Container>
                                    <Row style={{marginTop: 20}}>
                                        <ButtonGroup className="mb-2">
                                            {
                                                this.state.user && this.state.user.banned ? (
                                                    <Button onClick={this.handleShow} value="unban" variant="danger">Разбанить пользователя</Button>
                                                ) : (
                                                    <Button onClick={this.handleShow} value="ban" variant="danger">Забанить пользователя</Button>
                                                )
                                            }
                                            <Button style={{marginLeft: 10}} onClick={this.handleShow} value="deleteUser" variant="danger">Удалить пользователя</Button>
                                        </ButtonGroup>
                                    </Row>
                                </Container>
                            </Container>
                        </div>

                    ) : null
                }

                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Подтвержение действия: Бан</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Вы действительно хотите продолжить?</Modal.Body>
                    <Modal.Footer>
                        <Button name="yes" variant="primary" onClick={this.handleSuccessClose}>
                            Продолжить
                        </Button>
                        <Button name="no" variant="secondary" onClick={this.handleClose}>
                            Отмена
                        </Button>
                    </Modal.Footer>
                </Modal>

            </Container>
        )
    }
}

export default UserFullInfo;
