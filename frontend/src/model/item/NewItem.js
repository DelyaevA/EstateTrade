import React, {Component} from "react";
import {Button, Container, Form, Row} from "react-bootstrap";
import {createItem, formatDate, getItem, updateItem} from "../../util/APIUtils";
import {Formik} from "formik";
import {toast} from "react-toastify";
import {VALIDATION_NEW_ITEM} from "../auth/validatonShema";
import ItemPicture from "./ItemPicture";

class NewItem extends Component {
    constructor(props) {
        super(props);
        this.state = {itemLoad: true, item: null};
        this.changeState = this.changeState.bind(this);
    }

    changeState(item, itemR) {
        console.log(JSON.stringify(item), itemR);
        this.setState({itemLoad: false, item: item, itemId: itemR.id});
    }

    render() {
        return(
            <div>
                {
                    this.state.itemLoad? (<ItemForm type={this.props.type} itemId={this.props.match.params.id} callback={this.changeState}/>): (<ItemPicture itemId={this.state.itemId}/>)
                }
            </div>
        )
    }

}

class ItemForm extends Component {
    constructor(props) {
        super(props);
        this.state = {file: '', imagePreviewUrl: ''};

    }

    loadItem(itemId) {
        this.setState({
            isLoading: true
        });

        getItem(itemId)
            .then(response => {
                this.setState({
                    item: response,
                    //TODO:Сделать чтобы дата была в state.item, а не в state (Через setState)
                    regDate: formatDate(response.createdBy.registrationDate),
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
        if (this.props.type === "EDIT"){
            this.loadItem(this.props.itemId)
        }
    }

    render() {
        return(
            <Container>
                <Formik
                    initialValues={{name: this.state.item ? this.state.item.name : "", category: this.state.item ? this.state.item.category : "",
                        condition : this.state.item ? this.state.item.condition : "1", itemType:this.state.item ? this.state.item.itemType : "1",
                        description:this.state.item ? this.state.item.description : "", amount:this.state.item ? this.state.item.amount : "", address:this.state.item ? this.state.item.address : "",
                        price: this.state.item ? this.state.item.price : ""}}
                    validationSchema={VALIDATION_NEW_ITEM}
                    enableReinitialize
                    onSubmit={(values, {setSubmitting, resetForm}) => {
                        var url = "https://cleaner.dadata.ru/api/v1/clean/address";
                        var token = "da5f9d476188ea40e5dda840f79bc18277526db7";
                        var secret = "0e7499861b0396f98962d18f3fe8a50121fc6e90";
                        var query = values["address"];
                        var options = {
                            method: "POST",
                            mode: "cors",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": "Token " + token,
                                "X-Secret": secret
                            },
                            body: JSON.stringify([query])
                        }

                        fetch(url, options)
                            .then(response => response.text())
                            .then(result => console.log(result))
                            .catch(error => console.log("error", error));
                        if (this.props.type === "NEW") {
                            createItem(values)
                                .then(response => {
                                    toast.success(
                                        "Объявление успешно создано!",
                                        {position: toast.POSITION.BOTTOM_LEFT}
                                    )
                                    //debugger;
                                    this.props.callback(values, response)
                                    //TODO: Need refactor
                                }).catch(error => {
                                if (error.status === 401) {
                                    toast.error(
                                        "Форма заполнена некорректно. Попробуйте снова!",
                                        {position: toast.POSITION.BOTTOM_LEFT}
                                    )
                                    console.log("NEWITEM", "Your Username or Password is incorrect. Please try again!")
                                } else {
                                    toast.error(
                                        error.message || "Упс! Что-то пошло не так. Попробуйте снова!",
                                        {position: toast.POSITION.BOTTOM_LEFT}
                                    )
                                    console.log("NEWITEM", error.message || 'Sorry! Something went wrong. Please try again!', error)
                                }
                            });
                        }else {
                            updateItem(values, this.props.itemId)
                                .then(response => {
                                    toast.success(
                                        "Объявление успешно обновлено!",
                                        {position: toast.POSITION.BOTTOM_LEFT}
                                    )
                                    //debugger;
                                    this.props.callback(values, response)
                                    //TODO: Need refactor
                                }).catch(error => {
                                if (error.status === 401) {
                                    toast.error(
                                        "Форма заполнена некорректно. Попробуйте снова!",
                                        {position: toast.POSITION.BOTTOM_LEFT}
                                    )
                                    console.log("NEWITEM", "Your Username or Password is incorrect. Please try again!")
                                } else {
                                    toast.error(
                                        error.message || "Упс! Что-то пошло не так. Попробуйте снова!",
                                        {position: toast.POSITION.BOTTOM_LEFT}
                                    )
                                    console.log("NEWITEM", error.message || 'Sorry! Something went wrong. Please try again!', error)
                                }
                            });
                        }
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
                            <div className={"form block"}>
                                <Form
                                    style={{width:"60%", justifyContent:"center"}}
                                    onSubmit={handleSubmit}>
                                    {
                                        this.props.type === "EDIT" ? (
                                            <h2>Изменение объявления</h2>
                                        ): (
                                            <h2>Создание объявления</h2>
                                        )
                                    }
                                    <Form.Group controlId="exampleForm.ControlInput1">
                                        <Form.Label>Заголовок объявления</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            onBlur={handleBlur}
                                            value={values.name}
                                            placeholder="Введите заголовок объявления"
                                            onChange={handleChange}
                                            className={touched.name && errors.name ? "has-error" : null}
                                        />
                                        {touched.name && errors.name ? (
                                            <div className="error-message">{errors.name}</div>
                                        ): null}
                                    </Form.Group>
                                    <Form.Group controlId="exampleForm.ControlSelect1">
                                        <Form.Label>Категория</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="category"
                                            onBlur={handleBlur}
                                            value={values.category}
                                            onChange={handleChange}
                                        >
                                            <option value="" data-marker="option">Любая категория</option>
                                            <option value="1" className="category-select-group-y6FfI" data-marker="option(1)">Транспорт</option>
                                            <option value="11" data-marker="option(9)">Автомобили</option>
                                            <option value="12" data-marker="option(14)">Мотоциклы и мототехника</option>
                                            <option value="13" data-marker="option(81)">Грузовики и спецтехника</option>
                                            <option value="14" data-marker="option(11)">Водный транспорт</option>
                                            <option value="15" data-marker="option(10)">Запчасти и аксессуары</option>
                                            <option value="2" className="category-select-group-y6FfI" data-marker="option(4)">Недвижимость</option>
                                            <option value="21" data-marker="option(24)">Квартиры</option>
                                            <option value="22" data-marker="option(23)">Комнаты</option>
                                            <option value="23" data-marker="option(25)">Дома, дачи, коттеджи</option>
                                            <option value="24" data-marker="option(85)">Гаражи и машиноместа</option>
                                            <option value="25" data-marker="option(26)">Земельные участки</option>
                                            <option value="26" data-marker="option(42)">Коммерческая недвижимость</option>
                                            <option value="27" data-marker="option(86)">Недвижимость за рубежом</option>
                                            <option value="3" className="category-select-group-y6FfI" data-marker="option(110)">Работа</option>
                                            <option value="31" data-marker="option(111)">Вакансии</option>
                                            <option value="32" data-marker="option(112)">Резюме</option>
                                            <option value="4" className="category-select-group-y6FfI" data-marker="option(114)">Услуги</option>
                                            <option value="5" className="category-select-group-y6FfI" data-marker="option(5)">Личные вещи</option>
                                            <option value="51" data-marker="option(27)">Одежда, обувь, аксессуары</option>
                                            <option value="52" data-marker="option(29)">Детская одежда и обувь</option>
                                            <option value="53" data-marker="option(30)">Товары для детей и игрушки</option>
                                            <option value="54" data-marker="option(28)">Часы и украшения</option>
                                            <option value="55" data-marker="option(88)">Красота и здоровье</option>
                                            <option value="6" className="category-select-group-y6FfI" data-marker="option(2)">Для дома и дачи</option>
                                            <option value="61" data-marker="option(21)">Бытовая техника</option>
                                            <option value="62" data-marker="option(20)">Мебель и интерьер</option>
                                            <option value="63" data-marker="option(87)">Посуда и товары для кухни</option>
                                            <option value="64" data-marker="option(82)">Продукты питания</option>
                                            <option value="65" data-marker="option(19)">Ремонт и строительство</option>
                                            <option value="66" data-marker="option(106)">Растения</option>
                                            <option value="7" className="category-select-group-y6FfI" data-marker="option(6)">Бытовая электроника</option>
                                            <option value="71" data-marker="option(32)">Аудио и видео</option>
                                            <option value="72" data-marker="option(97)">Игры, приставки и программы</option>
                                            <option value="73" data-marker="option(31)">Настольные компьютеры</option>
                                            <option value="74" data-marker="option(98)">Ноутбуки</option>
                                            <option value="75" data-marker="option(99)">Оргтехника и расходники</option>
                                            <option value="76" data-marker="option(96)">Планшеты и электронные книги</option>
                                            <option value="77" data-marker="option(84)">Телефоны</option>
                                            <option value="78" data-marker="option(101)">Товары для компьютера</option>
                                            <option value="79" data-marker="option(105)">Фототехника</option>
                                            <option value="8" className="category-select-group-y6FfI" data-marker="option(7)">Хобби и отдых</option>
                                            <option value="81" data-marker="option(33)">Билеты и путешествия</option>
                                            <option value="82" data-marker="option(34)">Велосипеды</option>
                                            <option value="83" data-marker="option(83)">Книги и журналы</option>
                                            <option value="84" data-marker="option(36)">Коллекционирование</option>
                                            <option value="85" data-marker="option(38)">Музыкальные инструменты</option>
                                            <option value="86" data-marker="option(102)">Охота и рыбалка</option>
                                            <option value="87" data-marker="option(39)">Спорт и отдых</option>
                                            <option value="9" className="category-select-group-y6FfI" data-marker="option(35)">Животные</option>
                                            <option value="91" data-marker="option(89)">Собаки</option>
                                            <option value="92" data-marker="option(90)">Кошки</option>
                                            <option value="93" data-marker="option(91)">Птицы</option>
                                            <option value="94" data-marker="option(92)">Аквариум</option>
                                            <option value="95" data-marker="option(93)">Другие животные</option>
                                            <option value="96" data-marker="option(94)">Товары для животных</option>
                                            <option value="a" className="category-select-group-y6FfI" data-marker="option(8)">Готовый бизнес и оборудование</option>
                                            <option value="a1" data-marker="option(116)">Готовый бизнес</option>
                                            <option value="a2" data-marker="option(40)">Оборудование для бизнеса</option>
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group controlId="exampleForm.ControlSelect1">
                                        <Form.Label>Тип объявления</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="itemType"
                                            onBlur={handleBlur}
                                            value={values.itemType}
                                            onChange={handleChange}
                                        >
                                            <option value="1">Уникальное объявление</option>
                                            <option value="2">Неуникальное объявление</option>
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group controlId="exampleForm.ControlSelect1">
                                        <Form.Label>Состояние товара</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="condition"
                                            onBlur={handleBlur}
                                            value={values.condition}
                                            onChange={handleChange}
                                        >
                                            <option value="1">Новая вещь</option>
                                            <option value="2">Бывшая в употреблении</option>
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group controlId="exampleForm.ControlInput1">
                                        <Form.Label>Количество товаров</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="amount"
                                            onBlur={handleBlur}
                                            value={values.amount}
                                            placeholder="Введите количество товара"
                                            onChange={handleChange}
                                            className={touched.amount && errors.amount ? "has-error" : null}
                                        />
                                        {touched.amount && errors.amount ? (
                                            <div className="error-message">{errors.amount}</div>
                                        ): null}
                                    </Form.Group>
                                    <Form.Group controlId="exampleForm.ControlTextarea1">
                                        <Form.Label>Описание товара</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            name="description"
                                            onBlur={handleBlur}
                                            value={values.description}
                                            onChange={handleChange}
                                            rows={3}
                                            className={touched.description && errors.description ? "has-error" : null}
                                        />
                                        {touched.description && errors.description ? (
                                            <div className="error-message">{errors.description}</div>
                                        ): null}
                                    </Form.Group>
                                    <Form.Group controlId="exampleForm.ControlInput1">
                                        <Form.Label>Адрес</Form.Label>
                                        <Form.Control
                                            id="address"
                                            type="text"
                                            name="address"
                                            onBlur={handleBlur}
                                            value={values.address.addressName}
                                            placeholder="Введите адрес"
                                            onChange={handleChange}
                                            className={touched.address && errors.address ? "has-error" : null}
                                        />
                                        {touched.address && errors.address ? (
                                            <div className="error-message">{errors.address}</div>
                                        ): null}
                                    </Form.Group>
                                    <Form.Group controlId="exampleForm.ControlInput1">
                                        <Form.Label>Стоимость товара</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="price"
                                            placeholder="Введите стоимость "
                                            onBlur={handleBlur}
                                            value={values.price}
                                            onChange={handleChange}
                                            className={touched.price && errors.price ? "has-error" : null}
                                        />
                                        {touched.price && errors.price ? (
                                            <div className="error-message">{errors.price}</div>
                                        ): null}
                                    </Form.Group>
                                    <Button variant="primary" type="submit">
                                        Далее
                                    </Button>
                                </Form>
                            </div>
                        </Row>
                    )}
                </Formik>
            </Container>
        )
    }
}

export default NewItem;