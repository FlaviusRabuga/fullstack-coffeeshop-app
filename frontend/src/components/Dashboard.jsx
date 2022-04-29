import React from "react";
import style from "../css/Dashboard.module.css";
import type1 from "./type1.jpg";
import type2 from "./type2.jpg";
import type3 from "./type3.jpg";

    //this component represents the main page which the user will interact with

class Dashboard extends React.Component{
    constructor(){
        super();
        this.state = ({             //state variables are used to store data retrieved from the server
            // link_server: "http://localhost:5000",
            link_server: "https://infoworld-project-cafe.herokuapp.com",
            products: [],
            filtered_products: [],
            compare: () => {},
            image: [
                type1,
                type2,
                type3
            ],
            current_product: [],
            current_list: "",
            lists: [],
            lists_products : []
        })
    }

    //retrieve and send data from/to the server through multiple fetch requests

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
        this.setState({filtered_products: response.products});
    }


    async get_lists()
    {
        let response = await fetch(this.state.link_server + "/get_lists", {
            method: "POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                username: localStorage.getItem("nickname")
            })
        })
        response = await response.json();
        this.setState({lists: response.lists});
        this.setState({lists_products: response.listsProducts});
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

    async add_to_list(list_name)
    {
        let response = await fetch(this.state.link_server + "/add_to_list", {
            method: "POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                productId: this.state.current_product.productid,
                name: list_name,
                madeBy: localStorage.getItem("nickname")
            })
        })
        response = await response.json();
        return response.error;
        
    }


    //functions used to toggle between menus and options
    toggle_menu(direction) 
    {
        let all = document.getElementById("all_products");
        let my_list = document.getElementById("my_list");
        let grid_container = document.getElementById("grid_container");
        let list = document.getElementById("list");
        let details = document.getElementById("details");

        if(direction)
        {
            all.style.backgroundColor = "#e9e7c3";
            my_list.style.backgroundColor = "white";
            grid_container.style.display = "none";
            list.style.display = "block";
            details.style.display = "none";
        }
        else
        {
            all.style.backgroundColor = "white";
            my_list.style.backgroundColor = "#e9e7c3";
            grid_container.style.display = "block";
            list.style.display = "none";
            details.style.display = "none";
        }
    }

    toggle_details(direction)
    {
        let list = document.getElementById("list_name");
        list.value = "";
        let grid_container = document.getElementById("grid_container");
        let details = document.getElementById("details");

        if(direction)
        {
            grid_container.style.display = "none";
            details.style.display = "block";
        }
        else
        {
            grid_container.style.display = "block";
            details.style.display = "none";
        }
    }

    async componentDidMount() 
    {
        await this.retrieve_data();         //first requests when the page loads
        await this.get_lists();
    }

    compare_by_name( a, b ) {
        if ( a.name < b.name ) return -1;
        if ( a.name > b.name ) return 1;
        return 0;
      }
    compare_by_price( a, b ) {
        if ( a.price < b.price ) return -1;
        if ( a.price > b.price ) return 1;
        return 0;
      }
    compare_by_rating( a, b ) {
        if ( a.rating < b.rating ) return -1;
        if ( a.rating > b.rating ) return 1;
        return 0;
      }
    compare_by_id( a, b ) {
        if ( a.productid < b.productid ) return -1;
        if ( a.productid > b.productid ) return 1;
        return 0;
      }
      
    order_products() {
        let option = document.getElementById("orderby");
        let products = this.state.filtered_products;
        if(option.value === "name") products.sort(this.compare_by_name);
        else if(option.value === "price") products.sort(this.compare_by_price);
        else if(option.value === "rating") products.sort(this.compare_by_rating);
        else if(option.value === "order") products.sort(this.compare_by_id);
        this.setState({filtered_products: products});
    }

    render() {
        return(
            <div>
                <div className = {style.header}>Cafe</div>
                <div className = {style.options}>
                    <input className = {style.input} name = "search" type = "text" id = "search" 
                            placeholder = "Search by name"
                            onChange={(event) => {
                                this.setState({filtered_products: []});
                                let match = [];
                                this.state.products.map((product) => {
                                    if(product.name.indexOf(event.target.value) === 0) match.push(product);
                                    return 0;
                                })
                                this.setState({filtered_products: match});
                            }}></input>
                    <select name = "orderby" id ="orderby" className = {style.order} onChange={() => {
                                this.order_products();
                            }}>
                            <option value = "order">order by</option>
                            <option value = "name" >name</option>
                            <option value = "price">price</option>
                            <option value = "rating">rating</option>
                    </select>
                </div>
                <div className = {style.menu}>
                    <div className = {style.all_products} id = "all_products" onClick={() => this.toggle_menu(0)}> All products</div>
                    <div className = {style.my_list} id = "my_list" onClick={() => this.toggle_menu(1)}> My list</div>
                </div>
                <div className = {style.grid_container} id = "grid_container">
                    {this.state.filtered_products.map((product) => {
                        return(
                            <div className = {style.item} key = {product.productid} onClick = {async()=> {
                                    this.toggle_details(1);
                                    await this.retrieve_product_by_id(product.productid);
                                }}>
                                <div className = {style.product_name}> {product.name} </div>
                                <div className = {style.product_name}> {product.price + " ron"} </div>
                                <div className = {style.image_box}>
                                    <img src = {this.state.image[product.image - 1]} alt = {this.state.image[0]} className = {style.image}></img>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className = {style.grid_container} id = "list" style = {{display: "none"}}>
                    <select name = "lists" id ="lists" className = {style.list_selector} onChange={() => {
                                let list = document.getElementById("lists"); 
                                this.setState({current_list: list.value});
                            }}>
                            <option value = "lists">Select list</option>
                            {this.state.lists.map((list, key) => {
                                return(<option value = {list.name} key={key}> {list.name} </option>)
                            })}
                    </select>
                    {this.state.lists_products.map( (product, key) => {
                        if(product.name === this.state.current_list)
                        {
                            let p = {};
                            for(let i = 0; i < this.state.products.length; i++)
                                if(this.state.products[i].productid === product.productid) p = this.state.products[i];
                            return(
                                <div className = {style.item} key = {p.productid}>
                                <div className = {style.product_name}> {p.name} </div>
                                <div className = {style.product_name}> {p.price + " ron"} </div>
                                <div className = {style.image_box}>
                                    <img src = {this.state.image[p.image - 1]} alt = {this.state.image[0]} className = {style.image}></img>
                                </div>
                            </div>
                            )
                        }
                        return null;
                    })}
                </div>

                <div className = {style.grid_container} id = "details" style = {{display: "none"}}>
                    <div className = {style.info}>
                        <div style={{color: "#f4c95d"}}>{this.state.current_product.name}</div>
                        <div>{this.state.current_product.price + " ron"}</div>
                        <div>{this.state.current_product.description}</div>
                        <div>{"quantity: " + this.state.current_product.quantity}</div>
                        <div>{"rating: " + this.state.current_product.rating + "/5"}</div>
                    </div>
                    <div className = {style.image_box_details}>
                        <img src = {this.state.image[this.state.current_product.image - 1]} alt = {this.state.image[0]} className = {style.image}></img>
                    </div>
                    <div className = {style.comments}> {this.state.current_product.comments} </div>

                    <div className = {style.add} style = {{borderTop: "solid #f4c95d 3px"}}>
                        <input className = {style.add_to_list} placeholder = "enter list name" name = "list_name" id = "list_name"></input>
                        <button className = {style.add_to_list} id = "add_button" onClick = {async () => {
                            let list_name = document.getElementById("list_name");
                            let error = await this.add_to_list(list_name.value);
                            await this.get_lists();
                            let display = document.getElementById("add_button");
                            let color = display.style.backgroundColor;
                            if(error)
                            {
                                display.style.backgroundColor = "lightcoral";
                                display.textContent = error;
                                setTimeout(() => {
                                    display.style.backgroundColor = color;
                                    display.textContent = "Add to list";
                                }, 3000);
                            }
                            else
                            {
                                display.style.backgroundColor = "lightgreen";
                                display.textContent = "Success!";
                                setTimeout(() => {
                                    display.style.backgroundColor = color;
                                    display.textContent = "Add to list";
                                }, 3000);
                            }
                        }}>Add to list</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Dashboard;