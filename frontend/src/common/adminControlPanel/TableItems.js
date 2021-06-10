import React, {Component} from "react";
import {Button, Nav, Table} from "react-bootstrap";
import {CATEGORY, USER_LIST_SIZE} from "../../constants";
import {getAllItems, getAllItemsForAdmin, getAllUsers} from "../../util/APIUtils";
import {Link} from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";


class TableItems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: false
        };
        this.loadAllItems = this.loadAllItems.bind(this);
    }

    loadAllItems(page = 0, size = USER_LIST_SIZE) {
        let promise;
        promise = getAllItemsForAdmin(page, size);

        if(!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });

        promise
            .then(response => {
                const items = this.state.items.slice();

                this.setState({
                    items: items.concat(response.content),
                    page: response.page,
                    size: response.size,
                    totalElements: response.totalElements,
                    totalPages: response.totalPages,
                    last: response.last,
                    isLoading: false
                })
            }).catch(error => {
            this.setState({
                isLoading: false
            })
        });

    }

    componentDidMount() {
        this.loadAllItems();
    }


    render() {
        const products = [];
        const columns = [{
            dataField: 'name',
            text: 'Загаловок',
            sort: true
        }, {
            dataField: 'category',
            text: 'Категория',
            sort: true

        }, {
            dataField: 'price',
            text: 'Цена',
            sort: true
        }, {
            dataField: 'isModerated',
            text: 'Модерация',
            sort: true
        },{
            dataField: 'link',
            text: 'Ссылка',
            sort: true
        }];
        this.state.items.forEach((item, itemIndex) => {
            let isModerated = item.isModerated ? "просмотренно" : "непросмотренно";
            products.push({
                name: item.name,
                category: CATEGORY[item.category],
                isModerated: isModerated,
                price: item.price,
                link: <Nav.Link as={Link} to={"/admin-control-panel/items/" + item.id}>#</Nav.Link>
            })
        });
        return (
            <div className={"table-items block"}>
                <BootstrapTable keyField='id' data={ products } columns={ columns } pagination={ paginationFactory() } />
            </div>
        )
    }
}

export default TableItems;
