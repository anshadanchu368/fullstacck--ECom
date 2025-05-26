

# ClapStudio - Wholesale Apparel eCommerce Platform

**ClapStudio** is a full-stack wholesale apparel eCommerce platform built with **React.js**, **Node.js**, **Express**, and **MongoDB**. It offers a seamless B2B shopping experience with secure authentication, real-time product management, efficient order processing, and responsive design.

> 🔗 **Live Demo**: [Frontend (Vercel)](https://fullstacck-e-com-o8jy.vercel.app/auth/login)
> 🌐 **Backend API**: [Backend (Render)](https://clapstudio-ecom.onrender.com)

---

## 🚀 Features

* **Responsive & Scalable UI**
  Mobile-first, modern UI built with **React.js**, **Tailwind CSS**, and **Framer Motion** for smooth user interactions and optimized performance.

* **Secure Authentication & Authorization**
  Integrated **JWT** for secure login and **Google OAuth** for Single Sign-On (SSO), along with **Role-Based Access Control (RBAC)** for fine-grained user access.

* **Admin Dashboard**
  Full-featured admin panel to manage products, inventory, users, and orders in real-time, improving operational efficiency.

* **Payment & Order Tracking**
  Seamless integration with **Razorpay** for payments, with live **order tracking** and transactional emails via **Nodemailer**.

* **Advanced Product Search & Filtering**
  Enhanced product discovery using dynamic **search**, **filter**, and **sort** functionalities.

* **Cart & Checkout System**
  Real-time **add-to-cart** and **checkout** workflow with secure Razorpay integration.

* **Image Upload & Management**
  Used **Cloudinary** for fast and optimized image uploads and delivery.

* **Security Best Practices**
  Protected user data with **bcrypt** password hashing and **express-session** for secure session handling.

---

## 🛠️ Tech Stack

* **Frontend**: React.js, Redux Toolkit,Shadcn/ui, Tailwind CSS, Framer Motion
* **Backend**: Node.js, Express.js, MongoDB
* **Authentication**: JWT, Google OAuth, RBAC
* **Payments**: Razorpay
* **Email Service**: Nodemailer
* **Image Hosting**: Cloudinary
* **Security**: bcrypt, express-session

---

## 📦 Getting Started

### Prerequisites

Make sure you have installed:

* Node.js (v14 or higher)
* MongoDB (local or cloud instance)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/clapstudio.git
cd clapstudio
```

2. **Install backend dependencies**

```bash
cd server
npm install
```

3. **Install frontend dependencies**

```bash
cd ../client
npm install
```

4. **Set up environment variables**

Create a `.env` file in the `server` directory:

```env
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

5. **Run the backend**

```bash
npm run dev
```

6. **Run the frontend**

```bash
cd ../client
npm run dev
```

---

## 📬 Contributions

Contributions are welcome! Feel free to fork the project, raise issues, or submit pull requests.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

Let me know if you also want badges (deployment, tech stack, license) or Docker setup added to the README.
