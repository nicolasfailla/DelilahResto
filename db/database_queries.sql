DROP DATABASE delilah_resto;
CREATE DATABASE delilah_resto;
CREATE TABLE delilah_resto.users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(60) NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(60) NOT NULL,
    last_name VARCHAR(60),
    mail VARCHAR(60) NOT NULL,
    phone VARCHAR(60) NOT NULL,
    admin INT NOT NULL
    );
CREATE TABLE delilah_resto.orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    state VARCHAR(60) NOT NULL DEFAULT "new",
    user_id INT NOT NULL,
    adress VARCHAR(60) NOT NULL,
    total INT,
    payment_method VARCHAR(60) NOT NULL,
    time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
CREATE TABLE delilah_resto.products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(60) NOT NULL,
    price INT NOT NULL
);
CREATE TABLE delilah_resto.orders_products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL
    );
INSERT INTO delilah_resto.users (username, password, name, last_name, mail, phone, admin) VALUES ("delilahAdmin", "sha1$03be54cf$1$1d7da7dea465898509295b9a2349b94057c91cfe", "Admin", "Delilah", "admin@delilahresto.com", "541134567123", 1);

INSERT INTO delilah_resto.users (username, password, name, last_name, mail, phone, admin) VALUES ("delilahUser", "sha1$bbeb2d32$1$3ec95a0668973c585b25fbd3474ad3eb54abe3a9", "Normal user", "Delilah", "user@delilahresto.com", "541134576534", 2);

INSERT INTO delilah_resto.products (name, price) VALUES ("Hamburguer", 300);

INSERT INTO delilah_resto.products (name, price) VALUES ("Potatoes", 150);
