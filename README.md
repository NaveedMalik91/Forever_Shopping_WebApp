<h1 align="center">E-Commerce Store 🛒</h1>

## Live link: [https://forever-lzi1.onrender.com]
About The  Project:

-   🚀 Project Setup
-   🗄️ MongoDB for data storage
-   💳 Stripe Payment Setup
-   🔐 Robust Authentication System
-   🔑 JWT with Refresh/Access Tokens
-   📝 User Signup & Login
-   🛒 E-Commerce Core
-   📦 Product & Category Management
-   🛍️ Shopping Cart Functionality
-   💰 Checkout with Stripe
-   👑 Admin Dashboard
-   🎨 Design with Tailwind CSS
-   🛒 Cart & Checkout Process
-   🔒 Security with JWT tokens crypto
-   🛡️ Data Protection by using bcrypt
-   ✉️ Sending emails for password reset using nodemalier

### Setup .env file

```bash
PORT=5000

UPSTASH_REDIS_URL=your_redis_url

## Client side env
VITE_BACKEND_URL=http://localhost:5000
VITE_FRONTEND_URL=http://localhost:5173

## Server side env

PORT=5000

CLIENT_SECRET_KEY= your key
STRIPE_SECRET_KEY=  your key

# --- SMTP Details ---
SMTP_HOST=smtp.gmail.com
SMTP_PORT= 
SMTP_SECURE= 
SMTP_USER= 
SMTP_PASS= 

EMAIL_FROM= 
EMAIL_FROM_NAME= 

FRONTEND_URL= 


### Run this app locally

```shell
npm run build
```

### Start the app

```shell
npm run start
```
