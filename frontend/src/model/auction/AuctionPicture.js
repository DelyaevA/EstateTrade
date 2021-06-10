import React, {Component} from "react";
import {Formik} from "formik";
import {setAuctionPicture} from "../../util/APIUtils";
import {Button, Container, Form, Row} from "react-bootstrap";
import {toast} from "react-toastify";
import {VALIDATION_UPLOAD_PICTURE_SCHEMA} from "../auth/validatonShema";
import {Link} from "react-router-dom";
import "./Auction.css";

class AuctionPicture extends Component {

    constructor(props) {
        super(props);
        this.state = {auctionId: null};
    }

    componentDidMount() {
        if (this.props.auctionId) {
            this.setState({auctionId: this.props.auctionId})
        } else {
            this.setState({auctionId: this.props.auctionId})
        }
    }

    componentDidUpdate(nextProps) {
        if(this.props.auctionId !== nextProps.auctionId) {
            this.setState({auctionId: this.props.auctionId})
        }
        if (this.props.auctionId !== nextProps.auctionId) {
            this.setState({auctionId: this.props.auctionId})
        }
    }

    render() {
        return (
            <div className="pictures">
                <Container className="auction-picture">
                    <Formik
                        initialValues={{file: null}}
                        validationSchema={VALIDATION_UPLOAD_PICTURE_SCHEMA}
                        onSubmit={(values, {setSubmitting, resetForm}) => {
                            setAuctionPicture(this.state.auctionId, values)
                                .then(response => {
                                    console.log("Thank you! You're successfully registered. Please Login to continue!");
                                    toast.success(
                                        "Изображения успешно загружены!",
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
                              setFieldValue,
                              isSubmitting
                          }) => (
                            <div className="justify-content-center">
                                <Form style={{width: "50%", marginTop: "20px", justifyContent: "center"}}
                                      onSubmit={handleSubmit}>
                                    {
                                        this.props.type === "EDIT" ? (
                                            <h2>Изменение изображений</h2>
                                        ): (
                                            <h2>Добавление изображений</h2>
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

                                    <Row className="auctionButton">
                                        <Button variant="primary" type="submit">
                                            Добавить изображение
                                        </Button>
                                    </Row>
                                    <Row className="auctionButton">
                                        <Button variant="primary" as={Link} to={"/"}>
                                            Сохранить аукцион
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

export default AuctionPicture;
