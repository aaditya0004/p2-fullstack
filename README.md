<div align="center">

# Osto.one Subscription & Billing Platform 🛡️💰

![Osto Billing Platform Logo](https://placehold.co/600x300/1e293b/ffffff?text=Osto.one%20Billing&font=raleway)

**A comprehensive, full-stack subscription and billing management platform built for Osto.one's modular cybersecurity services.**

</div>

---

## ✨ Project Overview

This project was created for a hackathon to build a professional SaaS billing system from the ground up. The platform handles multiple security modules, simulates payment processing, manages user subscriptions, generates invoices, and gracefully handles payment edge cases. Our coaching-driven, step-by-step approach ensured a robust and feature-complete application, built one testable piece at a time.

**🚀 Live Application URL:** [**Your Deployed URL Will Go Here**](http://)

---

## 🧠 Our Thought Process & Development Journey

We adopted a "Crawl, Walk, Run" methodology to tackle this complex project, ensuring a solid foundation before moving on to advanced features.

### 🚶‍♂️ Step-by-Step Build Log:

1.  **Blueprint & Design (Crawl):** We started by creating a detailed **Design Document**, outlining our database schemas (Users, Plans, Subscriptions, Invoices) and the required API endpoints. This planning phase was crucial to ensure a clear path forward.

2.  **Backend Foundation (Crawl):** We set up a basic **Node.js/Express.js server** and connected it to a free-tier **MongoDB Atlas** cloud database. This established the core communication layer of our application.

3.  **Secure User Authentication (Walk):** We built a complete, secure authentication system.
    * `POST /api/users/register`: For new user sign-ups with password hashing (`bcryptjs`).
    * `POST /api/users/login`: For user login, which generates a secure **JSON Web Token (JWT)** for session management.

4.  **Subscription Plans (Walk):** We created the backend infrastructure to manage the product catalog, allowing an admin to create and list various subscription plans.

5.  **Payment Gateway Simulation (Walk):** To avoid KYC blockers during the hackathon, we smartly pivoted from a live payment gateway to a **simulated payment system**. This allowed us to build and test the entire subscription creation flow without any external dependencies.

6.  **Full-Stack Integration (Run):** We built the **Next.js frontend** and connected it to our backend, tackling CORS issues and fetching real-time data from our API to display on the UI.

7.  **Dynamic Frontend (Run):** We implemented a robust frontend authentication flow using **React Context API**, allowing for a dynamic UI that changes based on the user's login status.

8.  **Core Feature Implementation (Run):** We then rapidly built out the key features:
    * **User Dashboard:** A page for users to view and manage their active subscriptions.
    * **Billing & Invoice History:** A professional table view of all user invoices.
    * **Profile Management:** A secure page for users to view and update their company details.
    * **Subscription Cancellation:** Allowing users to cancel their active plans.
    * **PDF Invoice Generation:** Added a "Download PDF" feature using `jspdf` for a professional touch.

9.  **Edge Case Handling (Polish):** We simulated a complete payment failure and recovery workflow, demonstrating a deep understanding of real-world billing challenges.
    * A "Fail" button changes a subscription to `past_due`.
    * This generates an `unpaid` invoice.
    * A "Pay Now" button resolves the invoice and sets the subscription back to `active`.

---

## 🛠️ Tech Stack

This project utilizes a modern, robust, and scalable tech stack.

| Area               | Technology                                                                                                  | Reason                                                                    |
| ------------------ | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **Frontend** | [**Next.js**](https://nextjs.org/) (React) & [**Tailwind CSS**](https://tailwindcss.com/)                     | For a fast, modern, and fully-responsive user interface with a great DX.  |
| **Backend** | [**Node.js**](https://nodejs.org/) & [**Express.js**](https://expressjs.com/)                               | A lightweight, powerful, and widely-supported choice for building REST APIs. |
| **Database** | [**MongoDB**](https://www.mongodb.com/) (with Mongoose)                                                     | A flexible NoSQL database, perfect for evolving schemas in a hackathon.   |
| **Authentication** | **JWT** (JSON Web Tokens) & **bcryptjs** | Industry-standard for secure, stateless authentication and password hashing. |
| **PDF Generation** | [**jsPDF**](https://github.com/parallax/jsPDF)                                                              | A client-side library for generating professional-looking PDF invoices.      |

---

## ✅ Key Features Implemented

* **Active Subscriptions Management:**
    * [✔] Module-Based Dashboard
    * [✔] Visual Status Indicators (`active`, `cancelled`, `past_due`)
    * [✔] Cancel Subscription Option
* **Billing Administration Module:**
    * [✔] User Profile page to manage company name and email.
* **Invoices & Payment Processing:**
    * [✔] Comprehensive Invoice Dashboard (Billing History)
    * [✔] Professional PDF Invoice Generation
    * [✔] "Pay Now" button interface for unpaid invoices (simulated)
    * [✔] Complete transaction history
* **Payment Edge Case Handling:**
    * [✔] Simulated Failed Payment Recovery flow.
    * [✔] Grace Period Logic shown via `past_due` status.
    * [✔] Dunning Management simulated with "Pay Now" feature.

---

## 🚀 How to Run Locally

### Prerequisites

* Node.js and npm installed
* A MongoDB Atlas account (or a local MongoDB instance)

### Backend Setup

```bash
# 1. Navigate to the backend folder
cd backend

# 2. Install dependencies
npm install

# 3. Create a .env file and add your variables
# (MONGO_URI, JWT_SECRET, PORT)
cp .env.example .env

# 4. Start the server
npm start
```

### Frontend Setup

```bash 
# 1. Navigate to the frontend folder
cd frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev


---

<div align="center">

Made by

Aaditya Tyagi Dilpreet Singh Sainbhee

</div>