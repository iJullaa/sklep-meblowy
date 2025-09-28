# E-commerce Furniture Store API

This repository contains the backend API for a full-featured e-commerce platform specializing in furniture. It's built with Node.js, Express, and Prisma, providing a robust and scalable foundation for an online store. The API handles user authentication, product catalog management (products and categories), and order processing.

This project was built to be secure, efficient, and ready for production deployment.

## Features

-   **User Authentication**: Secure user registration and login using JSON Web Tokens (JWT).
-   **Role-Based Access Control**: Clear distinction between `USER` and `ADMIN` roles, with protected routes for admin-only actions.
-   **Product Management**: Full CRUD (Create, Read, Update, Delete) functionality for products.
-   **Category Management**: Full CRUD for product categories.
-   **Relational Data**: Products are linked to categories for easy filtering and organization.
-   **Order Processing**: Authenticated users can place orders, and the system handles the entire process.
-   **Inventory Management**: Product stock levels are automatically decremented after a successful order.
-   **Admin Dashboard Ready**: Endpoints for administrators to view all user orders and manage the catalog.
-   **Production-Ready Security**: Includes rate limiting, secure HTTP headers (Helmet), and response compression.

## Tech Stack

-   **Backend**: Node.js, Express.js
-   **Database**: PostgreSQL
-   **ORM**: Prisma
-   **Authentication**: JSON Web Tokens (JWT), bcryptjs
-   **Middleware**: CORS, Helmet (Security), express-rate-limit (Rate Limiting), compression
-   **Deployment**:
    -   API hosted on **Render**
    -   Database hosted on **Supabase**

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (v18 or later)
-   npm
-   A PostgreSQL database. You can set one up for free at [Supabase](https://supabase.com/).

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/iJullaa/sklep-meblowy.git
    ```

2.  **Navigate to the project directory:**
    ```sh
    cd sklep-meblowy
    ```

3.  **Install NPM packages:**
    ```sh
    npm install
    ```

4.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add the following variables. Get the `DATABASE_URL` from your PostgreSQL provider (e.g., Supabase).
    ```env
    # Your PostgreSQL connection string
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

    # A long, random string for signing JWTs
    JWT_SECRET="YOUR_SUPER_SECRET_JWT_KEY"

    # The port your server will run on
    PORT=5000
    ```

5.  **Run database migrations:**
    This command will sync your database schema with the Prisma schema file.
    ```sh
    npx prisma migrate dev
    ```

6.  **Start the development server:**
    ```sh
    npm run dev
    ```
    Your API will be running at `http://localhost:5000`.

##  API Endpoints

All endpoints are prefixed with `/api`. Protected routes require a `Bearer Token` in the `Authorization` header.

### Authentication (`/auth`)

| Method | Endpoint         | Description                   | Access  |
| :----- | :--------------- | :---------------------------- | :------ |
| `POST` | `/register`      | Register a new user.          | Public  |
| `POST` | `/login`         | Log in a user and get a token.| Public  |
| `GET`  | `/me`            | Get the current user's profile. | Private |

### Products (`/products`)

| Method   | Endpoint    | Description                                      | Access       |
| :------- | :---------- | :----------------------------------------------- | :----------- |
| `GET`    | `/`         | Get a list of all products (can filter by category). | Public       |
| `POST`   | `/`         | Create a new product.                            | Admin        |
| `GET`    | `/:id`      | Get details of a single product.                 | Public       |
| `PUT`    | `/:id`      | Update a product.                                | Admin        |
| `DELETE` | `/:id`      | Delete a product.                                | Admin        |

**Filtering example:** `GET /api/products?category=categoryId`

### Categories (`/categories`)

| Method   | Endpoint | Description                  | Access |
| :------- | :------- | :--------------------------- | :----- |
| `GET`    | `/`      | Get a list of all categories.| Public |
| `POST`   | `/`      | Create a new category.       | Admin  |
| `PUT`    | `/:id`   | Update a category.           | Admin  |
| `DELETE` | `/:id`   | Delete a category.           | Admin  |

### Orders (`/orders`)

| Method | Endpoint     | Description                          | Access  |
| :----- | :----------- | :----------------------------------- | :------ |
| `POST` | `/`          | Place a new order.                   | Private |
| `GET`  | `/`          | Get a list of all orders.            | Admin   |
| `GET`  | `/myorders`  | Get the logged-in user's orders.     | Private |
| `PUT`  | `/:id`       | Update an order's status (e.g., to "SHIPPED"). | Admin   |