import React, { Component } from 'react';
import {Link, withRouter} from 'react-router-dom';
import {login, resetPassword, signup} from "../../../util/APIUtils";
import {ACCESS_TOKEN, GOOGLE_AUTH_URL} from "../../../constants";
import {Button, Container, Form, Row} from "react-bootstrap";
import { isEmail, isEmpty, isLength, isContainWhiteSpace } from '../../../util/validator';
import {toast} from "react-toastify";
import googleLogo from '../../../img/google-logo.png';
import {Formik} from "formik";
import {
    VALIDATION_USERNAME_OR_EMAIL_SCHEMA
} from "../validatonShema";

class ResetPassword extends Component {
    render() {
        return (
            <Container>
                <Formik
                    initialValues={{usernameOrEmail:""}}
                    validationSchema={VALIDATION_USERNAME_OR_EMAIL_SCHEMA}
                    onSubmit={(values, {setSubmitting, resetForm}) => {
                        /*  // When button submits form and form is in the process of submitting, submit button is disabled
                          setSubmitting(true);*/
                        resetPassword(values.usernameOrEmail)
                            .then(response => {
                                toast.success(
                                    "На вашу почту выслано письмо!",
                                    {position: toast.POSITION.BOTTOM_LEFT}
                                )
                                this.props.history.push("/");
                                //this.props.onLogin();
                            }).catch(error => {
                            if(error.status === 401) {
                                toast.error(
                                    "Некорректный логин или почта. Попробуйте снова!",
                                    {position: toast.POSITION.BOTTOM_LEFT}
                                )
                                console.log("Your Username or Email is incorrect. Please try again!")
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
            <div className="login-container">
                <div className="login-content block">
                    <h1 className="login-title">Введите почту или логин</h1>
                    <Form style={{justifyContent:"center", width: "100%"}} onSubmit={handleSubmit}>
                        <Form.Group controlId="username" >
                            <Form.Control type="text"
                                          placeholder="Введите имя пользователя/почту"
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
                        <Button style={{width: "100%"}} variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </div>
            </div>
                    )}
                </Formik>
            </Container>
        );

    }
}

export default ResetPassword;
