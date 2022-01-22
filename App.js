import React from 'react';
import TableComponent from "./TableComponent";
import UserPage from "./UserPage";
import UserListPage from "./UserListPage";
import './What.css';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";



function Page() {
    return <div> <h3> Etkinlik yönetim formuna hoşgeldiniz. </h3>
        <Link to="/admin"> Yönetici Sayfası </Link> <br/>
        <Link to="/user"> Üye Sayfası</Link>
    </div>;
}

function AdminPage() {
    return <div> <h3> Yönetici Sayfası </h3> <Link to="/">Anasayfa</Link> <br/> <br/> <TableComponent/> </div>;
}

function UserPagef() {
    return <div> <h3> Üye Sayfası </h3> <Link to="/">Anasayfa</Link> <br/> <br/> <UserPage/> </div>;
}

function UserList() {
    return <div> <h3> Staj Etkinliğinin Katılımcıları </h3> <Link to="/">Anasayfa</Link> <br/> <Link to="/user">Üye sayfası</Link> <br/> <br/> <UserListPage name = "Staj"/> </div>;
}



function App() {
    //var name;
    return (
        <Router>
            <div className="App">
                <h1> Etkinlik Yönetim Platformu </h1>
                <Route path="//" component={Page} />
                <Route path="/admin" component={AdminPage} />
                <Route path="/user" component={UserPagef} />
                <Route path="/userlist" component={UserList} />
            </div>
        </Router>
    );
}

export default App;
