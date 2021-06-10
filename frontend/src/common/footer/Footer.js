import React, {Component} from "react";
import './Footer.css'
import {Col, Container, Row} from "react-bootstrap";

class Footer extends Component {
    render() {
        return (
            <div className={'footer-wrapper'}>
                <Container className={"footer"}>
                    <Row>
                        <Col xs={3}>
                            <div className={'title title-4'}>Создатели</div>
                            <div className={'paragraph'}>Пятайкин Д.И.</div>
                            <div className={'paragraph'}>Сухочев М.Ю.</div>
                            <div className={'paragraph'}>Деляев А.Ю.</div>
                        </Col>
                        <Col xs={3}>
                            <div className={'title title-4'}>Контакты</div>
                            <div className={'paragraph'}>netcrackerat@gmail.com</div>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default Footer
