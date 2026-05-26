# KrishiMandi 🌾

### Multi-Vendor Raw Material Sourcing Platform

KrishiMandi is a full-stack web platform that connects **farmers directly with street food vendors** for bulk raw material purchasing without middlemen.
The platform enables farmers to sell products in bulk quantities while vendors can source fresh products at better prices.

---

# 🚀 Features

## 🔐 Authentication & Security

* JWT-based Authentication
* Gmail-only registration
* Email Verification for first-time login
* Role-based access control
* Secure password encryption using BCrypt

---

# 👨‍🌾 Farmer Features

* Add Products
* Edit/Delete Products
* Upload Product Images
* Manage Inventory
* Approve/Reject Vendor Orders
* Dispatch Orders
* View Sales Analytics
* Track Earnings

---

# 🛒 Vendor Features

* Browse Products
* Search & Filter Products
* Bulk Ordering (kg/tons)
* Cart Management
* Order Tracking
* View Spending Analytics
* Real-time Order Updates

---

# 📦 Bulk Ordering System

* Minimum order quantity validation
* Supports:

  * Kilograms (kg)
  * Tons
* Farmer approval workflow
* Automatic stock deduction after approval

---

# 📊 Dashboard Features

## Vendor Dashboard

* Total Orders
* Total Spending
* Order History
* Analytics Charts

## Farmer Dashboard

* Product Inventory
* Revenue Analytics
* Pending Orders
* Low Stock Alerts

---

# 🛠 Tech Stack

## Frontend

* React
* Vite
* Tailwind CSS
* Axios
* React Router
* Framer Motion

## Backend

* Spring Boot
* Spring Security
* JWT Authentication
* Java Mail Sender

## Database

* Supabase PostgreSQL

## Cloud & Storage

* Cloudinary (Image Uploads)

---

# 📂 Project Structure

```bash
frontend/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── context/
│   ├── routes/
│   └── assets/
│
backend/
│
├── controller/
├── service/
├── repository/
├── entity/
├── dto/
├── config/
├── security/
└── exception/
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone <repository-url>
cd KrishiMandi
```

---

# 🖥 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# ☕ Backend Setup

```bash
cd backend
./mvnw spring-boot:run
```

Backend runs on:

```bash
http://localhost:8080
```

---

# 🗄 Supabase Setup

Create a Supabase project and configure:

```properties
spring.datasource.url=YOUR_SUPABASE_DB_URL
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD
```

---

# ✉️ Gmail Email Verification Setup

Enable:

* 2-Step Verification
* App Passwords

Add:

```properties
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

---

# 🔑 Environment Variables

## Backend `.env`

```env
JWT_SECRET=your_secret_key
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

# 📌 API Modules

## Authentication APIs

* Register
* Login
* Email Verification
* JWT Authentication

## Product APIs

* Add Product
* Edit Product
* Delete Product
* View Products

## Order APIs

* Place Order
* Approve Order
* Reject Order
* Dispatch Order

---

# 🔒 Security Features

* JWT Authentication
* Protected Routes
* Role-based Authorization
* Gmail-only Registration
* Email Verification
* Password Encryption

---

# 📈 Future Enhancements

* AI Product Recommendation
* Real-time Chat System
* Google Maps Integration
* Voice Search
* Payment Gateway Integration
* Real-time Notifications

---

# 👥 User Roles

| Role   | Access               |
| ------ | -------------------- |
| Vendor | Purchase products    |
| Farmer | Sell/manage products |
| Admin  | Platform management  |

---

# 🌟 Key Highlights

* Direct Farmer-to-Vendor Marketplace
* Bulk Raw Material Ordering
* Real-time Inventory Management
* Secure Authentication System
* Personalized Dashboards
* Modern Responsive UI

---

# 📄 License

This project is developed for educational and hackathon purposes.

---

# 🤝 Contributors

* Your Name
* Team Members

---

# ⭐ Support

If you like this project, give it a ⭐ on GitHub.
