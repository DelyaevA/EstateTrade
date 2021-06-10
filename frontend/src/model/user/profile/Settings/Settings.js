import React, {Component} from "react";
import {Badge, Button, Col, Container, Form, Row} from "react-bootstrap";
import {Formik} from "formik";
import {
    VALIDATION_CHANGE_PASSWORD,
    VALIDATION_SIGNUP_SCHEMA,
    VALIDATION_UPLOAD_AVATAR_SCHEMA
} from "../../../auth/validatonShema";
import {changePassword, getUser, setAvatar, signup} from "../../../../util/APIUtils";
import {toast} from "react-toastify";

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.loadUser = this.loadUser.bind(this);
    }

    loadUser(username) {
        this.setState({
            isLoading: true
        });

        getUser(username)
            .then(response => {
                this.setState({
                    user: response,
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
        const username = this.props.currentUser.username;
        this.loadUser(username);
    }

    componentDidUpdate(nextProps) {
        if (this.props.currentUser.username !== nextProps.currentUser.username) {
            this.loadUser(nextProps.currentUser.username);
        }
    }


    render() {
        return (
            <div className="profile-settings">
                <Container className="profile-avatar">
                    <Formik
                        initialValues={{file: null}}
                        validationSchema={VALIDATION_UPLOAD_AVATAR_SCHEMA}
                        onSubmit={(values, {setSubmitting, resetForm}) => {
                            setAvatar(values)
                                .then(response => {
                                    console.log("Thank you! You're successfully registered. Please Login to continue!");
                                    window.location.reload();
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
                              setFieldValue,
                              isSubmitting
                          }) => (
                            <div className="justify-content-center">
                                <h4>
                                    <Badge variant="secondary">Изменить фото профиля</Badge>
                                </h4>
                                <Form style={{width: "50%", marginTop: "20px", justifyContent: "center"}}
                                      onSubmit={handleSubmit}>

                                    <Form.Group>
                                        <Form.File
                                            className="position-relative"
                                            required
                                            name="file"
                                            label="Фото профиля"
                                            accept="image/*"
                                            onChange={(event) => {
                                                setFieldValue("file", event.currentTarget.files[0], ".jpg,.xlsx");
                                            }}
                                            isInvalid={!!errors.file}
                                            feedback={errors.file}
                                            id="validationFormik107"
                                            feedbackTooltip
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
                <Container className="user-info" style={{marginTop:"1em"}}>
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

                            </Form>
                        ) : null
                    }
                </Container>
                <Container className="change-password" style={{marginTop: "20px"}}>
                    <Formik
                        initialValues={{oldPassword: "", newPassword: "", confirmPassword: ""}}
                        validationSchema={VALIDATION_CHANGE_PASSWORD}
                        onSubmit={(values, {setSubmitting, resetForm}) => {
                            /*  // When button submits form and form is in the process of submitting, submit button is disabled
                              setSubmitting(true);*/

                            changePassword(values)
                                .then(response => {
                                    console.log("Thank you! You're successfully registered. Please Login to continue!");
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
                            <div className="justify-content-center">
                                <h4>
                                    <Badge variant="secondary">Сменить пароль</Badge>
                                </h4>
                                <Form style={{width: "50%", marginTop: "20px", justifyContent: "center"}}
                                      onSubmit={handleSubmit}>

                                    <Form.Group controlId="formBasicPassword">
                                        <Form.Label>Старый пароль</Form.Label>
                                        <Form.Control type="password"
                                                      placeholder="Введите старый пароль"
                                                      name="oldPassword"
                                                      onChange={handleChange}
                                                      onBlur={handleBlur}
                                                      value={values.password}
                                                      className={touched.oldPassword && errors.oldPassword ? "has-error" : null}
                                        />
                                        {touched.oldPassword && errors.oldPassword ? (
                                            <div className="error-message">{errors.oldPassword}</div>
                                        ) : null}
                                    </Form.Group>

                                    <Form.Group controlId="formBasicPassword">
                                        <Form.Label>Новый пароль</Form.Label>
                                        <Form.Control type="password"
                                                      placeholder="Введите новый пароль"
                                                      name="newPassword"
                                                      onChange={handleChange}
                                                      onBlur={handleBlur}
                                                      value={values.password}
                                                      className={touched.newPassword && errors.newPassword ? "has-error" : null}
                                        />
                                        {touched.newPassword && errors.newPassword ? (
                                            <div className="error-message">{errors.newPassword}</div>
                                        ) : null}
                                    </Form.Group>
                                    <Form.Group controlId="formBasicPassword">
                                        <Form.Label>Подтверждение пароля</Form.Label>
                                        <Form.Control type="password"
                                                      placeholder="Подтвердите новый пароль"
                                                      name="confirmPassword"
                                                      onChange={handleChange}
                                                      onBlur={handleBlur}
                                                      value={values.confirmPassword}
                                                      className={touched.confirmPassword && errors.confirmPasswordd ? "has-error" : null}
                                        />
                                        {touched.confirmPassword && errors.confirmPassword ? (
                                            <div className="error-message">{errors.confirmPassword}</div>
                                        ): null}
                                    </Form.Group>
                                    <Button variant="primary" type="submit">
                                        Сохранить
                                    </Button>
                                </Form>
                            </div>
                        )}
                    </Formik>

                </Container>
            </div>
        )
    }
}

export default Settings;
