import React, {Component} from "react";
import {Formik} from "formik";
import {formatDate, getItem, setPicture} from "../../util/APIUtils";
import {Button, Container, Form, Row} from "react-bootstrap";
import {toast} from "react-toastify";
import {VALIDATION_UPLOAD_PICTURE_SCHEMA} from "../auth/validatonShema";
import {Link} from "react-router-dom";
import "./Item.css";

class ItemPicture extends Component {

    constructor(props) {
        super(props);
        this.state = {itemId: null, item: null};
    }

    loadItem(itemId) {
        this.setState({
            isLoading: true
        });

        getItem(itemId)
            .then(response => {
                this.setState({
                    item: response,
                    itemId: response.id,
                });
        });
    }

    componentDidMount() {
        if (this.props.itemId) {
            this.setState({itemId: this.props.itemId})
        } else {
            this.setState({itemId: this.props.itemId})
        }
    }

    componentDidUpdate(nextProps) {
        if(this.props.itemId !== nextProps.itemId) {
            this.setState({itemId: this.props.itemId})
        }
        if (this.props.itemId !== nextProps.itemId) {
            this.setState({itemId: this.props.itemId})
        }
    }

    render() {
        let pictures = [];
        // if ()
        // this.puctures.unshift(
        //
        // )
        return (
            <div className="pictures">
                <Container className="item-picture">
                    <Formik
                        initialValues={{file: null}}
                        validationSchema={VALIDATION_UPLOAD_PICTURE_SCHEMA}
                        onSubmit={(values, {setSubmitting, resetForm}) => {
                            setPicture(this.state.itemId, values)
                                .then(response => {
                                    console.log("Thank you! You're successfully registered. Please Login to continue!");
                                    toast.success(
                                        "?????????????????????? ?????????????? ??????????????????!",
                                        {position: toast.POSITION.BOTTOM_LEFT}
                                    )
                                }).catch(error => {
                                toast.error(
                                    error.message || '??????-???? ?????????? ???? ??????. ???????????????????? ?????? ??????!',
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
                                <Form style={{width: "50%", marginTop: "20px", justifyContent: "center"}}
                                      onSubmit={handleSubmit}>
                                    {
                                        this.props.type === "EDIT" ? (
                                            <h2>?????????????????? ??????????????????????</h2>
                                        ): (
                                            <h2>???????????????????? ??????????????????????</h2>
                                        )
                                    }
                                    <Form.Group>
                                        <Form.File
                                            className="position-relative"
                                            required
                                            name="file"
                                            accept="image/*"
                                            multiple
                                            onChange={(event) => {
                                                setFieldValue("file", event.currentTarget.files[0], ".jpg,.xlsx");
                                            }}
                                            isInvalid={!!errors.file}
                                            feedback={errors.file}
                                            id="validationFormik107"
                                            feedbackTooltip
                                        />
                                    </Form.Group>

                                    <Row className="itemButton">
                                        <Button variant="primary" type="submit">
                                            ???????????????? ??????????????????????
                                        </Button>
                                    </Row>
                                    <Row className="itemButton">
                                        <Button variant="primary" as={Link} to={"/"}>
                                            ?????????????????? ????????????????????
                                        </Button>
                                    </Row>

                                </Form>
                            </div>
                        )}
                    </Formik>
                </Container>
            </div>
        )
    }
}

export default ItemPicture;
