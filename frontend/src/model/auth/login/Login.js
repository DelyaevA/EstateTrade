import React, { Component } from 'react';
import './Login.css';
import {Link, withRouter} from 'react-router-dom';
import {login, signup} from "../../../util/APIUtils";
import {ACCESS_TOKEN, GOOGLE_AUTH_URL} from "../../../constants";
import {Button, Container, Form, Row} from "react-bootstrap";
import { isEmail, isEmpty, isLength, isContainWhiteSpace } from '../../../util/validator';
import {toast} from "react-toastify";
import googleLogo from '../../../img/google-logo.png';
import {Formik} from "formik";
import {VALIDATION_LOGIN_SCHEMA} from "../validatonShema";

class Login extends Component {
    render() {
        return (
            <div className="login-container">
                <div className="login-content block">
                    <h1 className="login-title">Авторизация</h1>
                    <SocialLogin />
                    <div className="or-separator">
                        <span>
                            ИЛИ
                        </span>
                    </div>
                    <LoginForm {...this.props} />
                    <span className="signup-link">Новый пользователь? <Link to="/signup">Регистрация!</Link></span>
                </div>
            </div>
        );
    }
}

class LoginForm extends Component {
    render() {
        return (
            <Container>
                <Formik
                    initialValues={{usernameOrEmail:"", password:""}}
                    validationSchema={VALIDATION_LOGIN_SCHEMA}
                    onSubmit={(values, {setSubmitting, resetForm}) => {
                        /*  // When button submits form and form is in the process of submitting, submit button is disabled
                          setSubmitting(true);*/
                        login(values)
                            .then(response => {
                                localStorage.setItem(ACCESS_TOKEN, response.accessToken);
                                this.props.onLogin();
                            }).catch(error => {
                            if(error.status === 401) {
                                toast.error(
                                    "Некорректный логин или пароль. Попробуйте снова!",
                                    {position: toast.POSITION.BOTTOM_LEFT}
                                )
                                console.log("Your Username or Password is incorrect. Please try again!")
                            } else {
                                toast.error(
                                    error.message || "Что-то пошло не так. Попробуйте снова!",
                                    {position: toast.POSITION.BOTTOM_LEFT}
                                )
                                console.log(error.message || 'Sorry! Something went wrong. Please try again!')
                            }
                        });
                    }}
                >
                    {( {values,
                           errors,
                           touched,
                           handleChange,
                           handleBlur,
                           handleSubmit,
                           isSubmitting }) => (
                        <Row className="justify-content-center">
                            <div className={"auth-form"}>
                                <Form style={{justifyContent:"center", width: "100%"}} onSubmit={handleSubmit}>
                                    <Form.Group controlId="username" >
                                        <Form.Control type="text"
                                                      placeholder="Введите имя пользователя"
                                                      name="usernameOrEmail"
                                                      onChange={handleChange}
                                                      onBlur={handleBlur}
                                                      value={values.usernameOrEmail}
                                                      className={touched.usernameOrEmail && errors.usernameOrEmail ? "has-error" : null}
                                        />
                                        {touched.usernameOrEmail && errors.usernameOrEmail ? (
                                            <div className="error-message">
                                                {errors.usernameOrEmail}
                                            </div>
                                        ): null}
                                    </Form.Group>
                                    <Form.Group controlId="formBasicPassword">
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
                                        ): null}
                                    </Form.Group>
                                    <Button style={{width: "100%"}} variant="primary" type="submit">
                                        Выполнить вход
                                    </Button>
                                </Form>
                            </div>
                            <span className="signup-link"><Link to="/resetPassword">Забыли пароль?</Link></span>
                        </Row>
                    )}
                </Formik>
            </Container>
        );
    }
}

class SocialLogin extends Component {
    render() {
        return (
            <div className="social-login">
                <a className="btn btn-block social-btn google" href={GOOGLE_AUTH_URL}>
                    <img src={googleLogo} alt="Google" />Войти с помощью Google</a>
            </div>
        );
    }
}

export default Login;
