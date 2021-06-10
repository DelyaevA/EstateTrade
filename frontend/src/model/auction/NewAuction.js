import React, {Component} from "react";
import {Button, Container, Form, Row} from "react-bootstrap";
import {createAuction, formatDate, getAuction} from "../../util/APIUtils";
import {Formik} from "formik";
import {toast} from "react-toastify";
import './NewAuction.css'
import {VALIDATION_NEW_AUCTION} from "../auth/validatonShema";
import AuctionPicture from "./AuctionPicture";

class NewAuction extends Component {
    constructor() {
        super();
        this.state = {auctionLoad: true, auction: null};
        this.changeState = this.changeState.bind(this);
    }

    changeState(auction, auctionR) {
        console.log(JSON.stringify(auction), auctionR);
        this.setState({auctionLoad: false, auction: auction, auctionId: auctionR.id});
    }

    render() {
        return(
            <div>
                {
                    this.state.auctionLoad? (<AuctionForm callback={this.changeState}/>): (<AuctionPicture auctionId={this.state.auctionId}/>)
                }
            </div>
        )
    }

}

class AuctionForm extends Component {
    constructor(props) {
        super(props);
        this.state = {file: '',imagePreviewUrl: '', minP: "", maxP: ""};
    }

    validationPrice(){
        if (this.state.minP > this.state.maxP){
            return alert("Сумма выкупа не может быть меньше, чем начальная цена!")
        }
    }

    _handleSubmit(e) {
        e.preventDefault();
        // TODO: do something with -> this.state.file
        console.log('handle uploading-', this.state.file);
    }

    _handleImageChange(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                file: file,
                imagePreviewUrl: reader.result
            });
        }

        reader.readAsDataURL(file)
    }

    loadAuction(auctionId) {
        this.setState({
            isLoading: true
        });

        getAuction(auctionId)
            .then(response => {
                this.setState({
                    auction: response,
                    //TODO:Сделать чтобы дата была в state.auction, а не в state (Через setState)
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

    render() {
        return(
            <Container>
                <Formik
                    initialValues={{name:"", category:"", condition:"1", description:"", address:"", minPrice:"", duration: "1", endPrice: ""}}
                    validationSchema={VALIDATION_NEW_AUCTION}
                    onSubmit={(values, {setSubmitting, resetForm}) => {
                        createAuction(values)
                            .then(response => {
                                toast.success(
                                    "Аукцион успешно создан!",
                                    {position: toast.POSITION.BOTTOM_LEFT}
                                )
                                this.props.callback(values, response)


                            }).catch(error => {
                            if(error.status === 401) {
                                toast.error(
                                    "Форма заполнена некорректно. Попробуйте снова!",
                                    {position: toast.POSITION.BOTTOM_LEFT}
                                )
                                console.log("Your Username or Password is incorrect. Please try again!")
                            } else {
                                toast.error(
                                    error.message || "Упс! Что-то пошло не так. Попробуйте снова!",
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
                            <div className={"form block"}>
                                <Form
                                    style={{width:"60%", justifyContent:"center"}}
                                    onSubmit={handleSubmit}>
                                    <h2>Создание аукциона</h2>
                                    <Form.Group controlId="exampleForm.ControlInput1">
                                        <Form.Label>Заголовок аукциона</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            onBlur={handleBlur}
                                            value={values.name}
                                            placeholder="Введите заголовок аукциона"
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
                                        <Form.Label>Состояние товара</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="condition"
                                            onBlur={handleBlur}
                                            defaultValue="1"
                                            value={values.condition}
                                            onChange={handleChange}
                                        >
                                            <option value="1" data-marker="option(1)">Новая вещь</option>
                                            <option value="2" data-marker="option(2)">Бывшая в употреблении</option>
                                        </Form.Control>
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
                                            id = "address"
                                            type="text"
                                            name="address"
                                            onBlur={handleBlur}
                                            value={values.address}
                                            placeholder="Введите адрес"
                                            onChange={handleChange}
                                            className={touched.address && errors.address ? "has-error" : null}
                                        />
                                        {touched.address && errors.address ? (
                                            <div className="error-message">{errors.address}</div>
                                        ): null}
                                    </Form.Group>
                                    <Form.Group controlId="exampleForm.ControlSelect1">
                                        <Form.Label>Продолжительность аукциона</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="duration"
                                            onBlur={handleBlur}
                                            defaultValue="1"
                                            value={values.duration}
                                            onChange={handleChange}
                                        >
                                            <option value="1" data-marker="option(1)">1 день</option>
                                            <option value="3" data-marker="option(2)">3 дня</option>
                                            <option value="5" data-marker="option(3)">5 дней</option>
                                            <option value="7" data-marker="option(4)">7 дней</option>
                                            <option value="10" data-marker="option(5)">10 дней</option>
                                            <option value="15" data-marker="option(6)">15 мин</option>
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group controlId="exampleForm.ControlInput1">
                                        <Form.Label>Начальная стоимость товара</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="minPrice"
                                            placeholder="Введите начальную стоимость "
                                            onBlur={handleBlur}
                                            value={values.minPrice}
                                            onChange={handleChange}
                                            className={touched.minPrice && errors.minPrice ? "has-error" : null}
                                        />
                                        {touched.minPrice && errors.minPrice ? (
                                            <div className="error-message">{errors.minPrice}</div>
                                        ): null}
                                    </Form.Group>
                                    <Form.Group controlId="exampleForm.ControlInput1">
                                        <Form.Label>Стоимость выкупа товара</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="endPrice"
                                            placeholder="Введите стоимость выкупа"
                                            onBlur={handleBlur}
                                            value={values.endPrice}
                                            onChange={handleChange}
                                            className={touched.endPrice && errors.endPrice ? "has-error" : null}
                                        />
                                        {touched.endPrice && errors.endPrice ? (
                                            <div className="error-message">{errors.endPrice}</div>
                                        ): null}
                                    </Form.Group>
                                    <Button onSubmit={this.validationPrice} variant="primary" type="submit">
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

export default NewAuction;
