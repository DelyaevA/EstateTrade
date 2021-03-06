import React, {Component} from "react";
import {Badge, Button, Col, Container, Form, Nav, Row} from "react-bootstrap";
import {
    ACCESS_TOKEN,
    CATEGORY,
    CATEGORY_REPORTS,
    CATEGORY_REPORTS_ITEM,
    CONDITION,
    USER_LIST_SIZE
} from "../../constants";
import {
    changeAuthority,
    changeCategory,
    formatDate, getAllReportsByItemId,
    getItem,
    getUser,
    login,
    moderate,
    updateUser
} from "../../util/APIUtils";
import {toast} from "react-toastify";
import {isContainWhiteSpace, isEmail, isEmpty, isLength} from "../../util/validator";
import {Formik} from "formik";
import {
    VALIDATION_CHANGE_AUTHORITY_SCHEMA,
    VALIDATION_CHANGE_CATEGORY_SCHEMA,
    VALIDATION_MODERATING_SCHEMA
} from "../../model/auth/validatonShema";
import Delay from "react-delay/lib/Delay";
import {Link} from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

class ItemFullInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reports: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true
        }
        this.loadItem = this.loadItem.bind(this);
        //this.getAllReportsByItemId = this.getAllReportsByItemId.bind(this);
    }

    // getAllReportsByItemId(itemId){
    //     getAllReportsByItemId(itemId)
    //         .then(response => {
    //             const reports = this.state.reports.slice();
    //             this.setState({
    //                 reports: reports.concat(response.content),
    //                 page: response.page,
    //                 size: response.size,
    //                 totalElements: response.totalElements,
    //                 totalPages: response.totalPages,
    //                 last: response.last,
    //                 isLoading: false
    //             });
    //         }).catch(error => {
    //         if(error.status === 404) {
    //             this.setState({
    //                 notFound: true,
    //                 isLoading: false
    //             });
    //         } else {
    //             this.setState({
    //                 serverError: true,
    //                 isLoading: false
    //             });
    //         }
    //     });
    // }


    loadItem(itemId) {
        this.setState({
            isLoading: true
        });

        getItem(itemId)
            .then(response => {
                this.setState({
                    item: response,
                    reports: response.reports,
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
        console.log(this.props.itemId)
        const itemId = this.props.itemId;
        this.loadItem(itemId);
        //this.getAllReportsByItemId(itemId);
    }

    componentDidUpdate(nextProps) {
        if(this.props.itemId !== nextProps.itemId) {
            this.loadItem(nextProps.itemId);
            //this.getAllReportsByItemId(nextProps.itemId);
        }
    }

    render() {
        const products = [];
        const columns = [{
            dataField: 'description',
            text: '???????????????? ????????????',
            sort: true
        }, {
            dataField: 'category',
            text: '??????????????????',
            sort: true
        }];
        this.state.reports.forEach((report, reportIndex) => {
            products.push({
                description: report.description,
                category: CATEGORY_REPORTS_ITEM[report.category],
            })
        });
        return (
            <Container>
                <Container className="user-info block">
                    <h4>
                        <Badge variant="secondary">???????????????????? ?? ????????????????????</Badge>
                    </h4>
                    {
                        this.state.item ? (
                            <Form>
                                <Form.Group as={Row} controlId="formPlaintextPassword">
                                    <Form.Label column sm="2">
                                        ????????????????
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control plaintext readOnly defaultValue={this.state.item.name}/>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} controlId="formPlaintextPassword">
                                    <Form.Label column sm="2">
                                        ??????????????????
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control plaintext readOnly defaultValue={CATEGORY[this.state.item.category]}/>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} controlId="formPlaintextPassword">
                                    <Form.Label column sm="2">
                                        ??????????????????
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control plaintext readOnly defaultValue={CONDITION[this.state.item.condition]}/>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} controlId="formPlaintextPassword">
                                    <Form.Label column sm="2">
                                        ????????????????
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control  as="textarea" rows={3} readOnly defaultValue={this.state.item.description}/>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} controlId="formPlaintextPassword">
                                    <Form.Label column sm="2">
                                        ????????
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control plaintext readOnly defaultValue={this.state.item.price + " ???"}/>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} controlId="formPlaintextPassword">
                                    <Form.Label column sm="2">
                                        ?????????? ????????????????
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control plaintext readOnly defaultValue={formatDate(this.state.item.creationDateTime)}/>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} controlId="formPlaintextPassword">
                                    <Form.Label column sm="2">
                                        ?????????? ??????????????????
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control plaintext readOnly defaultValue={formatDate(this.state.item.expirationDateTime)}/>
                                    </Col>
                                </Form.Group>
                                <h5>
                                    <Badge variant="secondary">????????????</Badge>
                                </h5>
                                <Form.Group as={Row} controlId="formPlaintextPassword">
                                    <Form.Label column sm="2">
                                        ??????????????
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control plaintext readOnly defaultValue={this.state.item.createdBy.username}/>
                                    </Col>
                                </Form.Group>
                            </Form>
                        ) : null
                    }
                </Container>
                <Container className={"change-authority block"}>
                    <Formik
                        initialValues={{category: ""}}
                        validationSchema={VALIDATION_CHANGE_CATEGORY_SCHEMA}
                        onSubmit={(values, {setSubmitting, resetForm}) => {
                            /*  // When button submits form and form is in the process of submitting, submit button is disabled
                              setSubmitting(true);*/
                            changeCategory(this.state.item.id, values, "items")
                                .then(response => {
                                    toast.success(
                                        "?????????????????? ?????????????? ????????????????!",
                                        {position: toast.POSITION.BOTTOM_LEFT}
                                    )
                                    setTimeout(() => {  window.location.reload(); }, 3000);
                                }).catch(error => {
                                toast.error(
                                    error.message || '??????-???? ?????????? ???? ??????. ???????????????????? ?????? ??????!',
                                    {position: toast.POSITION.BOTTOM_LEFT}
                                )
                                console.log(error.message || 'Sorry! Something went wrong. Please try again!')
                            });
                            //setTimeout(() => {  console.log("World!"); }, 5000);
                            //window.location.reload();
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
                                    <Badge variant="secondary">?????????? ??????????????????</Badge>
                                </h4>
                                <Form style={{width: "50%", justifyContent: "center"}}
                                      onSubmit={handleSubmit}>

                                    <Form.Group controlId="exampleForm.ControlSelect1" style={{marginTop:"1em"}}>
                                        <Form.Control
                                            as="select"
                                            name="category"
                                            onBlur={handleBlur}
                                            value={values.category}
                                            onChange={handleChange}
                                        >
                                            <option value="" data-marker="option">?????????? ??????????????????</option>
                                            <option value="1" className="category-select-group-y6FfI"
                                                    data-marker="option(1)">??????????????????
                                            </option>
                                            <option value="11" data-marker="option(9)">????????????????????</option>
                                            <option value="12" data-marker="option(14)">?????????????????? ?? ??????????????????????</option>
                                            <option value="13" data-marker="option(81)">?????????????????? ?? ??????????????????????</option>
                                            <option value="14" data-marker="option(11)">???????????? ??????????????????</option>
                                            <option value="15" data-marker="option(10)">???????????????? ?? ????????????????????</option>
                                            <option value="2" className="category-select-group-y6FfI"
                                                    data-marker="option(4)">????????????????????????
                                            </option>
                                            <option value="21" data-marker="option(24)">????????????????</option>
                                            <option value="22" data-marker="option(23)">??????????????</option>
                                            <option value="23" data-marker="option(25)">????????, ????????, ????????????????</option>
                                            <option value="24" data-marker="option(85)">???????????? ?? ??????????????????????</option>
                                            <option value="25" data-marker="option(26)">?????????????????? ??????????????</option>
                                            <option value="26" data-marker="option(42)">???????????????????????? ????????????????????????
                                            </option>
                                            <option value="27" data-marker="option(86)">???????????????????????? ???? ??????????????</option>
                                            <option value="3" className="category-select-group-y6FfI"
                                                    data-marker="option(110)">????????????
                                            </option>
                                            <option value="31" data-marker="option(111)">????????????????</option>
                                            <option value="32" data-marker="option(112)">????????????</option>
                                            <option value="4" className="category-select-group-y6FfI"
                                                    data-marker="option(114)">????????????
                                            </option>
                                            <option value="5" className="category-select-group-y6FfI"
                                                    data-marker="option(5)">???????????? ????????
                                            </option>
                                            <option value="51" data-marker="option(27)">????????????, ??????????, ????????????????????
                                            </option>
                                            <option value="52" data-marker="option(29)">?????????????? ???????????? ?? ??????????</option>
                                            <option value="53" data-marker="option(30)">???????????? ?????? ?????????? ?? ??????????????
                                            </option>
                                            <option value="54" data-marker="option(28)">???????? ?? ??????????????????</option>
                                            <option value="55" data-marker="option(88)">?????????????? ?? ????????????????</option>
                                            <option value="6" className="category-select-group-y6FfI"
                                                    data-marker="option(2)">?????? ???????? ?? ????????
                                            </option>
                                            <option value="61" data-marker="option(21)">?????????????? ??????????????</option>
                                            <option value="62" data-marker="option(20)">???????????? ?? ????????????????</option>
                                            <option value="63" data-marker="option(87)">???????????? ?? ???????????? ?????? ??????????
                                            </option>
                                            <option value="64" data-marker="option(82)">???????????????? ??????????????</option>
                                            <option value="65" data-marker="option(19)">???????????? ?? ??????????????????????????</option>
                                            <option value="66" data-marker="option(106)">????????????????</option>
                                            <option value="7" className="category-select-group-y6FfI"
                                                    data-marker="option(6)">?????????????? ??????????????????????
                                            </option>
                                            <option value="71" data-marker="option(32)">?????????? ?? ??????????</option>
                                            <option value="72" data-marker="option(97)">????????, ?????????????????? ?? ??????????????????
                                            </option>
                                            <option value="73" data-marker="option(31)">???????????????????? ????????????????????</option>
                                            <option value="74" data-marker="option(98)">????????????????</option>
                                            <option value="75" data-marker="option(99)">???????????????????? ?? ????????????????????</option>
                                            <option value="76" data-marker="option(96)">???????????????? ?? ?????????????????????? ??????????
                                            </option>
                                            <option value="77" data-marker="option(84)">????????????????</option>
                                            <option value="78" data-marker="option(101)">???????????? ?????? ????????????????????</option>
                                            <option value="79" data-marker="option(105)">??????????????????????</option>
                                            <option value="8" className="category-select-group-y6FfI"
                                                    data-marker="option(7)">?????????? ?? ??????????
                                            </option>
                                            <option value="81" data-marker="option(33)">???????????? ?? ??????????????????????</option>
                                            <option value="82" data-marker="option(34)">????????????????????</option>
                                            <option value="83" data-marker="option(83)">?????????? ?? ??????????????</option>
                                            <option value="84" data-marker="option(36)">????????????????????????????????????</option>
                                            <option value="85" data-marker="option(38)">?????????????????????? ??????????????????????</option>
                                            <option value="86" data-marker="option(102)">?????????? ?? ??????????????</option>
                                            <option value="87" data-marker="option(39)">?????????? ?? ??????????</option>
                                            <option value="9" className="category-select-group-y6FfI"
                                                    data-marker="option(35)">????????????????
                                            </option>
                                            <option value="91" data-marker="option(89)">????????????</option>
                                            <option value="92" data-marker="option(90)">??????????</option>
                                            <option value="93" data-marker="option(91)">??????????</option>
                                            <option value="94" data-marker="option(92)">????????????????</option>
                                            <option value="95" data-marker="option(93)">???????????? ????????????????</option>
                                            <option value="96" data-marker="option(94)">???????????? ?????? ????????????????</option>
                                            <option value="a" className="category-select-group-y6FfI"
                                                    data-marker="option(8)">?????????????? ???????????? ?? ????????????????????????
                                            </option>
                                            <option value="a1" data-marker="option(116)">?????????????? ????????????</option>
                                            <option value="a2" data-marker="option(40)">???????????????????????? ?????? ??????????????
                                            </option>
                                        </Form.Control>
                                    </Form.Group>
                                    <Button variant="primary" type="submit">
                                        ??????????????????
                                    </Button>
                                </Form>
                            </div>
                        )}
                    </Formik>
                </Container>
                <div  style={{marginTop: '20px', paddingTop: '15px', paddingBottom: '15px'}} className={"table-items block"}>
                    <h4>
                        <Badge variant="secondary">????????????</Badge>
                    </h4>
                    <BootstrapTable keyField='id' data={ products } columns={ columns } pagination={ paginationFactory() } />
                </div>
                <Container className={"moderating block"}>
                    <Formik
                        initialValues={{isApproved: true, comment: ""}}
                        validationSchema={VALIDATION_MODERATING_SCHEMA}
                        onSubmit={(values, {setSubmitting, resetForm}) => {
                            /*  // When button submits form and form is in the process of submitting, submit button is disabled
                              setSubmitting(true);*/

                            moderate(this.state.item.id, values)
                                .then(response => {
                                    toast.success(
                                        "???????????????????? ??????????????????????!",
                                        {position: toast.POSITION.BOTTOM_LEFT}
                                    )
                                    window.location.reload();
                                }).catch(error => {
                                toast.error(
                                    error.message || '??????-???? ?????????? ???? ??????. ???????????????????? ?????? ??????!',
                                    {position: toast.POSITION.BOTTOM_LEFT}
                                )
                                console.log(error.message || '??????-???? ?????????? ???? ??????. ???????????????????? ?????? ??????!')
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
                                    <Badge variant="secondary">??????????????????</Badge>
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
                                            <option value={true}>????????????????</option>
                                            <option value={false}>??????????????????</option>
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group controlId="exampleForm.ControlTextarea1">
                                        <Form.Label>??????????????????????</Form.Label>
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
                                        ??????????????????
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

export default ItemFullInfo;
