CREATE DATABASE IF NOT EXISTS invoice_portal;
USE invoice_portal;

CREATE TABLE users (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255) NOT NULL,
email VARCHAR(255) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE clients (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL,
phone VARCHAR(50),
company VARCHAR(255),
address TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invoices (
id INT AUTO_INCREMENT PRIMARY KEY,
invoice_number VARCHAR(50) UNIQUE NOT NULL,
client_id INT NOT NULL,
issue_date DATE NOT NULL,
due_date DATE NOT NULL,
subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
tax_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
grand_total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
status ENUM('Draft','Sent','Paid','Overdue','Cancelled') DEFAULT 'Draft',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

CREATE TABLE invoice_items (
id INT AUTO_INCREMENT PRIMARY KEY,
invoice_id INT NOT NULL,
description VARCHAR(255) NOT NULL,
quantity INT NOT NULL DEFAULT 1,
unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

CREATE TABLE payments (
id INT AUTO_INCREMENT PRIMARY KEY,
invoice_id INT NOT NULL,
amount DECIMAL(10,2) NOT NULL,
payment_date DATE NOT NULL,
payment_method VARCHAR(100),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

INSERT INTO users (name,email,password)
VALUES
('Admin','[admin@example.com](mailto:admin@example.com)','admin123');

INSERT INTO clients
(name,email,phone,company,address)
VALUES
(
'Demo Client',
'[client@example.com](mailto:client@example.com)',
'9876543210',
'ABC Company',
'New York'
);
