# PinPlace — Airbnb Clone Web Application

Live Demo: https://airbnbclone-production-543e.up.railway.app/

PinPlace is a full-stack Airbnb-style web application that allows users to explore property listings and hosts to create and manage rental properties. The project focuses on core full-stack concepts such as authentication, CRUD operations, server-side rendering, and deployment.

This project is built as a learning-oriented but production-deployed application.

---

## Features

### User Features
- Browse all available property listings
- View detailed listing information including images, price, and description
- User authentication (Sign Up and Log In)
- Session-based authentication

### Host Features
- Create new property listings
- Edit existing listings
- Delete owned listings

### UI & General
- Server-side rendered pages using EJS
- Responsive layout suitable for desktop and mobile
- Navigation bar with authentication-aware links

---

## Tech Stack

### Frontend
- EJS (Embedded JavaScript Templates)
- HTML5
- CSS3
- Vanilla JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose ODM

### Authentication & Utilities
- Express-session
- Passport.js
- Method-override
- Connect-flash

### Deployment
- Railway (full-stack deployment)

---

## Getting Started

### Prerequisites
- Node.js (v16 or later recommended)
- MongoDB (local or MongoDB Atlas)
- nodemon installed (either globally or as a dev dependency)

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/<repo-name>.git
   cd <repo-name>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Run Project Locally

1. Start the app:
   ```bash
   nodemon app.js
   ```

2. Open your browser and visit:
   ```
   http://localhost:8080
   ```



