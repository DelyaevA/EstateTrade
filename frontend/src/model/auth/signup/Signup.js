import React, { Component } from 'react';
import './Signup.css';
import { Link } from 'react-router-dom';
import {login, signup} from "../../../util/APIUtils";
import {
    ACCESS_TOKEN,
    NAME_MAX_LENGTH,
    NAME_MIN_LENGTH,
    PASSWORD_MAX_LENGTH,
    PASSWORD_MIN_LENGTH
} from "../../../constants";
import {Button, Container, Form, Row} from "react-bootstrap";
import {toast} from "react-toastify";
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {VALIDATION_SIGNUP_SCHEMA} from "../validatonShema";


class Signup extends Component {

    constructor(props) {
        super(props);
    }



    render() {
        return (
            <Container>
                <Formik
                    initialValues={{username:"", email:"", password:"", confirmPassword: ""}}
                    validationSchema={VALIDATION_SIGNUP_SCHEMA}
                    onSubmit={(values, {setSubmitting, resetForm}) => {
                      /*  // When button submits form and form is in the process of submitting, submit button is disabled
                        setSubmitting(true);*/

                        signup(values)
                            .then(response => {
                                console.log("Thank you! You're successfully registered. Please Login to continue!");
                                toast.success(
                                    "Регистрация успешно завершена! Для авторизации на сайте, подтвердите свой адрес электронной почты!",
                                    {position: toast.POSITION.BOTTOM_LEFT}
                                )
                                this.props.history.push("/login");
                            }).catch(error => {
                            toast.error(
                                error.message || 'Что то пошло не так! Попробуйте снова!',
                                {position: toast.POSITION.BOTTOM_LEFT}
                            )
                            console.log(error.message || 'Sorry! Something went wrong. Please try again!')
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
                            <div className={"auth-form block"}>
                                <Form style={{width:"75%", justifyContent:"center"}} onSubmit={handleSubmit}>
                                    <p className="text-center">Регистрация</p>
                                    <Form.Group controlId="username" >
                                        <Form.Label>Никнейм</Form.Label>
                                        <Form.Control type="text"
                                                      placeholder="Введите имя пользователя"
                                                      name="username"
                                                      onChange={handleChange}
                                                      onBlur={handleBlur}
                                                      value={values.username}
                                                      className={touched.username && errors.username ? "has-error" : null}
                                        />
                                        {touched.username && errors.username ? (
                                            <div className="error-message">
                                                {errors.username}
                                            </div>
                                        ): null}
                                    </Form.Group>

                                    <Form.Group controlId="formBasicEmail" >
                                        <Form.Label>Электронная почта</Form.Label>
                                        <Form.Control type="text"
                                                      placeholder="Введите адрес электронной почты"
                                                      name="email"
                                                      onChange={handleChange}
                                                      onBlur={handleBlur}
                                                      value={values.email}
                                                      className={touched.email && errors.email ? "has-error" : null}
                                        />
                                        {touched.email && errors.email ? (
                                            <div className="error-message">{errors.email}</div>
                                        ): null}
                                    </Form.Group>

                                    <Form.Group controlId="formBasicPassword">
                                        <Form.Label>Пароль</Form.Label>
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
                                    <Form.Group controlId="formBasicPassword">
                                        <Form.Label>Подтверждение пароля</Form.Label>
                                        <Form.Control type="password"
                                                      placeholder="Подтвердите пароль"
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
                                    <Button style={{width: "100%"}} variant="primary" type="submit">
                                        Отправить
                                    </Button>
                                </Form>
                            </div>
                        </Row>
                    )}
                </Formik>
            </Container>
        );
    }
}


export default Signup;
