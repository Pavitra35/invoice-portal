# 📄 Invoice Portal

A modern **Full Stack Invoice Management System** developed using **React.js**, **Node.js**, **Express.js**, and **MySQL**. The application enables users to manage clients, generate invoices, record payments, and monitor business performance through an interactive dashboard.

## 📌 Features

* 🔐 User Registration and Login
* 👥 Client Management
* 📄 Create, View, Update, and Delete Invoices
* 💳 Record Customer Payments
* 📊 Dashboard with Business Statistics
* 📅 Track Invoice Due Dates
* 💾 Secure MySQL Database Integration
* 🌐 RESTful API using Express.js
* 📱 Responsive User Interface


## 🛠️ Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* CSS

### Backend

* Node.js
* Express.js

### Database

* MySQL

### Development Tools

* Visual Studio Code
* XAMPP (MySQL)
* Postman
* Git & GitHub

## 📂 Project Structure

invoice-portal/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── package.json
│   └── server.js
│
└── README.md

## 🚀 Installation & Setup

### 1. Clone the Repository

git clone https://github.com/Pavitra35/invoice-portal.git

### 2. Navigate to the Project

cd invoice-portal

### 3. Install Frontend Dependencies

cd frontend
npm install

### 4. Install Backend Dependencies

cd ../backend
npm install

### 5. Create MySQL Database

CREATE DATABASE invoice_portal;

Import the provided SQL file into the database.

### 6. Configure Database Connection

Update **backend/config/db.js**

```javascript
host: "localhost",
user: "root",
password: "",
database: "invoice_portal"
```

### 7. Start Backend Server

cd backend
node server.js

Server runs at:
http://localhost:5000

### 8. Start Frontend

cd frontend
npm run dev

Frontend runs at:
http://localhost:5173

## 📊 Database Tables

* users
* clients
* invoices
* invoice_items
* payments

## 🔄 Application Workflow

1. User registers and logs into the application.
2. Clients are added to the system.
3. Users create invoices for selected clients.
4. Invoice details are stored in the MySQL database.
5. Payments are recorded against invoices.
6. Dashboard displays:

   * Total Revenue
   * Pending Payments
   * Overdue Invoices
   * Total Clients
   * Recent Invoices

### Authentication

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | Login user          |

### Clients

| Method | Endpoint           |
| ------ | ------------------ |
| GET    | `/api/clients`     |
| POST   | `/api/clients`     |
| PUT    | `/api/clients/:id` |
| DELETE | `/api/clients/:id` |

### Invoices

| Method | Endpoint                   |
| ------ | -------------------------- |
| GET    | `/api/invoices`            |
| GET    | `/api/invoices/:id`        |
| POST   | `/api/invoices`            |
| PUT    | `/api/invoices/:id/status` |
| DELETE | `/api/invoices/:id`        |

### Payments

| Method | Endpoint                |
| ------ | ----------------------- |
| POST   | `/api/invoices/payment` |

### Dashboard

| Method | Endpoint         |
| ------ | ---------------- |
| GET    | `/api/dashboard` |

---

## 🔒 Security Features

* Input Validation
* REST API Architecture
* Prepared SQL Queries
* MySQL Connection Pooling
* CORS Configuration
* Error Handling

---

## 📈 Future Enhancements

* Password Hashing using bcrypt
* JWT Authentication
* PDF Invoice Generation
* Email Invoice Delivery
* GST Calculation
* Invoice Search & Filtering
* Role-Based Access Control
* Dark Mode
* Cloud Deployment


## 🎯 Learning Outcomes

* Developed a full-stack web application using the MERN-style architecture (React, Node.js, Express, and MySQL).
* Implemented RESTful APIs for user authentication, client management, invoices, and payments.
* Designed and managed a relational database with normalized tables.
* Integrated frontend and backend using Axios for seamless API communication.
* Gained practical experience in CRUD operations, routing, state management, and database connectivity.

## 👨‍💻 Author

**Pavitra**

MCA Student | Full Stack Web Developer

### Connect with Me

* LinkedIn: https://www.linkedin.com/in/pavitra-22b666344/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BN%2BeZxmTeQJGLBHdSDRhHhA%3D%3D
* GitHub: https://github.com/Pavitra35
* Email: kudripavitra@gmail.com

## 📄 License

This project is licensed under the MIT License.

Feel free to use, modify, and distribute this project for educational and personal purposes.
