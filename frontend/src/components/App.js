import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";

import StartPage from "./StartPage";
import Dashboard from "./Dashboard";
import ListPage from "./ListPage";
import LogInPage from "./LogInPage";
import SignUpPage from "./SignUpPage";
import AdminPage from "./AdminPage";

class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      isLogged: false
    }
  }

  //this component creates the app routing system 

  render() {
    return(
      <BrowserRouter>
        <Routes>
          <Route exact path = "/" element = {<StartPage/>}/>
          <Route exact path = "/dashboard" element = {<Dashboard/>}/>
          <Route exact path = "/list" element = {<ListPage/>}/>
          <Route exact path = "/admin/login" element = {<LogInPage/>}/>
          <Route exact path = "/admin/signup" element = {<SignUpPage/>}/>
          <Route exact path = "/admin/page" element = {<AdminPage/>}/>
        </Routes>
      </BrowserRouter>
    )
  }
}

export default App;
