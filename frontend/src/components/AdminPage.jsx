import React from "react";
import style from "../css/AdminPage.module.css";
import {Navigate} from "react-router-dom";

    //this component represents the main page which the admin will interact with

class SignUpPage extends React.Component{
    constructor(){
        super();

        this.state = ({     //state variables are used to store data retrieved from the server
            // link_server: "http://localhost:5000",
            link_server: "https://infoworld-project-cafe.herokuapp.com",
            products: [],
            current_product: {},
            name: "",
            price: "",
            quantity: 0,
            rating: 0,
            description: "",
            comments: "",
            image: 0
        })
    }

    //function that autocomplete the state every time a input typed in a form
    onChangeHandler = (event) => {  
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    //retrieve and send data from/to the server through multiple fetch requests
    async edit_product(productId, name, price, quantity, description, comments, rating, image)
    {
        let response = await fetch(this.state.link_server + "/administration/edit", {
            method: "POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                name: name,
                price: price,
                quantity: quantity,
                description: description,
                comments: comments,
                rating: rating,
                image: image,
                productId: productId
            })
        })
        response = await response.json();
        return response.error;
    }

    async delete_product(productId)
    {
        let response = await fetch(this.state.link_server + "/administration/delete", {
            method: "POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                productId: productId
            })
        })
        response = await response.json();
        return response.error;
    }

    async add_product(name, price, quantity, description, comments, rating, image)
    {
        if(!image) image = 1;
        let response = await fetch(this.state.link_server + "/administration/add", {
            method: "POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                name: name,
                price: price,
                quantity: quantity,
                description: description,
                comments: comments,
                rating: rating,
                image: image
            })
        })
        response = await response.json();
        return response.error;
    }

    async retrieve_data()
    {
        let response = await fetch(this.state.link_server + "/get_products", {
            method: "POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                order: "productId",
                direction: "ASC"
            })
        })
        response = await response.json();
        this.setState({products: response.products});
    }

    async retrieve_product_by_id(productId)
    {
        let response = await fetch(this.state.link_server + "/get_product_by_id", {
            method: "POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                productId: productId
            })
        })
        response = await response.json();
        this.setState({current_product: response.products[0]});
    }

    //functions used to toggle between menus and options
    async toggle_buttons(direction)
    {
        let save_button = document.getElementById("save");
        let add_button = document.getElementById("add");
        let delete_button = document.getElementById("delete");
        let cancel_button = document.getElementById("cancel");
        let container = document.getElementById("container");
        let edit_panel = document.getElementById("edit_panel");
        let add_button2 = document.getElementById("add2");
        if(direction)
        {
            cancel_button.style.display = "block";
            add_button.style.display = "none";
            delete_button.style.display = "block";
            save_button.style.display = "block";
            container.style.display = "none";
            edit_panel.style.display = "block";
        }
        else
        {
            cancel_button.style.display = "none";
            add_button.style.display = "block";
            add_button2.style.display = "none";
            delete_button.style.display = "none";
            save_button.style.display = "none";
            container.style.display = "block";
            edit_panel.style.display = "none";
        }
        this.setState({
            name: "",
            price: "",
            quantity: 0,
            rating: 0,
            description: "",
            comments: "",
            image: 0
        })
        document.getElementById("name").value = '';
        document.getElementById("price").value = "";
        document.getElementById("quantity").value = "";
        document.getElementById("description").value = "";
        document.getElementById("comments").value = "";
        document.getElementById("image").value = "";
        document.getElementById("rating").value = "";

        await this.retrieve_data();
    }

    add_mode() {
        this.setState({
            current_product: {
                name: "",
                price: "",
                quantity: 0,
                rating: 0,
                description: "",
                comments: "",
                image: 0
            }
            
        })

        let add_button = document.getElementById("add");
        let add_button2 = document.getElementById("add2");
        let cancel_button = document.getElementById("cancel");
        let container = document.getElementById("container");
        let edit_panel = document.getElementById("edit_panel");

        add_button.style.display = "none";
        add_button2.style.display = "block";
        cancel_button.style.display = "block";
        container.style.display = "none";
        edit_panel.style.display = "block";
    }

    display_error(error_text, direction)
    {
        let save_button = document.getElementById("save");
        let add_button = document.getElementById("add");
        let add_button2 = document.getElementById("add2");
        let delete_button = document.getElementById("delete");
        let cancel_button = document.getElementById("cancel");
        let error_box = document.getElementById("error_box");
        if(direction === 1)
        {
            cancel_button.style.display = "none";
            add_button.style.display = "none";
            delete_button.style.display = "none";
            save_button.style.display = "none";
            error_box.style.display = "block";
            error_box.textContent = error_text;
        }
        else if(direction === 0)
        {
            cancel_button.style.display = "block";
            add_button.style.display = "none";
            delete_button.style.display = "block";
            save_button.style.display = "block";
            error_box.style.display = "none";
        }
        else if(direction === 3)
        {
            cancel_button.style.display = "none";
            add_button.style.display = "none";
            add_button2.style.display = "none";
            delete_button.style.display = "none";
            save_button.style.display = "none";
            error_box.style.display = "block";
            error_box.textContent = error_text;
        }
        else if(direction === 2)
        {
            add_button.style.display = "none";
            add_button2.style.display = "block";
            error_box.style.display = "none";
            cancel_button.style.display = "block";
        }
    }

    async componentDidMount() 
    {
        await this.retrieve_data();
    }

    render() {
        let admin = localStorage.getItem("admin_name");
        if(!admin) return(<Navigate to = "/admin/login"></Navigate>)    //redirect to login if the admin is not logged in
        else return(
            <div>
                <div className = {style.container} id = "container">
                    <p>Products</p>
                    {this.state.products.map((product) => {     //dynamically display the products
                        return (
                            <div key = {product.productid} className = {style.product_label} onClick =  {async () => {
                                this.toggle_buttons(1);
                                await this.retrieve_product_by_id(product.productid);
                                
                            }}>
                                <div className = {style.product}> {product.name} - {product.price} ron</div>
                                <div className = {style.edit_buton} > edit </div>
                            </div>
                            )
                    })}
                </div>

                    {/* edit_panel contains a form with the product data
                        if there is no new data typed in the specific fields, that product characteristic will not update */}
                <div className = {style.edit_panel} id = "edit_panel">
                    <br/>
                    <div className = {style.product_label}>
                        <div className = {style.label} > name </div>
                        <input className = {style.input} name = "name" type = "text" id = "name" placeholder = {this.state.current_product.name}
                             onChange={(e) => this.onChangeHandler(e)}></input>
                    </div>
                    <div className = {style.product_label}>
                        <div className = {style.label} > price </div>
                        <input className = {style.input} name = "price" type = "number" id = "price" placeholder = {this.state.current_product.price} 
                             onChange={(e) => this.onChangeHandler(e)}></input>
                    </div>
                    <div className = {style.product_label}>
                        <div className = {style.label} > quantity </div>
                        <input className = {style.input} name = "quantity" type = "number" id = "quantity" placeholder = {this.state.current_product.quantity} 
                             onChange={(e) => this.onChangeHandler(e)}></input>
                    </div>
                    <div className = {style.product_label}>
                        <div className = {style.label} > ranting </div>
                        <input className = {style.input} name = "rating" type = "number" id = "rating" placeholder = {this.state.current_product.rating}
                             onChange={(e) => this.onChangeHandler(e)}></input>
                    </div>
                    <div className = {style.product_label}>
                        <div className = {style.label} > description </div>
                        <input className = {style.input} name = "description" type = "text" id = "description" placeholder = {this.state.current_product.description}
                            onChange={(e) => this.onChangeHandler(e)}></input>
                    </div>
                    <div className = {style.product_label}>
                        <div className = {style.label} > comments </div>
                        <input className = {style.input} name = "image" type = "number" id = "image" 
                            placeholder = {"image type: " + this.state.current_product.image}
                            onChange={(e) => this.onChangeHandler(e)}></input>
                    </div>
                    <textarea className = {style.large_input} name = "comments" type = "text" id = "comments" placeholder = {this.state.current_product.comments}
                            onChange={(e) => this.onChangeHandler(e)}></textarea>
                </div>

                        {/* buttons that perform actions onto the selected product
                        after the request execution, an error (if there is one) will be displayed */}
                <div className = {style.actions}>
                    <button id = "error_box" className = {style.error_box} style = {{display: "none"}}></button>
                    <button id = "add2" className = {style.action_buttons} style = {{display: "none"}} onClick = {async () =>{
                        let error = await this.add_product(this.state.name, this.state.price, this.state.quantity, this.state.description,
                            this.state.comments, this.state.rating, this.state.image);
                        if(error) 
                            {
                                this.display_error(error, 3);
                                setTimeout(() => {
                                    this.display_error(error, 2);
                                }, 3000);
                            }
                        else setTimeout(async () => {
                                await this.toggle_buttons(0);
                            }, 2000); 
                    }}>Add</button>
                    <button id = "add" className = {style.action_buttons} onClick = {() => {
                        this.add_mode();
                    }}>Add</button>
                    <button id = "delete"  className = {style.action_buttons} style = {{display: "none"}} onClick = {async () => {
                        let error = await this.delete_product(this.state.current_product.productid);
                        if(error) 
                        {
                            this.display_error(error, 1);
                            setTimeout(() => {
                                this.display_error(error, 0);
                            }, 3000);
                        }
                        else setTimeout(async () => {
                            await this.toggle_buttons(0);
                        }, 2000); 
                    }}>Delete</button>
                    <button id = "save" className = {style.action_buttons} style = {{display: "none"}} onClick = {async () => {
                        let error = await this.edit_product(this.state.current_product.productid, this.state.name || this.state.current_product.name,
                            this.state.price || this.state.current_product.price, this.state.quantity || this.state.current_product.quantity,
                            this.state.description || this.state.current_product.description, this.state.comments || this.state.current_product.comments,
                            this.state.rating || this.state.current_product.rating, this.state.image || this.state.current_product.image);
                        if(error) 
                        {
                            this.display_error(error, 1);
                            setTimeout(() => {
                                this.display_error(error, 0);
                            }, 3000);
                        }
                        else setTimeout(async () => {
                            await this.toggle_buttons(0);
                        }, 2000); 
                    }}>Save</button>
                    <button id = "cancel" className = {style.action_buttons} style = {{display: "none"}} onClick = {async () => {
                        await this.toggle_buttons(0);
                    }}>Cancel</button>
                </div>
            </div>
        )
    }
}

export default SignUpPage;