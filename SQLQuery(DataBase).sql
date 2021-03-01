CREATE DATABASE OnlineOrderingSystem
GO 

USE OnlineOrderingSystem  
GO  

CREATE TABLE Users (
	id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
	first_name VARCHAR(50) NOT NULL,
	last_name VARCHAR(70) NOT NULL,
	email VARCHAR(20) NOT NULL UNIQUE,
	phone_number VARCHAR(10),
	home_address VARCHAR(20),
	login_password VARCHAR(50),
	is_admin BIT
);
GO  

CREATE TABLE Orders (
	id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
	order_status VARCHAR(20) NOT NULL CHECK(order_status IN ('NEW','CONFIRMED','PREPARING','SENT','CANCELLED','DELIVERED')),
	payment_method VARCHAR(20) NOT NULL CHECK(payment_method IN ('CARD','CASH')),
	date_order DATETIME DEFAULT(GetDate()) NOT NULL,
	user_id INT NOT NULL,
	FOREIGN KEY (user_id) REFERENCES Users(id)
);
GO  

CREATE TABLE Dishes (
	id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
	name_dish VARCHAR(50) NOT NULL,
	price DECIMAL(6,2) NOT NULL,
	description TEXT NOT NULL
);
GO  

CREATE TABLE Order_Deatils(
	id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
	dish_id INT NOT NULL,
	order_id INT NOT NULL,
	FOREIGN KEY (dish_id ) REFERENCES Dishes(id),
	FOREIGN KEY (order_id ) REFERENCES Orders(id)
);
GO  

INSERT INTO Dishes (name_dish,price,description)
VALUES('Bagel de salmon',425,'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took '),
('Hamburguesa clasica',350,'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took '),
('Sandwich veggie',310,'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took '),
('Ensalda veggie',340,'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took '),
('Focaccia',300,'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took '),
('Sandwich Focaccia',440,'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took '),
('Bagel de salm�n',425,'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took '),
('Hamburguesa clasica',350,'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took '),
('Sandwich veggie',310,'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took '),
('Ensalda veggie',340,'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took '),
('Focaccia',300,'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took '),
('Sandwich Focaccia',440,'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took ')



