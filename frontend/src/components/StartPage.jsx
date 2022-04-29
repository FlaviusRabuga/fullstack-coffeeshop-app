import React from "react";
import style from "../css/StartPage.module.css";
import {Navigate} from "react-router-dom";

class StartPage extends React.Component{
    constructor(){
        super();
        this.state = ({
            nickname: ""
        })
    }

    //this component gets the user nickname and stores it in the localStorage
    //in order to be used later on the fetch requests

    render() {
        if( this.state.nickname !== "") return(<Navigate to = "/dashboard"></Navigate>)
        return(
            <div className = {style.form}>
                <br/>
                <p>Welcome to our Cafe</p>
                <br/><br/>
                <p>Please enter your nickname below:</p>
                <p>(Only letters)</p>
                
                <input className = {style.input} name = "nickname" type = "text" id = "nickname" placeholder = "nickname" onChange = {(event) => {
                    localStorage.setItem("nickname", event.target.value)
                }}></input>
                <br/><br/>
                <button className = {style.goToButton} id = "goToButton" onClick={() => {
                    let button = document.getElementById("goToButton");
                    let nickname = document.getElementById("nickname");
                    if(!nickname.value || !(/^[a-zA-Z]+$/.test(nickname.value))) 
                    {
                        button.textContent = "Invalid Name";
                        button.style.backgroundColor = "lightcoral";
                        setTimeout(() => {
                            button.textContent = "Go to products";
                            button.style.backgroundColor = "#f4c95d";
                        }, 3000);
                    }
                    else
                    {
                        this.setState({
                            nickname: nickname.value
                        })
                    }
                    
                }}>Go to products</button>
                
            </div>
        )
    }
}

export default StartPage;