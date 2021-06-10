import React, {Component} from "react";
import {Table} from "react-bootstrap";
import {USER_LIST_SIZE} from "../../constants";
import {createItem, deleteUser, getAllUsers} from "../../util/APIUtils";
import {Button, Dropdown, Nav, Navbar} from "react-bootstrap";
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

class TableUsers extends Component {
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
        this.delete = this.delete.bind(this);
    }

    loadAllUsers(page = 0, size = USER_LIST_SIZE) {
        let promise;
        promise = getAllUsers(page, size);

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
                console.log(this.state.users);
            }).catch(error => {
            this.setState({
                isLoading: false
            })
        });

    }

    componentDidMount() {
       this.loadAllUsers();

    }

    delete(event) {
        deleteUser(event.name.split(" ")[1])
            .then(response => {
                toast.success(
                    "Пользователь успешно удален!",
                    {position: toast.POSITION.BOTTOM_LEFT}
                )
                let users = this.state.users;
                users.splice(parseInt(event.name.split(" ")[0]), 1);
                this.setState({
                    users: users
                })
            }).catch(error => {
            if (error.status === 401) {
                toast.error(
                    "Unauthorized!",
                    {position: toast.POSITION.BOTTOM_LEFT}
                )
                console.log("Your Username or Password is incorrect. Please try again!")
            } else {
                toast.error(
                    error.message || 'Что то пошло не так!',
                    {position: toast.POSITION.BOTTOM_LEFT}
                )
            }
        });
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

export default TableUsers;
