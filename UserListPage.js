import React, {Component} from "react";
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import axios from "axios";
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from "@material-ui/icons/Delete";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

class UserListPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            snackbarProperties: {
                isOpen: false,
                message: "",
                severity: ""
            }
        }
    }

    componentDidMount() {
        console.log(this.props.name);
        axios.get("/event/" + this.props.name + "/users")
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

    deleteRow(name) {
        const index = this.state.data.findIndex( datum =>  {return datum.tckimlikNo === name});
        let currentData = [...this.state.data];
        currentData.splice(index,1);
        axios.delete("/event/" + this.props.name + "/" + name)
            .then(response => {
                console.log(response.data);
                this.setState({data: currentData});
                this.snackbarOpen("Kullanıcı başarıyla silindi!", "success");
            })

    }
    render() {
        const columns = [
            {
                Header: "Delete",
                Cell: props =>{
                    return(<IconButton color = "primary" onClick={() => this.deleteRow(props.original.tckimlikNo)}><DeleteIcon/></IconButton>)
                },
                filterable: false,
                sortable: false,
                width: 100,
                resizable: false
            },
            {
                Header: "İsim",
                accessor: "name",
                resizable: false
            },
            {
                Header: "Soyisim",
                accessor: "surname",
                resizable: false
            },
            {
                Header: "Yaş",
                accessor: "age",
                resizable: false
            },
            {
                Header: "TCKimlikNo",
                accessor: "tckimlikNo",
                resizable: false,
                sortable: false
            }
        ];
        return <div> <ReactTable columns ={columns} data = {this.state.data} filterable
                                 noDataText = {"Etkinliğe kayıtlı kullanıcı bulunmamaktadır."} defaultPageSize = {10}/>
            <Snackbar open={this.state.snackbarProperties.isOpen} autoHideDuration={3000} onClose={this.snackbarClose}
                      anchorOrigin={{vertical: 'top', horizontal: 'right'}}>
                <Alert onClose={this.snackbarClose} severity={this.state.snackbarProperties.severity}>
                    {this.state.snackbarProperties.message}
                </Alert>
            </Snackbar>
        </div>;
    }
}

export default UserListPage;