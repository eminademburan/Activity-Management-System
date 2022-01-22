import React, {Component} from "react";
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import IconButton from '@material-ui/core/IconButton';
import ListIcon from "@material-ui/icons/List";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import axios from "axios";

class UserPage extends Component {
    constructor() {
        super();
        this.state = {
            data: [ {
                name: "",
                startDate: "",
                endDate: "",
                capacity: 1,
                questions: []
            }],
            name: "",
            snackbarProperties: {
                isOpen: false,
                message: "",
                severity: ""
            }
        }
    }

    componentDidMount() {
        axios.get("/event")
            .then(response => {
                this.setState({data: response.data})
                console.log(response.data);
            })
    }

    snackbarOpen = (message, severity) => {
        console.log(message, severity);
        this.setState(prevState => {
            let snackbarProperties = {...prevState.snackbarProperties}
            snackbarProperties.isOpen = true;
            snackbarProperties.message = message;
            snackbarProperties.severity = severity;
            return {snackbarProperties};
        })
    }

    snackbarClose = () => {
        this.setState(prevState => {
            let snackbarProperties = {...prevState.snackbarProperties}
            snackbarProperties.isOpen = false;
            snackbarProperties.message = "";
            snackbarProperties.severity = "";
            return {snackbarProperties};
        })
    }

    sec(name) {
        this.setState({name: name}, () => window.location.href="http://localhost:3000/userList");
    }


    basvur(eventName) {
        const index = this.state.data.findIndex( datum =>  {return datum.name === eventName});
        let length = this.state.data[index].questions.length;
        var i;

        let questionAnswers = [];
        for (i = 0; i < length; i++) {
            let answer = prompt(this.state.data[index].questions[i]);
            questionAnswers.push(answer);
        }
        let name = prompt("Lütfen isminizi giriniz ");
        let surname =prompt("Lütfen soyadınızı giriniz ");
        let age = parseInt( prompt("Lütfen yaşınızı giriniz ") );
        let TCKimlikNo = prompt("Lütfen TC Kimlik numaranızı giriniz ");
        let email = prompt("Lütfen emailinizi giriniz ");
        let newUser = {
            name: name,
            surname: surname,
            age: age,
            TCKimlikNo: TCKimlikNo,
            email: email,
            questionAnswers: questionAnswers
        };
        axios.post("/event/" + eventName + "/users", newUser)
            .then( response => {
                this.snackbarOpen("Etkinliğe başarıyla başvuruldu!", "success");
                console.log(response);
                const index = this.state.data.findIndex( datum =>  {return datum.name === eventName});
                let currentData = [...this.state.data];
                currentData[index].capacity--;
                let newData = currentData[index];
                this.setState({data:currentData});
            })
            .catch(error => {
                if (error.response.status === 400) {
                    this.snackbarOpen(error.response.data.errors[0].defaultMessage, "error")
                }
                console.log(error.response);
            });

        /*
        axios.put("/event/" + eventName, newData)
                    .then(response => {
                      console.log(response.data);
                      currentData[index] = response.data;
                    this.setState({data: currentData});
                    });
        */
    }


    render() {
        const columns = [
            {
                Header: "Seç",
                Cell: props =>{
                    return(<IconButton onClick={() => this.sec(props.original.name)}><ListIcon color = "primary"/></IconButton>)
                },
                filterable: false,
                sortable: false,
                width: 100,
                resizable: false
            },
            {
                Header: "Etkinlik adı",
                accessor: "name",
                resizable: false
            },
            {
                Header: "Başlangıç tarihi",
                accessor: "startDate",
                resizable: false
            },
            {
                Header: "Bitiş tarihi",
                accessor: "endDate",
                resizable: false
            },
            {
                Header: "Kontenjan",
                accessor: "capacity",
                resizable: false,
                sortable: false
            },
            {
                Header: "",
                Cell: props =>{
                    return(<Button variant="contained" color="primary" onClick={() => this.basvur(props.original.name)}>Başvur</Button>)
                },
                filterable: false,
                sortable: false,
                width: 100,
                resizable: false
            }
        ];
        return <div> <ReactTable columns ={columns} data = {this.state.data} filterable
                                 noDataText = {"Etkinlik bulunmamaktadır."} defaultPageSize = {10}/>
            <Snackbar open={this.state.snackbarProperties.isOpen} autoHideDuration={5000} onClose={this.snackbarClose}
                      anchorOrigin={{vertical: 'top', horizontal: 'right'}}>
                <Alert onClose={this.snackbarClose} severity={this.state.snackbarProperties.severity}>
                    {this.state.snackbarProperties.message}
                </Alert>
            </Snackbar>
        </div>;
    }
}

export default UserPage;
