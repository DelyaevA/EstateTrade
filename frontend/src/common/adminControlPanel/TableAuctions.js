import React, {Component} from "react";
import {Button, Nav, Table} from "react-bootstrap";
import {CATEGORY, USER_LIST_SIZE} from "../../constants";
import {getAllItems, getAllAuctionsForAdmin, getAllUsers} from "../../util/APIUtils";
import {Link} from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";


class TableAuctions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            auctions: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: false
        };
        this.loadAllAuctions = this.loadAllAuctions.bind(this);
    }

    loadAllAuctions(page = 0, size = USER_LIST_SIZE) {
        let promise;
        promise = getAllAuctionsForAdmin(page, size);

        if (!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });

        promise
            .then(response => {
                const auctions = this.state.auctions.slice();

                this.setState({
                    auctions: auctions.concat(response.content),
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
        this.loadAllAuctions();
    }


    render() {
        const products = [];
        const columns = [{
            dataField: 'name',
            text: 'Заголовок',
            sort: true
        }, {
            dataField: 'category',
            text: 'Категория',
            sort: true

        }, {
            dataField: 'isModerated',
            text: 'Модерация',
            sort: true
        }, {
            dataField: 'isFreeze',
            text: 'Заморозка',
            sort: true
        }, {
            dataField: 'link',
            text: 'Ссылка',
            sort: true
        }];
        this.state.auctions.forEach((auction, itemIndex) => {
            let isModerated = auction.isModerated ? "просмотренно" : "непросмотренно";
            let isFreeze = auction.isFreeze ? "заморожено" : "незаморожено";
            products.push({
                auctionId: auction.id.length <= 15 ? auction.id : auction.id.slice(0, 15) + "...",
                name: auction.name,
                category: CATEGORY[auction.category],
                isModerated: isModerated,
                isFreeze: isFreeze,
                link: <Nav.Link as={Link} to={"/admin-control-panel/auctions/" + auction.id}>#</Nav.Link>
            })
        });
        return (
            <div className={"table-auctions block"}>
                <BootstrapTable keyField='id' data={ products } columns={ columns } pagination={ paginationFactory() } />
            </div>
        )
    }
}

export default TableAuctions;
