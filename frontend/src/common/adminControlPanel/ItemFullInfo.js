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
            text: 'Описание жалобы',
            sort: true
        }, {
            dataField: 'category',
            text: 'Категория',
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
                        <Badge variant="secondary">Информация о объявлении</Badge>
                    </h4>
                    {
                        this.state.item ? (
                            <Form>
                                <Form.Group as={Row} controlId="formPlaintextPassword">
                                    <Form.Label column sm="2">
                                        Название
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control plaintext readOnly defaultValue={this.state.item.name}/>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} controlId="formPlaintextPassword">
                                    <Form.Label column sm="2">
                                        Категория
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control plaintext readOnly defaultValue={CATEGORY[this.state.item.category]}/>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} controlId="formPlaintextPassword">
                                    <Form.Label column sm="2">
                                        Состояние
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control plaintext readOnly defaultValue={CONDITION[this.state.item.condition]}/>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} controlId="formPlaintextPassword">
                                    <Form.Label column sm="2">
                                        Описание
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control  as="textarea" rows={3} readOnly defaultValue={this.state.item.description}/>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} controlId="formPlaintextPassword">
                                    <Form.Label column sm="2">
                                        Цена
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control plaintext readOnly defaultValue={this.state.item.price + " ₽"}/>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} controlId="formPlaintextPassword">
                                    <Form.Label column sm="2">
                                        Время создания
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control plaintext readOnly defaultValue={formatDate(this.state.item.creationDateTime)}/>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} controlId="formPlaintextPassword">
                                    <Form.Label column sm="2">
                                        Время окончания
                                    </Form.Label>
                                    <Col sm="10">
                                        <Form.Control plaintext readOnly defaultValue={formatDate(this.state.item.expirationDateTime)}/>
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
                                        "Категория успешна изменена!",
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
                                    <Badge variant="secondary">Смена категории</Badge>
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
                                            <option value="" data-marker="option">Любая категория</option>
                                            <option value="1" className="category-select-group-y6FfI"
                                                    data-marker="option(1)">Транспорт
                                            </option>
                                            <option value="11" data-marker="option(9)">Автомобили</option>
                                            <option value="12" data-marker="option(14)">Мотоциклы и мототехника</option>
                                            <option value="13" data-marker="option(81)">Грузовики и спецтехника</option>
                                            <option value="14" data-marker="option(11)">Водный транспорт</option>
                                            <option value="15" data-marker="option(10)">Запчасти и аксессуары</option>
                                            <option value="2" className="category-select-group-y6FfI"
                                                    data-marker="option(4)">Недвижимость
                                            </option>
                                            <option value="21" data-marker="option(24)">Квартиры</option>
                                            <option value="22" data-marker="option(23)">Комнаты</option>
                                            <option value="23" data-marker="option(25)">Дома, дачи, коттеджи</option>
                                            <option value="24" data-marker="option(85)">Гаражи и машиноместа</option>
                                            <option value="25" data-marker="option(26)">Земельные участки</option>
                                            <option value="26" data-marker="option(42)">Коммерческая недвижимость
                                            </option>
                                            <option value="27" data-marker="option(86)">Недвижимость за рубежом</option>
                                            <option value="3" className="category-select-group-y6FfI"
                                                    data-marker="option(110)">Работа
                                            </option>
                                            <option value="31" data-marker="option(111)">Вакансии</option>
                                            <option value="32" data-marker="option(112)">Резюме</option>
                                            <option value="4" className="category-select-group-y6FfI"
                                                    data-marker="option(114)">Услуги
                                            </option>
                                            <option value="5" className="category-select-group-y6FfI"
                                                    data-marker="option(5)">Личные вещи
                                            </option>
                                            <option value="51" data-marker="option(27)">Одежда, обувь, аксессуары
                                            </option>
                                            <option value="52" data-marker="option(29)">Детская одежда и обувь</option>
                                            <option value="53" data-marker="option(30)">Товары для детей и игрушки
                                            </option>
                                            <option value="54" data-marker="option(28)">Часы и украшения</option>
                                            <option value="55" data-marker="option(88)">Красота и здоровье</option>
                                            <option value="6" className="category-select-group-y6FfI"
                                                    data-marker="option(2)">Для дома и дачи
                                            </option>
                                            <option value="61" data-marker="option(21)">Бытовая техника</option>
                                            <option value="62" data-marker="option(20)">Мебель и интерьер</option>
                                            <option value="63" data-marker="option(87)">Посуда и товары для кухни
                                            </option>
                                            <option value="64" data-marker="option(82)">Продукты питания</option>
                                            <option value="65" data-marker="option(19)">Ремонт и строительство</option>
                                            <option value="66" data-marker="option(106)">Растения</option>
                                            <option value="7" className="category-select-group-y6FfI"
                                                    data-marker="option(6)">Бытовая электроника
                                            </option>
                                            <option value="71" data-marker="option(32)">Аудио и видео</option>
                                            <option value="72" data-marker="option(97)">Игры, приставки и программы
                                            </option>
                                            <option value="73" data-marker="option(31)">Настольные компьютеры</option>
                                            <option value="74" data-marker="option(98)">Ноутбуки</option>
                                            <option value="75" data-marker="option(99)">Оргтехника и расходники</option>
                                            <option value="76" data-marker="option(96)">Планшеты и электронные книги
                                            </option>
                                            <option value="77" data-marker="option(84)">Телефоны</option>
                                            <option value="78" data-marker="option(101)">Товары для компьютера</option>
                                            <option value="79" data-marker="option(105)">Фототехника</option>
                                            <option value="8" className="category-select-group-y6FfI"
                                                    data-marker="option(7)">Хобби и отдых
                                            </option>
                                            <option value="81" data-marker="option(33)">Билеты и путешествия</option>
                                            <option value="82" data-marker="option(34)">Велосипеды</option>
                                            <option value="83" data-marker="option(83)">Книги и журналы</option>
                                            <option value="84" data-marker="option(36)">Коллекционирование</option>
                                            <option value="85" data-marker="option(38)">Музыкальные инструменты</option>
                                            <option value="86" data-marker="option(102)">Охота и рыбалка</option>
                                            <option value="87" data-marker="option(39)">Спорт и отдых</option>
                                            <option value="9" className="category-select-group-y6FfI"
                                                    data-marker="option(35)">Животные
                                            </option>
                                            <option value="91" data-marker="option(89)">Собаки</option>
                                            <option value="92" data-marker="option(90)">Кошки</option>
                                            <option value="93" data-marker="option(91)">Птицы</option>
                                            <option value="94" data-marker="option(92)">Аквариум</option>
                                            <option value="95" data-marker="option(93)">Другие животные</option>
                                            <option value="96" data-marker="option(94)">Товары для животных</option>
                                            <option value="a" className="category-select-group-y6FfI"
                                                    data-marker="option(8)">Готовый бизнес и оборудование
                                            </option>
                                            <option value="a1" data-marker="option(116)">Готовый бизнес</option>
                                            <option value="a2" data-marker="option(40)">Оборудование для бизнеса
                                            </option>
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
                <div  style={{marginTop: '20px', paddingTop: '15px', paddingBottom: '15px'}} className={"table-items block"}>
                    <h4>
                        <Badge variant="secondary">Жалобы</Badge>
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
                                        "Объявление просмотрено!",
                                        {position: toast.POSITION.BOTTOM_LEFT}
                                    )
                                    window.location.reload();
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

export default ItemFullInfo;
