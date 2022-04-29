import React from "react";
import style from "../css/StartPage.module.css";
import {Navigate} from "react-router-dom";

    //login page for the admins

class StartPage extends React.Component{
    constructor(){
        super();
        this.state = ({
            nickname: "",
            password: "",
            // link_server: "http://localhost:5000",
            link_server: "https://infoworld-project-cafe.herokuapp.com",
            loggedin: false
        })
    }

    onChangeHandler = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }


    async send_login_data()
    {
        let response = await fetch(this.state.link_server + "/administration/login", {
            method: "POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                name: this.state.nickname,
                password: this.state.password
            })
        })
        response = await response.json();
        return response.error;
    }

    display_error(error_text)
    {
        let button = document.getElementById("goToButton");
        button.textContent = error_text;
        button.style.backgroundColor = "lightcoral";
        let old_width = button.style.width;
        let old_margin = button.style.marginLeft;
        if (window.screen.width >= 1000) {
            button.style.width = "25vw";
            button.style.marginLeft = "2.5vw";
        }
        setTimeout(() => {
            button.textContent = "LogIn";
            button.style.backgroundColor = "#f4c95d";
            if (window.screen.width >= 1000) {
                button.style.width = old_width;
                button.style.marginLeft = old_margin;
            }
        }, 3000);
    }

    render() {
        if(this.state.loggedin) return(<Navigate to = "/admin/page"></Navigate>)
        return(
            <div className = {style.form}>
                <br/>
                <p>Log In as an admin</p>
                <br/><br/>
                
                {/* simple form that takes the user input and sends it to the server*/}
                <input className = {style.input} name = "nickname" type = "text" id = "nickname" placeholder = "nickname" 
                    onChange={(e) => this.onChangeHandler(e)}></input>
                <br/>
                <input className = {style.input} name = "password" type = "password" id = "password" placeholder = "password" 
                 onChange={(e) => this.onChangeHandler(e)}></input>


                <br/><br/>
                <button className = {style.goToButton} id = "goToButton" onClick={async () => {
                    let nickname = document.getElementById("nickname");
                    let password = document.getElementById("password");
                    if(!nickname.value || !password.value) 
                        this.display_error("Complete all fields!");
                    else
                    {
                        let error = await this.send_login_data();
                        if(error) this.display_error(error);
                            else 
                            {
                                localStorage.setItem("admin_name", this.state.nickname)
                                this.setState({loggedin: true});
                            }

                    }
                }}>LogIn</button>
                
            </div>
        )
    }
}

export default StartPage;