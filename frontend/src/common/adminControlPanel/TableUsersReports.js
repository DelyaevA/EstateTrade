import React, {Component} from "react";
import {USER_LIST_SIZE} from "../../constants";
import {getAllItemsWithReports, getAllUsersWithReports} from "../../util/APIUtils";
import {Nav} from "react-bootstrap";
import {Link} from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";


class TableUsersReports extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: false
        };
        this.loadAllUsers = this.loadAllUsers.bind(this);
    }

    loadAllUsers(page = 0, size = USER_LIST_SIZE) {
        let promise;
        promise = getAllUsersWithReports(page, size);

        if(!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });

        promise
            .then(response => {
                const users = this.state.users.slice();

                this.setState({
                    users: users.concat(response.content),
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
        this.loadAllUsers();
    }


    render() {
        const products = [];
        const columns = [{
            dataField: 'username',
            text: 'Никнейм',
            sort: true
        }, {
            dataField: 'email',
            text: 'Email',
            sort: true
        },{
            dataField: 'reports',
            text: 'Кол-во жалоб',
            sort: true
        }, {
            dataField: 'link',
            text: 'Ссылка',
            sort: true
        }];
        this.state.users.forEach((user, userIndex) => {
            products.push({
                userId: user.userId.length <= 15 ? user.userId : user.userId.slice(0, 15) + "...",
                username: user.username,
                email: user.email,
                reports: user.reports.length,
                link: <Nav.Link as={Link} to={"/admin-control-panel/users/" + user.username}>#</Nav.Link>
            })
        });
        return (
            <div className={"table-users block"}>
                <BootstrapTable keyField='id' data={ products } columns={ columns } pagination={ paginationFactory() } />
            </div>
        )
    }
}

export default TableUsersReports;