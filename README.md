# Primetrade Authentication Frontend

A complete authentication system built with React 19, Vite, Tailwind CSS 4, and Context API.

## Features

✅ **Complete Authentication System** - All 10 backend auth endpoints implemented
✅ **JWT Token Management** - Automatic token refresh with axios interceptors
✅ **Protected Routes** - Route guards for authenticated and public routes
✅ **Context API State Management** - Following the pattern from 05ContextApiTodo
✅ **Form Validation** - Client-side validation with clear error messages
✅ **Responsive Design** - Mobile-first Tailwind CSS styling
✅ **Email Verification** - Complete email verification flow
✅ **Password Reset** - Forgot password and reset password flows

## Tech Stack

- **React** 19.2.0
- **Vite** 7.3.1
- **Tailwind CSS** 4.1.18
- **React Router DOM** 7.1.3
- **Axios** 1.8.3

## Implemented Auth Flows

### Public Routes (No Authentication Required)
1. **Register** - `/register` - Create new account
2. **Login** - `/login` - Login to existing account
3. **Email Verification** - `/verify-email/:token` - Verify email from link
4. **Forgot Password** - `/forgot-password` - Request password reset
5. **Reset Password** - `/reset-password/:token` - Reset password from email link

### Protected Routes (Authentication Required)
6. **Dashboard** - `/dashboard` - User dashboard (default after login)
7. **Change Password** - `/change-password` - Change account password
8. **Resend Verification** - `/resend-verification` - Resend verification email

### Additional Features
9. **Token Refresh** - Automatic background token refresh
10. **Logout** - Logout and clear tokens

## Project Structure

```
frontend/src/
├── App.jsx                     # Main app with routing & auth state
├── main.jsx                    # React entry point
├── index.css                   # Tailwind imports
├── contexts/
│   ├── AuthContext.js         # Auth context (TodoContext pattern)
│   └── index.js               # Barrel export
├── components/
│   ├── ProtectedRoute.jsx     # Protected route guard
│   ├── PublicRoute.jsx        # Public route guard
│   ├── ui/
│   │   ├── Input.jsx          # Reusable input component
│   │   ├── Button.jsx         # Reusable button component
│   │   ├── ErrorMessage.jsx   # Error display component
│   │   └── LoadingSpinner.jsx # Loading indicator
│   └── layout/
│       ├── AuthLayout.jsx     # Auth pages layout
│       └── Header.jsx         # App header with logout
├── pages/
│   ├── Login.jsx              # Login page
│   ├── Register.jsx           # Registration page
│   ├── VerifyEmail.jsx        # Email verification page
│   ├── ForgotPassword.jsx     # Forgot password page
│   ├── ResetPassword.jsx      # Reset password page
│   ├── Dashboard.jsx          # Dashboard page
│   ├── ChangePassword.jsx     # Change password page
│   └── ResendVerification.jsx # Resend verification page
├── utils/
│   ├── api.js                 # Axios instance with interceptors
│   └── validators.js          # Form validation helpers
└── constants/
    └── index.js               # API endpoints & validation rules
```

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Backend server running on `http://localhost:8000`

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment configuration**

   The `.env` file is already configured with:
   ```
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   ```

   Update if your backend runs on a different port.

4. **Start development server**
   ```bash
   npm run dev
   ```

   The app will run on `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```

## Testing the Application

### 1. Start the Backend
First, ensure the backend is running:
```bash
cd ../backend
npm run dev
```
Backend should be running on `http://localhost:8000`

### 2. Start the Frontend
```bash
cd ../frontend
npm run dev
```
Frontend will be available at `http://localhost:5173`

### 3. Test Authentication Flows

#### Registration Flow
1. Visit `http://localhost:5173/register`
2. Fill in the registration form:
   - Email: `test@example.com`
   - Username: `testuser`
   - Password: `test123`
   - Confirm Password: `test123`
3. Click "Register"
4. You should see success message
5. Check Mailtrap (configured in backend) for verification email

#### Email Verification Flow
1. Copy the verification link from the email
2. Paste it in the browser
3. Email should be verified
4. Click "Go to Login"

#### Login Flow
1. Visit `http://localhost:5173/login`
2. Enter credentials:
   - Email: `test@example.com`
   - Password: `test123`
3. Click "Login"
4. You should be redirected to the dashboard
5. Check localStorage in DevTools - tokens should be stored

