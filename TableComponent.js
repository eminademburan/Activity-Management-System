import React, {Component} from "react";
import ReactTable from 'react-table-6';
import 'react-table-6/react-table.css';
import axios from "axios";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from '@material-ui/core/IconButton';
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

class TableComponent extends Component {
    constructor() {
        super();
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

    editRow(name) {
        const index = this.state.data.findIndex( datum =>  {return datum.name === name});
        let newName = prompt("Lütfen isminizi giriniz ");
        let startDate =prompt('Başlangıç tarihini giriniz ', 'GG/AA/YYYY');
        let endDate = prompt('Bitiş tarihini giriniz ', 'GG/AA/YYYY');
        let capacity = parseInt( prompt('Kontenjanı giriniz ') );
        let currentData = [...this.state.data];
        let newData = {
            name: newName,
            startDate: startDate,
            endDate: endDate,
            capacity: capacity
        };
        axios.put("/event/" + name, newData)
            .then(response => {
                console.log(response.data);
                currentData[index] = response.data;
                this.setState({data: currentData});
                this.snackbarOpen("Etkinlik bilgileri başarıyla değiştirildi!", "success");
            })
            .catch(error => {
                if (error.response.status === 400) {
                    this.snackbarOpen(error.response.data.errors[0].defaultMessage, "error")
                }
                console.log(error.response);
            });
    }

    deleteRow(name) {
        const index = this.state.data.findIndex( datum =>  {return datum.name === name});
        let currentData = [...this.state.data];
        currentData.splice(index,1);
        this.setState({
            data: currentData
        });
        axios.delete("/event/" + name)
            .then(response => {
                console.log(response.data);
                this.snackbarOpen("Etkinlik başarıyla silindi!", "success");
            })
    }

    soruEkle(name) {
        let newName = prompt("Lütfen eklemek istediğiniz soruyu giriniz!");
        axios.post("/event/" + name + "/question", newName)
            .then(response => {
                console.log(response.data);
                this.snackbarOpen("Soru başarıyla eklendi!", "success");
            })
    }

    myClickEvent = () => {
        let name = prompt("Lütfen etkinliğin ismini giriniz ");
        let startDate =prompt('Başlangıç tarihini giriniz ', 'GG/AA/YYYY');
        let endDate = prompt('Bitiş tarihini giriniz ', 'GG/AA/YYYY');
        let capacity = parseInt( prompt('Kontenjanı giriniz ') );
        let currentData = [...this.state.data];
        let dateStart = stringToDate(startDate);
        let dateEnd = stringToDate(endDate);
        let newData = {
            name: name,
            startDate: startDate,
            endDate: endDate,
            capacity: capacity
        };
        const index = this.state.data.findIndex( datum =>  {return datum.name === name});
        if( index !== -1) {
            this.snackbarOpen("Aynı isimli birden fazla etkinlik olamaz!", "error");
        }
        else if( !capacity) {
            this.snackbarOpen("Etkinliğin kontenjanı boş olamaz!", "error");
        }
        else if( isNaN(capacity)) {
            this.snackbarOpen("Etkinliğin kontenjanı bir sayı olmak zorunda!", "error");
        }
        else if( isNaN(dateEnd) || isNaN(dateStart)) {
            this.snackbarOpen("Lütfen tarihleri GG/AA/YYYY şeklinde giriniz!", "error");
        }
        else if(dateStart > dateEnd) {
            this.snackbarOpen("Başlangıç tarihi bitiş tarihinden sonra olamaz!", "error");
        }
        else {
            axios.post("/event", newData)
                .then( response => {
                    currentData.push(newData);
                    this.setState({data:currentData});
                    this.snackbarOpen("Etkinlik başarıyla eklendi!", "success");
                })
                .catch(error => {
                    if (error.response.status === 400) {
                        this.snackbarOpen(error.response.data.errors[0].defaultMessage, "error")
                    }
                    console.log(error.response);
                })
        }
    };

    render() {
        const columns = [
            {
                Header: "Etkinliği Düzenle",
                Cell: props =>{
                    return(<IconButton color="primary" onClick={() => this.editRow(props.original.name)}><EditIcon/></IconButton>)
                },
                filterable: false,
                sortable: false,
                width: 200,
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
                Header: "Delete",
                Cell: props =>{
                    return(<IconButton color="primary" onClick={() => this.deleteRow(props.original.name)}><DeleteIcon/></IconButton>)
                },
                filterable: false,
                sortable: false,
                width: 100,
                resizable: false
            },
            {
                Header: "Soru ekle",
                Cell: props =>{
                    return(<IconButton color="primary" onClick={() => this.soruEkle(props.original.name)}>Soru ekle</IconButton>)
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
            <Button variant="contained" color="primary" onClick={() => this.myClickEvent()}>Etkinlik Ekle</Button>
        </div>;
    }
}

function stringToDate( str ) {
    if ( str == null )
        return null
    else
        return new Date ( str.substring( 3,5 ) + "/" + str.substring( 0, 2 ) + "/" + str.substring( 6, 10 ) );
}

export default TableComponent;
