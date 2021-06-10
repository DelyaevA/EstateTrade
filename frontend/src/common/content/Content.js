import React, {Component} from "react";
import Sidebar from "./Sidebar";
import "./Content.css"
import ItemList from "../../model/item/ItemList";
import {Badge, Button, Col, Container, Form, FormControl} from "react-bootstrap";
import {Formik} from "formik";
import {VALIDATION_CHANGE_AUTHORITY_SCHEMA, VALIDATION_SEARCH} from "../../model/auth/validatonShema";
import {changeAuthority} from "../../util/APIUtils";
import AuctionList from "../../model/auction/AuctionList";

class Content extends Component {
    constructor() {
        super();
        this.state = {
            searchOptions: null,
            itemFlag: true,
            auctionFlag: true
        }
        this.changeSearchOptions = this.changeSearchOptions.bind(this);
        this.onlyItems = this.onlyItems.bind(this);
        this.onlyAuctions = this.onlyAuctions.bind(this);
    }

    changeSearchOptions(searchOptions) {
        this.setState({
            searchOptions: searchOptions
        });
    }

    onlyItems(){
        this.setState({
            itemFlag: true,
            auctionFlag: false
        })
    }

    onlyAuctions(){
        this.setState({
            itemFlag: false,
            auctionFlag: true
        })
    }

    render() {
        return (
            <Container className="main-content" style={{marginTop: "1em"}}>
                <Container className={"search"}>
                    <Formik
                        initialValues={{query: "", category: "", minPrice: "", maxPrice: ""}}
                        validationSchema={VALIDATION_SEARCH}
                        onSubmit={(values, {setSubmitting, resetForm}) => {
                            console.log(JSON.stringify(values));
                            this.changeSearchOptions(values);
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
                                <h4>ПОДБОР ПО ПАРАМЕТРАМ</h4>
                                <Form className={"search-form"} onSubmit={handleSubmit}>
                                    <Form.Row>
                                        <Form.Group as={Col}>
                                            <FormControl
                                                type="text"
                                                className="mr-sm-2"
                                                name="query"
                                                placeholder="Например, PS4"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.request}
                                            />
                                        </Form.Group>
                                        <Col>
                                            <Button variant="outline-success"  type="submit">Найти</Button>
                                        </Col>
                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Group id="formGridCheckbox">
                                            <Form.Check onClick={this.onlyItems} type="checkbox" style={{marginLeft: "7px"}} label="Объявления" />
                                        </Form.Group>
                                        <Form.Group id="formGridCheckbox">
                                            <Form.Check onClick={this.onlyAuctions} type="checkbox" style={{marginLeft: "15px"}} label="Аукционы" />
                                        </Form.Group>
                                    </Form.Row>
                                    <h5>Цена</h5>
                                    <Form.Row>
                                        <Form.Group as={Col} sm={2}>
                                            <Form.Label>от</Form.Label>
                                            <FormControl
                                                type="number"
                                                className="mr-sm-2"
                                                name="minPrice"
                                                min="0"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.request}
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col} sm={2}>
                                            <Form.Label>до</Form.Label>
                                            <FormControl
                                                type="number"
                                                min="0"
                                                className="mr-sm-2"
                                                name="maxPrice"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.request}
                                            />
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Group as={Col} sm={4}>
                                            <Form.Label><h5>Категория</h5></Form.Label>
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
                                    </Form.Row>
                                </Form>
                            </div>
                        )}
                    </Formik>
                </Container>
                {
                    this.state.searchOptions && this.state.itemFlag === true ? (
                        <ItemList searchOptions={this.state.searchOptions} type={"OFFERS_BY_SEARCH_PARAMS"}/>
                    ) : (
                        <ItemList type={"ALL_OFFERS"}/>
                    )
                }
                {
                    this.state.searchOptions && this.state.auctionFlag === true ? (
                        <div style={{marginTop: '10px'}}>
                            <AuctionList searchOptions={this.state.searchOptions} type={"OFFERS_BY_SEARCH_PARAMS"}/>
                        </div>

                    ) : (
                        <div style={{marginTop: '10px'}}>
                            <AuctionList type={"ALL_OFFERS"}/>
                        </div>

                    )
                }
            </Container>
        )
    }
}

export default Content;
