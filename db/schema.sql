

-- Create the database bamazon and specified it for use.
CREATE DATABASE bamazon;
USE bamazon;

-- Create the table products
CREATE TABLE products (
  `item_id` INT NOT NULL,
  `product_name` VARCHAR(45) NULL,
  `departent_name` VARCHAR(45) NULL,
  `price` DECIMAL NULL,
  `stock_quantity` INT NULL,
  PRIMARY KEY (`item_id`));
-- Insert a set of records.
INSERT INTO plans (plan) VALUES ('Plan to fight a ninja.');
