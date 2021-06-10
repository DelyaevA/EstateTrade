import React, {Component} from "react";
import {Button, Container, Form, Row} from "react-bootstrap";
import {Formik} from "formik";
import {VALIDATION_LOGIN_SCHEMA, VALIDATION_PASSWORD_SCHEMA} from "../validatonShema";
import {inputPassword, resetPassword} from "../../../util/APIUtils";
import {toast} from "react-toastify";

class InputPassword extends Component {
    render() {
        return (
            <Container>
                <Formik
                    initialValues={{password:"", confirmPassword: ""}}
                    validationSchema={VALIDATION_PASSWORD_SCHEMA}
                    onSubmit={(values, {setSubmitting, resetForm}) => {
                        /*  // When button submits form and form is in the process of submitting, submit button is disabled
                          setSubmitting(true);*/
                        //console.log(this.props.mat.params)
                        inputPassword({password:values.password, code: this.props.match.params.code})
                            .then(response => {
                                toast.success(
                                    "Вы поменяли пароль!",
                                    {position: toast.POSITION.BOTTOM_LEFT}
                                )
                                this.props.history.push("/login")
                            }).catch(error => {
                            if(error.status === 401) {
                                toast.error(
                                    "Некорректный пароль. Попробуйте снова!",
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
                        <Row className="justify-content-center">
                            <div className={"auth-form block"}>
                                <Form style={{width:"75%", justifyContent:"center"}} onSubmit={handleSubmit}>
                                    <p className="text-center">Введите новый пароль</p>
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

export default InputPassword;
