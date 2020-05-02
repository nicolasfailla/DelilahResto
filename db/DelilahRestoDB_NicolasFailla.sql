CREATE TABLE `users` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user` varchar(255),
  `pass` varchar(255),
  `email` varchar(255),
  `firstNameLastName` varchar(255),
  `adress` varchar(255),
  `country` varchar(255),
  `phoneNumber` varchar(255),
  `admin` boolean
);

CREATE TABLE `products` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `price` int,
  `description` varchar(255)
);

CREATE TABLE `states` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255)
);

CREATE TABLE `paymentsType` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255)
);

CREATE TABLE `orders` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `state_id` int,
  `user_id` int,
  `dateCreated` datetime,
  `paymentType_id` int,
  `sum` int,
  `adressOrder` varchar(255)
);

CREATE TABLE `productsInOrder` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `order_id` int,
  `product_id` int,
  `quantity` int
);

ALTER TABLE `orders` ADD FOREIGN KEY (`state_id`) REFERENCES `states` (`id`);

ALTER TABLE `orders` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `orders` ADD FOREIGN KEY (`paymentType_id`) REFERENCES `paymentsType` (`id`);

ALTER TABLE `productsInOrder` ADD FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

ALTER TABLE `productsInOrder` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
