# GHL Custom Frontend - Technical Knowledge Base

## Project Overview
- Project Name: Fast AI Boss (GHL Custom Frontend)
- Purpose: Custom AI-powered frontend for GoHighLevel to streamline SaaS operations.

## Tech Stack
- **Framework:** Next.js 15
- **Auth:** Firebase Authentication
- **Database:** Firestore (Firebase)
- **Deployment:** Vercel (Frontend), Firebase Functions (Backend)
- **Firebase Services:** Auth, Firestore, Cloud Functions

## Completed Features
### 1. **Authentication**
- Email/Password login & signup
- Google login
- Secure logout
- Role-based access: admin/user

### 2. **User Profile Management**
- `createUserProfile` Firebase Function deployed on user creation.
- Stores:
  - Email
  - Role (default `user`)
  - subAccountId
  - ghlApiKey
  - createdAt timestamp

### 3. **Firestore Rules**
- Only users can access their own document
- Admin-only access to `/admin/*`
- `isAdmin()` function implemented in rules

### 4. **Dashboard**
- Sidebar with role-based visibility
  - Only Admins can see Settings
- Logout button functional
- Route protection for authenticated users

### 5. **UI Enhancements**
- Custom theme & branding (FastlineGroup)
- Lottie animation for login screen
- Responsive layout

### 6. **Vercel Deployment**
- Firebase functions excluded from build via `ignoreCommand`
- GitHub-integrated CI/CD

## Notes
- Ensure Blaze plan on Firebase for Cloud Functions
- All new users automatically get a Firestore profile
- Admin flag must be set in Firestore for full access

---

_Last Updated: 2025-07-13 20:46:26_
