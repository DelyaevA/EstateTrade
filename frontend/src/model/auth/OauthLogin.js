import React, {Component} from "react";
import {toast} from "react-toastify";
import {ACCESS_TOKEN} from "../../constants";
import {oauth2Login} from "../../util/APIUtils";


class OauthLogin extends Component {

    constructor(props) {
        super(props);
        this.oauthLogin = this.oauthLogin.bind(this);
    }

    componentDidMount() {
        const code = this.props.match.params.code;
        this.oauthLogin(code);
    }

    oauthLogin(code) {
        localStorage.setItem(ACCESS_TOKEN, code);
        this.props.history.push("/");
        /*oauth2Login(code)
            .then(response => {
                localStorage.setItem(ACCESS_TOKEN, response.accessToken);
                this.props.onLogin();
                toast.success(
                    "Успешно!",
                    {position: toast.POSITION.TOP_RIGHT});
                localStorage.setItem(ACCESS_TOKEN, response.accessToken);
                this.props.history.push("/");
            });*/
    }
    render() {
        return(
            <div>Oauth Login</div>
        )
    }
}

export default OauthLogin;