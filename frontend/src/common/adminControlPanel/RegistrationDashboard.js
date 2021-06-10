import React, {Component} from 'react';
import {Bar} from 'react-chartjs-2'
import {formatDate, formatLabels, getItem, getRegistrationData} from "../../util/APIUtils";
class RegistrationDashboard extends Component {
    constructor() {
        super();
        this.state = {
            data: null
        }
        this.loadRegistrationData = this.loadRegistrationData.bind(this);
    }

    loadRegistrationData() {
        this.setState({
            isLoading: true
        });

        getRegistrationData()
            .then(response => {
                this.setState({
                    data: response,
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
        this.loadRegistrationData();
    }

    render() {
        return (
            <div className={"dashboard block"}>
                {
                    this.state.data ? (
                        <Bar
                            data={{
                                labels: formatLabels(this.state.data.x),
                                datasets: [{
                                    label: '# Зарегистрированных пользователей в сутки',
                                    data: this.state.data.y,
                                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                    borderColor: 'rgba(255, 99, 132, 1)',
                                    borderWidth: 1,
                                }]
                            }}
                            height={400}
                            width={600}
                            options={{
                                scales: {
                                    yAxes: [{
                                        ticks: {
                                            beginAtZero: true,
                                            stepSize: 1
                                        }
                                    }]
                                },
                            }}
                        />
                    ) : (
                        <div>Data is not loaded</div>
                    )
                }
            </div>
        )
    }
}

export default RegistrationDashboard;
