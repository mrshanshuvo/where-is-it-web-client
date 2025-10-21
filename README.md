# 🌐 Where Is It? - Lost & Found Web Client

A modern, responsive Lost & Found web application to report, browse, and claim lost or found items. Built with React, Firebase, and Tailwind CSS for a seamless user experience.

[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Firebase Hosting](https://img.shields.io/badge/Hosted%20on-Firebase-orange?logo=firebase)](https://your-firebase-app.web.app)

---

## 🔗 Demo
- **Live Demo:** [https://your-firebase-app.web.app](https://your-firebase-app.web.app)  

### Visual Walkthrough
| Feature | Preview |
|---------|---------|
| Home Page | ![Home](./src/assets/items/lost-items.jpg) |
| Browse Lost & Found Items | ![Items](./src/assets/items/found-items.jpg) |
| Add Item Form | ![Add Item](./src/assets/items/found-items.jpg) |
| Item Details & Claim Flow | ![Item Details](./src/assets/items/found-items.jpg) |
| Admin Dashboard | _Add admin dashboard GIF here_ |
| User Profile & Recovered Items | _Add user profile GIF here_ |

> **Tip:** Replace static images with GIFs (~3–5 seconds) to show interactions: sliders, modals, and claim flow.

---

## 📝 Table of Contents
- [About](#about)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Routing Overview](#routing-overview)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 💡 About
**Where Is It?** connects people with lost and found items through a simple and intuitive interface:  

- Users register/login via email or social login (Firebase)  
- Add lost/found items with photos and details  
- Claim items with verification modal  
- Admin dashboard to manage reported items  
- Fully responsive design for mobile, tablet, and desktop  

> **Recruiter takeaway:** Demonstrates skills in **React, Firebase auth, API integration, state management, responsive UI, animations, and polished UX**.

---

## ⚡ Key Features
- ✅ User Authentication (Email + Google/Facebook via Firebase)  
- ✅ Add, browse, and claim lost/found items  
- ✅ Admin dashboard for reported items management  
- ✅ Animated interactions (Framer Motion, Lottie)  
- ✅ Responsive design for all devices  
- ✅ Real-time notifications (React Hot Toast, SweetAlert2)  
- ✅ Category filtering, search, and carousel for latest items  

---

## 🛠 Tech Stack
- **Frontend:** React 19 + Vite  
- **Styling:** Tailwind CSS + DaisyUI  
- **Routing:** React Router v7  
- **State Management:** React Context API  
- **Animations:** Framer Motion, Lottie React  
- **HTTP Requests:** Axios  
- **Notifications:** React Hot Toast, SweetAlert2  
- **Carousel & Slider:** React Slick, Swiper  
- **Icons:** Heroicons, Lucide, React Icons  
- **Authentication & Hosting:** Firebase  

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18  
- npm / yarn / pnpm  
- Firebase CLI (`npm install -g firebase-tools`)  
- Git  

### Installation
```bash
# Clone repository
git clone https://github.com/mrshanshuvo/where-is-it-web-client.git
cd where-is-it-web-client

# Install dependencies
npm install
# or yarn install
```

### Environment Variables
Create a `.env.local` file in the root directory:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_BASE_URL=http://localhost:5000
```

⚠️ **Do not commit `.env.local` to GitHub. Keep keys private.**

---

## 📜 Available Scripts
```bash
# Start development server
npm run dev

# Build production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 🏗 Project Structure
```
src/
├─ api/           # Axios API calls
├─ assets/        # Images & Lottie animations
├─ components/    # Reusable UI components
├─ contexts/      # AuthContext
├─ firebase/      # Firebase config
├─ hooks/         # Custom React hooks
├─ layouts/       # Root & page layouts
├─ pages/         # Page-level components
├─ router/        # Routes & PrivateRoute
├─ index.css      # Global CSS
└─ main.jsx       # React entry point
```

---

## 🗺 Routing Overview

| Route | Description |
|-------|-------------|
| `/` | Home |
| `/auth/login` | Login |
| `/auth/register` | Register |
| `/items` | Browse lost/found items |
| `/items/add` | Add new item |
| `/items/:id` | Item details & claim |
| `/dashboard` | Admin dashboard |
| `/user/profile` | User profile & recovered items |
| `*` | 404 Not Found |

---

## ☁️ Deployment

### Firebase Hosting

1. **Install Firebase CLI:**  
```bash
   npm install -g firebase-tools
```

2. **Login:**  
```bash
   firebase login
```

3. **Initialize project:**  
```bash
   firebase init
```
   Select **Hosting** and set build output folder to `dist`

4. **Build the app:**  
```bash
   npm run build
```

5. **Deploy:**  
```bash
   firebase deploy
```

6. **Access live app:**  
   `https://your-firebase-app.web.app`

> **Optional:** Use `firebase.json` and `.firebaserc` to manage multiple environments.

---

## 🤝 Contributing

1. Fork the repository  
2. Create a branch: `git checkout -b feature/your-feature`  
3. Commit changes: `git commit -m "feat: add X"`  
4. Push branch & open a PR to `main`  
5. Follow coding standards: ESLint + Prettier enforced  

---

## 📄 License
MIT License — see [LICENSE](LICENSE).

---

## 📫 Contact
**Shahid Hasan Shuvo**  
- GitHub: [@mrshanshuvo](https://github.com/mrshanshuvo)  
- Email: mrshanshuvo@gmail.com  

---

🚀 **Built with ❤️ using React, Firebase, and Tailwind CSS.**  
Perfect showcase for recruiters to see real-world web development skills.
