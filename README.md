# MEAN Stack E-Commerce Project

This is an e-commerce application built using the MEAN stack (MongoDB, Express.js, Angular, and Node.js). The application allows users to browse products, add them to a shopping cart, and complete purchases. It also includes an admin panel for managing users, products, and orders.

## Features

### 1. User Management
- **User Registration & Login**: Users can register using email, phone, or social media. Email confirmation is required for registration.
- **Multi-User Roles**: Two roles are supported - `Customer` and `Admin`.
- **Reviews & Ratings**: Customers can leave reviews and ratings for products.

### 2. Product Management
- **Product Listings**: Products are displayed with images, descriptions, and prices.
- **Stock Availability**: Real-time stock availability is shown for each product.
- **Search & Filter**: Users can search for products by name and filter by price, category, etc.

### 3. Shopping Cart & Checkout
- **Add/Remove Items**: Users can add or remove items from the cart.
- **Quantity Adjustment**: Users can adjust the quantity of items in the cart.
- **Order Summary**: An order summary with a price breakdown is displayed before checkout.
- **Guest Checkout**: Users can checkout without creating an account.
- **Multiple Payment Methods**: Supports credit card, PayPal, cash on delivery, and wallet payments.

### 4. Payment Integration
- **Secure Payment Gateway**: Integration with Stripe, PayPal, or Razorpay for secure payments.

### 5. Admin Panel Features
- **User Management**: Admins can approve or restrict users.
- **Product & Category Management**: Admins can add, update, or delete products and categories.

## Technologies Used

- **Frontend**: Angular
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Payment Gateway**: Stripe, PayPal, or Razorpay
- **Email Service**: Nodemailer for sending confirmation emails

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- Angular CLI (v12 or higher)
- MongoDB (v4.4 or higher)
- Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/mean-ecommerce-project.git
cd mean-ecommerce-project
