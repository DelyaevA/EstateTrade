import React, {Component} from "react";
import {activate, login} from "../../util/APIUtils";
import {ACCESS_TOKEN} from "../../constants";
import {toast} from "react-toastify";

class ActivateUser extends Component {


    constructor(props) {
        super(props);
        this.activateUser = this.activateUser.bind(this);
    }

    componentDidMount() {
        const code = this.props.match.params.code;
        this.activateUser(code);
    }

    activateUser(code) {
        activate(code)
            .then(response => {
                toast.success(
                    "Вы успешно верифицировали свою почту!",
                    {position: toast.POSITION.BOTTOM_LEFT}
                    );
                localStorage.setItem(ACCESS_TOKEN, response.accessToken);
                this.props.history.push("/");
            });
    }
    render() {
        return(
            <div>Activate user</div>
        )
    }
}

export default ActivateUser;
