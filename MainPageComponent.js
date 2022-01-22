import React, {Component} from "react";
import ReactTable from 'react-table-6'
import 'react-table-6/react-table.css'

class MainPageComponent extends Component {
    state = {
        myCounter: 6,
        data: [
            {
                name: "1",
                startDate: "09.07.2020",
                endDate: "05.05.2021",
                capacity: 5
            },
            {
                name: "2",
                startDate: "09.07.2020",
                endDate: "05.05.2021",
                capacity: 5
            },
            {
                name: "3",
                startDate: "09.07.2020",
                endDate: "05.05.2021",
                capacity: 5
            },
            {
                name: "4",
                startDate: "09.07.2020",
                endDate: "05.05.2021",
                capacity: 5
            },
            {
                name: "5",
                startDate: "09.07.2020",
                endDate: "05.05.2021",
                capacity: 5
            },
            {
                name: "6",
                startDate: "09.07.2020",
                endDate: "05.05.2021",
                capacity: 5
            },
        ]
    };

    render() {
        const data = [
            {

            }
        ];
        const columns = [
            {
                Header: "Kontenjan",
                accessor: "capacity",
                resizable: false,
                sortable: false
            },
            {
                Header: "Delete",
                Cell: props =>{
                    return(<button onClick={() => this.deleteRow(props.original.name)}>Delete</button>)
                },
                filterable: false,
                sortable: false,
                width: 100,
                resizable: false
            }
        ];
        return <div> <ReactTable columns ={columns} data = {this.state.data} filterable
                                 noDataText = {"Etkinlik bulunmamaktadır."} defaultPageSize = {10}/>
            <button onClick={() => this.myClickEvent()} >add element</button> </div>;
    }
}

export default MainPageComponent;