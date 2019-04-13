//Dependencies
var inquirer = require("inquirer");
var mysql = require("mysql");
var products = require('cli-table');

//connection to database
var db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

db.connect(function (err) {
    if (err) throw err;
    console.log("Welcome to BAMazoN. Below is a list of all products we have to sell.")
    productList();
})

//creates table of products using cli-tables npm
function productList() {
    db.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        var table = new products({
            head: ["Product ID", "Product", "Department", "Price", "Quantity"],
            colWidths: [10, 75, 20, 10, 10],
        });
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name,
                    res[i].departent_name,
                    parseFloat(res[i].price).toFixed(2),
                    res[i].stock_quantity
                ]
            );
        }
        console.log(table.toString());
        //  starts main function of Bamazon
        bamazon();


    })
}

function bamazon() {
    inquirer.prompt([{
            type: "number",
            name: "productID",
            message: "Welcome to BAMazon! Please type the Product ID of the the item you wish to purchase!"
        },
        {
            type: "number",
            name: "quantity",
            message: "Please type the quantity you would like to buy."
        },
    ]).then(function (input) {
        var prodID = input.productID;
        var quantity = input.quantity;

        db.query("SELECT * FROM products WHERE item_id=" + prodID,
            function (err, product) {
                if (err) throw err;

                if ((product[0].stock_quantity - quantity) > 0) {
                    console.log("Your purchase of " + quantity + " " + product[0].product_name + " comes to a total of $" + (quantity * product[0].price).toFixed(2) + ". We will mail you a bill with your product. Thank you for shopping BAMazon. Please Come again!!");
                    db.query('UPDATE products SET stock_quantity=? WHERE item_id=?', [product[0].stock_quantity - quantity, prodID],

                        function (err, inventory) {
                            if (err) throw err;
                        });
                    productList();
                    bamazon();
                } else {
                    console.log(" I am very sorry. We do not have enough " + product[0].product_name + " to fill your order. Please start again and I hope we can fulfill your dreams next time.")
                    bamazon();
                }
            }
        )
    })
}