#### Dashboard (Protected Route)
1. After login, you're on the dashboard
2. Should see your account information
3. Email verification status displayed
4. Quick action links available

#### Protected Route Testing
1. While logged in, try visiting `/login` → Redirected to `/dashboard`
2. Click "Logout"
3. Try visiting `/dashboard` → Redirected to `/login`
4. Refresh page while logged out → Still redirected to `/login`

#### Forgot Password Flow
1. Click "Forgot password?" on login page
2. Enter email: `test@example.com`
3. Click "Send Reset Link"
4. Check Mailtrap for reset email
5. Copy reset link and visit it
6. Enter new password
7. Click "Reset Password"
8. Login with new password

#### Change Password Flow (Protected)
1. Login to your account
2. Click "Change Password" on dashboard
3. Enter:
   - Current Password
   - New Password
   - Confirm New Password
4. Click "Change Password"
5. Success message should appear
6. Logout and login with new password

#### Token Refresh Testing
1. Login to account
2. Open DevTools → Application → Local Storage
3. Note the `primetrade_access_token` value
4. Wait (or manually expire the token)
5. Make any API request (e.g., navigate to change password)
6. Check Network tab - should see automatic token refresh
7. New token stored in localStorage

#### Resend Verification Flow
1. Login with unverified account
2. Visit `/resend-verification`
3. Click "Resend Verification Email"
4. Check Mailtrap for new verification email

## API Integration

The frontend communicates with these backend endpoints:

### Public Endpoints
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/verify-email/:token` - Verify email
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password/:token` - Reset password

### Protected Endpoints (Require JWT)
- `POST /api/v1/auth/logout` - Logout user
- `POST /api/v1/auth/current-user` - Get current user
- `POST /api/v1/auth/change-password` - Change password
- `POST /api/v1/auth/resend-email-verification` - Resend verification

## Context API Pattern

This project follows the exact Context API pattern from `05ContextApiTodo/`:

1. **Context Definition** (`AuthContext.js`)
   - Default context with state and action stubs
   - Custom hook: `useAuthContext()`
   - Export Provider: `AuthProvider`

2. **State Management** (`App.jsx`)
   - Single `useState` for all auth state
   - Action creators using functional updates
   - `AuthProvider` wraps entire app

3. **Component Usage**
   - Use `useAuthContext()` hook
   - Destructure only needed state/actions
   - Local state for form inputs

## Key Features Explained

### Automatic Token Refresh
The axios interceptor automatically:
- Adds JWT token to all requests
- Catches 401 errors
- Refreshes token using refresh token
- Retries failed request with new token
- Queues requests during refresh
- Redirects to login if refresh fails

### Protected Routes
- `ProtectedRoute` - Requires authentication, redirects to `/login`
- `PublicRoute` - Only for unauthenticated, redirects to `/dashboard`
- Loading state handled during auth check

### Form Validation
- Client-side validation before API call
- Email format validation
- Password length validation
- Confirm password matching
- Clear error messages per field

### Token Storage
- Access token: `primetrade_access_token`
- Refresh token: `primetrade_refresh_token`
- Stored in localStorage
- Cleared on logout

## Troubleshooting

### Backend Connection Issues
- Ensure backend is running on `http://localhost:8000`
- Check CORS settings in backend allow `http://localhost:5173`
- Verify `.env` file has correct `VITE_API_BASE_URL`

### Email Verification Not Working
- Check Mailtrap configuration in backend `.env`
- Look for verification link in Mailtrap inbox
- Ensure token hasn't expired (20-minute validity)

### Token Refresh Failing
- Check refresh token in localStorage is valid
- Verify backend `/auth/refresh-token` endpoint working
- Clear localStorage and login again

### Routes Not Working
- Ensure React Router is properly configured
- Check browser console for errors
- Verify all components are imported correctly

## Development Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Security Features

- JWT tokens stored in localStorage
- HttpOnly cookies (backend managed)
- Automatic token refresh
- Protected route guards
- Client-side validation
- Secure password requirements

## Contributing

This project follows the Context API pattern from `05ContextApiTodo/`. When adding new features:

1. Follow the same folder structure
2. Use functional updates in state management
3. Create barrel exports (index.js) for all directories
4. Use Tailwind for styling
5. Keep components simple and beginner-friendly

## License

Copyright © 2026 Primetrade. All rights reserved.
