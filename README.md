# MOHR - Modern HR Management System

**MOHR (Modern HR)** is a comprehensive, nature-inspired HR management system built with Next.js, designed to streamline employee management, leave requests, attendance tracking, room booking, and dashboard analytics.

**Theme**: Moss Growth 🌿 - A nature-inspired design philosophy for modern HR management.

---

## 🚀 Features

### 👤 Employee Management
- Complete employee directory with search and filters
- Add, edit, and delete employee records
- Track employee information: ID, position, hire date, status
- Role-based access control (ADMIN/MANAGER only)

### 📅 Leave Management
- Submit leave requests with automatic balance tracking
- View leave balance (Vacation, Sick, Personal days)
- Track leave request history and status
- Support for multiple leave types (Vacation, Sick, Personal, Unpaid)
- Approval workflow for managers

### ⏰ Attendance Tracking
- Real-time check-in/check-out functionality
- Live clock display
- Attendance history with date sorting
- Statistics: Present, Absent, Late, Half-day
- Automatic duration calculation

### 🏢 Room Booking
- View available meeting rooms with capacity details
- Book rooms with date/time selection
- Display room amenities (Projector, Whiteboard, etc.)
- Booking history and status tracking
- Real-time availability indicators

### 📊 Dashboard & Reports
- Key metrics: Total employees, attendance rate, pending leaves
- Department overview
- Real-time analytics and insights
- Comprehensive reporting system

### 🔐 Authentication & Authorization
- Secure authentication with NextAuth.js
- Role-based access control (ADMIN, MANAGER, EMPLOYEE)
- Protected routes with middleware
- Session management

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.0.3 (App Router)
- **Language**: TypeScript
- **UI Library**: React 19.2.0
- **Styling**: Tailwind CSS 4
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Authentication**: NextAuth.js v4

### Backend
- **Framework**: Next.js 14 (API Routes)
- **Database**: PostgreSQL 18
- **ORM**: Prisma 7
- **Authentication**: NextAuth.js v4
- **Password Hashing**: bcryptjs
- **File Uploads**: Multer
- **Email**: Nodemailer

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 20.x or higher
- **npm** or **yarn** or **pnpm**
- **PostgreSQL** 18.x
- **Git**

---

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd MOHR
```

### 2. Install Dependencies

#### Frontend
```bash
cd frontend
npm install
```

#### Backend
```bash
cd backend
npm install
```

### 3. Environment Configuration

#### Backend Setup
Create a `.env.local` file in the `backend` directory:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/MOHR_db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3001"

# Email (Optional)
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_USER="your-email@example.com"
SMTP_PASS="your-password"
```

#### Frontend Setup
Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Database Setup

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database (optional)
npx prisma db seed
```

### 5. Run Development Servers

#### Backend (Port 3001)
```bash
cd backend
npm run dev
```

#### Frontend (Port 3000)
```bash
cd frontend
npm run dev
```

### 6. Access the Application

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3001](http://localhost:3001)

---

## 📂 Project Structure

```
MOHR/
├── frontend/                # Next.js frontend application
│   ├── app/                # App router pages
│   │   ├── (auth)/        # Authentication pages
│   │   ├── api/           # API proxy routes
│   │   ├── attendance/    # Attendance module
│   │   ├── dashboard/     # Dashboard & analytics
│   │   ├── employees/     # Employee management
│   │   ├── leave/         # Leave management
│   │   ├── profile/       # User profile
│   │   ├── reports/       # Reports & analytics
│   │   ├── rooms/         # Room booking
│   │   └── settings/      # System settings
│   ├── components/        # Reusable components
│   │   ├── ui/           # UI component library
│   │   ├── auth/         # Authentication components
│   │   └── dashboard/    # Dashboard components
│   └── lib/              # Utilities and helpers
│
└── backend/              # Next.js backend API
    ├── app/api/          # API routes
    │   ├── auth/        # Authentication endpoints
    │   ├── employees/   # Employee CRUD
    │   ├── leave/       # Leave management
    │   ├── attendance/  # Attendance tracking
    │   ├── rooms/       # Room booking
    │   └── reports/     # Analytics endpoints
    ├── lib/             # Backend utilities
    └── prisma/          # Database schema & migrations
```

---

## 🎨 UI Component Library

The project includes a custom-built UI component library located in `frontend/components/ui/`:

- **Table** - Data tables with sorting, pagination, and custom rendering
- **Modal** - Customizable modal dialogs
- **Badge** - Status badges with variants
- **Pagination** - Smart pagination with page number generation
- **Button** - Multiple variants with loading states
- **Dialog** - Confirmation and alert dialogs

---

## 🔒 Authentication

MOHR uses NextAuth.js for authentication with the following roles:

- **ADMIN** - Full system access
- **MANAGER** - Employee management, leave approvals
- **EMPLOYEE** - Personal data, leave requests, attendance

### Default Users (After Seeding)
- Admin: `admin@MOHR.com` / `Admin@123`
- Manager: `manager@MOHR.com` / `Manager@123`
- Employee: `employee@MOHR.com` / `Employee@123`

---

## 📜 Available Scripts

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Backend
```bash
npm run dev      # Start development server (port 3001)
npm run build    # Build for production
npm run start    # Start production server
```

---

## 🗄️ Database Schema

### Core Tables
- **User** - System users with authentication
- **Employee** - Employee records linked to users
- **LeaveBalance** - Annual leave tracking per employee
- **LeaveRequest** - Leave applications and approvals
- **Attendance** - Daily check-in/check-out records
- **Room** - Meeting room inventory
- **Booking** - Room booking records
- **Settings** - System configuration

---

## 🚢 Deployment

### Vercel Deployment (Recommended)

1. Push your code to GitHub
2. Import project to Vercel
3. Configure environment variables
4. Deploy frontend and backend separately

### Environment Variables for Production
Ensure all environment variables are set in your deployment platform:
- Database connection string
- NextAuth secret and URL
- SMTP credentials (if using email features)

---

## 📚 Documentation

For more detailed documentation, see:
- [Backend Documentation](../backend/BACKEND_DOCUMENTATION.md)
- [Frontend Setup Guide](./FRONTEND_SETUP.md)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is private and proprietary.

---

## 🐛 Known Issues & Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Ensure PostgreSQL is running
# Check DATABASE_URL in .env.local
npx prisma db push
```

**Port Already in Use**
```bash
# Change port in package.json or kill the process
# Frontend: PORT=3002 npm run dev
# Backend: npm run dev -- -p 3002
```

**Authentication Issues**
```bash
# Clear browser cookies and cache
# Verify NEXTAUTH_SECRET matches in both frontend and backend
```

---

## 📞 Support

For questions or support, please contact the development team.

---

**Built with ❤️ using Next.js and the Moss Growth philosophy 🌿**
