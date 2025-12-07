# MoHR Backend Documentation

## Project Overview

MoHR (Modern HR) is a comprehensive HR management system built with Next.js, designed to handle employee management, leave requests, attendance tracking, room booking, and dashboard analytics.

**Status**: ✅ Complete and Running
**Server**: http://localhost:3000

---

## Tech Stack

- **Framework**: Next.js 14 (API Routes)
- **Language**: TypeScript
- **Database**: PostgreSQL 18
- **ORM**: Prisma 7
- **Authentication**: NextAuth.js v4
- **Password Hashing**: bcryptjs
- **UI Framework**: React 18
- **Styling**: Tailwind CSS (for frontend)

---

## Database Setup

### PostgreSQL Connection
- **Host**: localhost:5432
- **Database**: mohr_db
- **Connection String**: `postgresql://postgres:password@localhost:5432/mohr_db`
- **Configured in**: `.env.local` (DATABASE_URL)

### Schema Overview

#### Core Tables
1. **User** - System users with authentication
   - Roles: ADMIN, MANAGER, EMPLOYEE
   - Email-based authentication

2. **Employee** - Employee records linked to Users
   - Employee ID (EMP001, EMP002, etc.)
   - Position, Hire Date, Status

3. **LeaveBalance** - Annual leave tracking per employee
   - Vacation Days: 20/year
   - Sick Days: 10/year
   - Personal Days: 3/year

4. **LeaveRequest** - Leave applications
   - Status: PENDING, APPROVED, REJECTED, CANCELLED
   - Types: VACATION, SICK, PERSONAL, MATERNITY, PATERNITY, UNPAID

5. **Attendance** - Daily attendance records
   - Check-in/Check-out times
   - Status: PRESENT, ABSENT, LATE, HALF_DAY

6. **Room** - Meeting rooms/spaces
   - Capacity, Location, Amenities

7. **RoomBooking** - Room reservations
   - Status: PENDING, CONFIRMED, CANCELLED

---

## Authentication & Authorization

### Authentication Flow
1. User registers via `POST /api/auth/register`
2. Password is hashed with bcryptjs (10 rounds)
3. User logs in via NextAuth.js CredentialsProvider
4. Session stored as JWT token
5. Token includes user ID and role

### NextAuth Configuration
- **Strategy**: JWT
- **Session Duration**: Configurable
- **Secret**: NEXTAUTH_SECRET (32+ chars, in .env.local)

### Role-Based Access Control (RBAC)

| Feature | ADMIN | MANAGER | EMPLOYEE |
|---------|-------|---------|----------|
| Manage Employees | ✓ | - | - |
| View Employees | ✓ | ✓ | - |
| Create Rooms | ✓ | - | - |
| Book Rooms | ✓ | ✓ | ✓ |
| Request Leave | ✓ | ✓ | ✓ |
| Approve Leave | ✓ | ✓* | - |
| View Attendance | ✓ | ✓ | ✓(own) |
| View Dashboard | ✓ | ✓ | ✓(limited) |

*Managers approve only their team's leaves

---

## API Endpoints

### Authentication
```
POST   /api/auth/register         - Register new user
POST   /api/auth/[...nextauth]    - NextAuth handler (login)
GET    /api/auth/[...nextauth]    - NextAuth handler (session)
```

### Employee Management
```
POST   /api/employees             - Create employee (ADMIN)
GET    /api/employees             - List all employees (ADMIN, MANAGER)
GET    /api/employees/[id]        - Get employee details
PUT    /api/employees/[id]        - Update employee (ADMIN)
```

### Leave Management
```
POST   /api/leave                 - Request leave
GET    /api/leave                 - Get leave requests (filterable by status)
PUT    /api/leave/[id]/approve    - Approve/reject leave (ADMIN, MANAGER)
```

### Attendance
```
POST   /api/attendance/checkin    - Employee check-in
POST   /api/attendance/checkout   - Employee check-out
GET    /api/attendance            - Get attendance records (monthly filter)
```

### Room Booking
```
GET    /api/rooms                 - Get all rooms
POST   /api/rooms                 - Create room (ADMIN)
POST   /api/rooms/book            - Book a room
GET    /api/rooms/availability    - Check room availability
GET    /api/bookings              - Get user's bookings
```

### Dashboard
```
GET    /api/dashboard/stats       - Get overview stats (ADMIN, MANAGER)
GET    /api/dashboard/leave-summary      - Leave status summary
GET    /api/dashboard/attendance-summary - Attendance summary (monthly)
```

