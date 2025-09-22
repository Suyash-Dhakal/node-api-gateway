# 📝 Notes Microservices Project

A **Notes application** built with a **microservices architecture**.  
It demonstrates **JWT authentication**, **API Gateway**, **rate limiting**, and a **simple React frontend**.

---

## 🚀 Project Description

This project simulates a modern backend system using microservices and demonstrates how an **API Gateway** can unify multiple services, enforce security, and apply cross-cutting concerns such as authentication and rate limiting.

---

## 🏗 Architecture

- **API Gateway** (Node.js + Express)  
  - Single entry point for all client requests  
  - Handles JWT verification 
  - Forwards requests to appropriate microservices (`/auth/*` → Auth, `/notes/*` → Notes)  
  - Enforces **rate limiting** with Redis 
  - Adds centralized features like logging and authentication middleware  

- **Auth Service** (Postgres + Sequelize)  
  - `POST /signup`, `POST /login`, `POST /logout`  
  - Manages **user authentication** with secure password hashing (bcrypt)  

- **Notes Service** (MongoDB + Mongoose)  
  - CRUD operations for notes (`GET`, `POST`, `PATCH`, `DELETE`)  
  - Notes are tied to a `userId`  
  - Enforces **authorization** so users can only manage their own notes  

- **Frontend** (React + Vite + Axios)  
  - Pages for **Signup**, **Login**, and **Notes Management**  

---

## 🎥 Demo

https://github.com/user-attachments/assets/c5c85d12-c1f2-4266-92da-76b43d3403dd


---


## 🛠 Tech Stack

- **Backend:** Node.js, Express, JWT  
- **Databases:** Postgres (Auth), MongoDB (Notes), Redis  
- **Frontend:** React, Vite, Axios  

---

## 🧑‍💻 Local Development

### 1. Clone the Repository
```bash
git clone https://github.com/Suyash-Dhakal/notes-microservices.git
cd notes-microservices
```
### 2. Setup Environment Variables
### 3. Run Services
```bash
# API Gateway
cd api-gateway && npm install && node server.js

# Auth Service
cd auth-service && npm install && node server.js

# Notes Service
cd notes-service && npm install && node server.js

# Frontend
cd frontend && npm install && npm run dev
```
## 📚 API Endpoints

### Auth Service
- **POST** `/signup` – Register new user  
- **POST** `/login` – Login user (sets JWT cookie)
- **POST** `/logout` – Logout user (clears cookie)

### Notes Service (Protected)
- **GET** `/notes` – Get all notes for logged-in user  
- **POST** `/notes` – Create a new note
- **PATCH** `/notes/:id` – Update a note
- **DELETE** `/notes/:id` – Delete a note
