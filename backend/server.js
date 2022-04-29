const express = require('express');
const bcrypt = require("bcrypt");
const pool = require("./elephantsql.js");
const body_parser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const { response } = require('express');

const salts = 10;
const app = express();
require("dotenv").config();

//Middlewares
app.use(body_parser.json());
app.use(cors());
app.use(helmet());


app.post('/administration/register', async(request, response) => {
    try {
        const check_name = await pool.query(`SELECT * FROM admin WHERE name = '${request.body.name}';`);
        if(check_name.rowCount) response.send({
            error: "Nickname already exist"
        });
        else {
            bcrypt.hash(request.body.password, salts, async function(error, password) {
                await pool.query(`INSERT INTO admin (name, password) VALUES('${request.body.name}', '${password}');`);
                response.send({
                    error: false
                })
            });
        }
    } catch (error) {
        response.send({
            error: "Server error, please try again!"
        });
    }
})

app.post('/administration/login', async(request, response) => {
    try {
        const check_name = await pool.query(`SELECT * FROM admin WHERE name = '${request.body.name}';`);
        if(!check_name.rowCount) response.send({
            error: "Incorect Credentials!"
        });
        else {
            bcrypt.compare(request.body.password, check_name.rows[0].password, function(err, result) {
                if(!result) response.send({
                    error: "Incorect Credentials!"
                });
                else response.send({
                        error: false
                    })
            });
        }
    } catch (error) {
        response.send({
            error: "Server error, please try again!"
        });
    }
})

app.post('/administration/edit', async(request, response) => {
    try {
        const check_id = await pool.query(`SELECT productId from product where productId = '${request.body.productId}';`);
        if (!check_id.rowCount) response.send({
            error: "Product does not exist!"
        });
        else {
            await pool.query(`UPDATE product SET name = '${request.body.name}',
            price = ${request.body.price}, quantity = ${request.body.quantity}, description = '${request.body.description}',
            comments = '${request.body.comments}', rating = ${request.body.rating}, image = ${request.body.image} WHERE productId = ${request.body.productId};`)
            response.send({
                error: false
            })
    }
    } catch (error) {
        response.send({
            error: "Server error, please try again!"
        });
    }
})

app.post('/administration/delete', async(request, response) => {
    try {
        const check_id = await pool.query(`SELECT productId from product where productId = '${request.body.productId}';`);
        if (!check_id.rowCount) response.send({
            error: "Product does not exist!"
        });
        else {
            await pool.query(`DELETE from product WHERE productId = ${request.body.productId};`)
            response.send({
                error: false
            })
        }
    } catch (error) {
        response.send({
            error: "Server error, please try again!"
        });
    }
})

app.post('/administration/add', async(request, response) => {
    try {
        if(!request.body.name || !request.body.price) 
            response.send({
                error: "Name and price are mandatory!"
            })
        else
        {
            const check_name = await pool.query(`SELECT productId from product where name = '${request.body.name}';`);
            if (check_name.rowCount) response.send({
                error: "Product already exist!"
            });
            else {
                await pool.query(`INSERT INTO product(name, price, quantity, description, comments, rating, image)
                VALUES ('${request.body.name}', ${request.body.price}, ${request.body.quantity}, 
                '${request.body.description}', '${request.body.comments}', ${request.body.rating}, ${request.body.image});`);
                response.send({
                    error: false
                })
            }
        }
    } catch (error) {
        response.send({
            error: "Server error, please try again!"
        });
    }
})

app.post('/get_products', async(request, response) => {
    try {
        const products = await pool.query(`SELECT * FROM product ORDER BY ${request.body.order} ${request.body.direction};`);
        response.send({
            error: false,
            products: products.rows
        })
    } catch (error) {
        response.send({
            error: "Server error, please try again!"
        });
    }
})

app.post('/get_product_by_id', async(request, response) => {
    try {
        const products = await pool.query(`SELECT * FROM product WHERE productId = '${request.body.productId}';`);
        response.send({
            error: false,
            products: products.rows
        })
    } catch (error) {
        response.send({
            error: "Server error, please try again!"
        });
    }
})

app.post('/get_lists', async(request, response) => {
    try {
        const lists = await pool.query(`SELECT DISTINCT name FROM list WHERE madeBy = '${request.body.username}';`);
        const listsProducts = await pool.query(`SELECT * FROM list WHERE madeBy = '${request.body.username}';`);
        response.send({
            error: false,
            lists: lists.rows,
            listsProducts: listsProducts.rows
        })
    } catch (error) {
        response.send({
            error: "Server error, please try again!"
        });
    }
})

app.post('/add_to_list', async(request, response) => {
    try {
        if(!request.body.name) response.send({
            error: "Enter the list name!"
        });
        else
        {
            const check_id2 = await pool.query(`SELECT productId FROM list  WHERE productId = '${request.body.productId}' AND name = '${request.body.name}';`);
            if(check_id2.rowCount) response.send({
                error: "Already in that list!"
            });
            else
            {
                const check_id = await pool.query(`SELECT productId from product where productId = '${request.body.productId}';`);
                if (!check_id.rowCount) response.send({
                    error: "Product does not exist!"
                });
                else {
                    await pool.query(`INSERT INTO list(name, madeBy, productId)
                    VALUES ('${request.body.name}', '${request.body.madeBy}', ${request.body.productId});`);
                    response.send({
                        error: false
                    })
                }
            }
            
        }
        
    } catch (error) {
        response.send({
            error: "Server error, please try again!"
        });
    }
})

app.post('/remove_from_list', async(request, response) => {
    try {
        const check_id = await pool.query(`SELECT listId from list where listId = '${request.body.listId}';`);
        if (!check_id.rowCount) response.send({
            error: "List element does not exist!"
        });
        else {
            await pool.query(`DELETE FROM list WHERE listId = ${request.body.listId}`);
            response.send({
                error: false
            })
        }
    } catch (error) {
        response.send({
            error: "Server error, please try again!"
        });
    }
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`App running on port ${process.env.PORT || 3000}`);
})