---

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register/route.ts
│   │   │   └── [...nextauth]/route.ts
│   │   ├── employees/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── leave/
│   │   │   ├── route.ts
│   │   │   └── [id]/approve/route.ts
│   │   ├── attendance/
│   │   │   ├── route.ts
│   │   │   ├── checkin/route.ts
│   │   │   └── checkout/route.ts
│   │   ├── rooms/
│   │   │   ├── route.ts
│   │   │   ├── book/route.ts
│   │   │   └── availability/route.ts
│   │   ├── bookings/route.ts
│   │   └── dashboard/
│   │       ├── stats/route.ts
│   │       ├── leave-summary/route.ts
│   │       └── attendance-summary/route.ts
│   └── layout.tsx
├── lib/
│   ├── auth.ts          - Password hashing, ID generation
│   ├── prisma.ts        - Prisma client singleton
│   ├── nextauth.ts      - NextAuth configuration
│   └── rbac.ts          - Role-based middleware
├── prisma/
│   ├── schema.prisma    - Database schema
│   └── migrations/      - Migration files
├── .env.local           - Environment variables (git-ignored)
├── tsconfig.json        - TypeScript configuration
├── next.config.js       - Next.js configuration
├── package.json         - Dependencies
└── prisma.config.ts     - Prisma configuration
```

---

## Environment Variables

Create `.env.local` in the root:

```env
# Database
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/mohr_db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# Node Environment
NODE_ENV="development"
```

---

## Running the Project

### Installation
```bash
npm install
```

### Database Setup
```bash
# Run migrations
npx prisma migrate dev --name init

# View database (visual editor)
npx prisma studio
```

### Development
```bash
npm run dev
```
Server runs at: http://localhost:3000

### Build
```bash
npm run build
npm run start
```

---

## HR Policies Implemented

### Leave Policy
- **Vacation**: 20 days/year, 7-day advance notice, 5 days carryover
- **Sick Leave**: 10 days/year, same-day notification, no carryover
- **Personal**: 3 days/year, 3-day advance notice, no carryover
- **Maternity**: 90 days (one-time)
- **Paternity**: 14 days (one-time)
- **Unpaid**: Unlimited (with approval)

### Attendance Policy
- Working Hours: 9 AM - 6 PM (9 hours with 1 hour lunch)
- Late: > 9:30 AM
- Early Departure: < 5:30 PM
- Monthly Target: 95%

### Room Booking Policy
- Can book: 7 days in advance
- Max duration: 8 hours per booking
- No overlapping bookings
- Must cancel 24 hours before
- Auto-cleanup if not cancelled 1 hour after end time

---

## Key Files Explained

### lib/auth.ts
Password hashing, verification, and employee ID generation functions.

### lib/prisma.ts
Singleton Prisma client instance to avoid connection issues in serverless environments.

### lib/nextauth.ts
NextAuth configuration with CredentialsProvider, JWT callbacks, and role injection.

### lib/rbac.ts
Middleware function for checking user authentication and role authorization.

### app/api/auth/register/route.ts
User registration endpoint that creates:
1. User account (with hashed password)
2. Employee record (with auto-generated ID)
3. LeaveBalance entry (with yearly allocation)

---

## Common Tasks

### Add a New Employee
```bash
POST /api/employees
Content-Type: application/json
Authorization: Bearer {token}

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "position": "Senior Developer",
  "department": "Engineering",
  "phone": "+1234567890"
}
```

### Request Leave
```bash
POST /api/leave
Content-Type: application/json
Authorization: Bearer {token}

{
  "leaveType": "VACATION",
  "startDate": "2024-12-20",
  "endDate": "2024-12-25",
  "reason": "Family vacation"
}
```

### Check-in
```bash
POST /api/attendance/checkin
Authorization: Bearer {token}
```

### Book a Room
```bash
POST /api/rooms/book
Content-Type: application/json
Authorization: Bearer {token}

{
  "roomId": "room-id",
  "bookedDate": "2024-12-20",
  "startTime": "2024-12-20T10:00:00",
  "endTime": "2024-12-20T11:00:00",
  "purpose": "Team meeting"
}
```

---

## Troubleshooting

### Database Connection Issues
1. Verify PostgreSQL is running
2. Check DATABASE_URL in .env.local
3. Ensure mohr_db database exists
4. Run: `npx prisma db push`

### Missing Environment Variables
1. Copy template from .env.example
2. Add values to .env.local
3. Restart dev server

### TypeScript Errors
1. Run: `npm run build`
2. Check tsconfig.json paths match directory structure
3. Ensure all imports use @/ alias

### Prisma Schema Changes
1. Update prisma/schema.prisma
2. Run: `npx prisma migrate dev --name descriptive_name`
3. Restart dev server

---

## Security Considerations

- ✅ Passwords hashed with bcryptjs (10 rounds)
- ✅ Role-based access control on all endpoints
- ✅ JWT tokens for session management
- ✅ Environment variables not committed
- ⚠️ TODO: Add CSRF protection
- ⚠️ TODO: Add rate limiting
- ⚠️ TODO: Add input validation/sanitization
- ⚠️ TODO: Add error logging

---

## Future Enhancements

- [ ] Email notifications for leave approvals
- [ ] Attendance reports/analytics
- [ ] Leave calendar view
- [ ] Performance reviews
- [ ] Payroll integration
- [ ] Mobile app
- [ ] Multi-organization support
- [ ] Advanced reporting

---

## Contact & Support

For issues or questions about the backend, refer to this documentation or check the API route implementations in `app/api/`.

**Last Updated**: November 2024
**Version**: 1.0.0
