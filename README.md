# 🎓 Smart Learning - Comprehensive System Documentation

**Created by:** Haritz @2025 CreativeJawiProduction.prod  
**Version:** 1.0.0  
**Last Updated:** December 7, 2025

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [User Roles & Permissions](#user-roles--permissions)
4. [Functional Specifications](#functional-specifications)
5. [Business Processes](#business-processes)
6. [Workflow Diagrams](#workflow-diagrams)
7. [Database Schema](#database-schema)
8. [API Endpoints](#api-endpoints)
9. [Security Features](#security-features)
10. [Installation Guide](#installation-guide)
11. [Testing Procedures](#testing-procedures)
12. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

**Smart Learning** adalah platform pembelajaran interaktif untuk anak-anak SD (kelas 1-6) dengan sistem monitoring komprehensif untuk orang tua dan pengelolaan user yang canggih untuk admin.

### **Core Features:**
- ✅ **Interactive Learning** - Matematika & Bahasa Inggris dengan AI
- ✅ **Parent Monitoring** - Real-time KPI tracking & smart recommendations
- ✅ **User Management** - Multi-role system dengan approval workflow
- ✅ **Audit Trail** - Comprehensive logging untuk semua aktivitas
- ✅ **Security** - Brute force detection, session management, IP tracking

### **Technology Stack:**
- **Frontend:** Next.js 16 (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Node.js
- **Database:** PostgreSQL 17.2
- **Authentication:** JWT (JSON Web Tokens)
- **Encryption:** bcrypt for password hashing
- **Icons:** Lucide React

---

## 🏗️ System Architecture

### **Architecture Type:** Monolithic with Modular Structure

```
smart-learning/
├── src/
│   ├── app/
│   │   ├── api/                    # API Routes
│   │   │   ├── auth/               # Authentication endpoints
│   │   │   ├── admin/              # Admin endpoints
│   │   │   ├── superadmin/         # SuperAdmin endpoints
│   │   │   └── progress/           # Learning progress endpoints
│   │   ├── dashboard/              # Dashboard pages
│   │   │   ├── superadmin/         # SuperAdmin dashboard
│   │   │   ├── admin/              # Admin dashboard
│   │   │   ├── parent/             # Parent dashboard
│   │   │   └── child/              # Child learning interface
│   │   ├── login/                  # Login page
│   │   └── register/               # Registration page
│   ├── lib/                        # Shared libraries
│   └── components/                 # Reusable components
├── public/                         # Static assets
├── scripts/                        # Utility scripts
└── database/                       # SQL migrations

PostgreSQL Database (16 tables, 6 helper functions)
```

### **Data Flow:**

```
User → Next.js Frontend → API Routes → Database → Response
                  ↓
            Audit Logging
                  ↓
         Security Monitoring
```

---

## 👥 User Roles & Permissions

### **5-Tier Role Hierarchy:**

| Role | Access Level | Key Capabilities |
|------|-------------|------------------|
| **SuperAdmin** | Full System | All CRUD operations, system settings, security management |
| **Admin** | User Management | Approve/reject registrations, view users (read-only), audit access |
| **Parent** | Monitoring | View children's progress, access KPIs, receive recommendations |
| **Teacher** | (Future) | Assign tasks, grade work, monitor class progress |
| **Child** | Learning | Access learning modules, take quizzes, earn points |

### **Detailed Permission Matrix:**

#### **SuperAdmin Capabilities:**
- ✅ Create/Edit/Delete any user
- ✅ Change user roles
- ✅ Suspend/Activate accounts
- ✅ View all audit trails
- ✅ Manage security events
- ✅ Delete audit logs (with high-severity logging)
- ✅ System configuration
- ❌ Cannot delete own account
- ❌ Cannot delete other SuperAdmins (safety)

#### **Admin Capabilities:**
- ✅ Approve parent registrations
- ✅ Reject registrations with reason
- ✅ Auto-create child accounts on approval
- ✅ View all users (read-only)
- ✅ View pending registrations
- ✅ Access audit trail (read-only)
- ❌ Cannot edit existing users
- ❌ Cannot delete users
- ❌ Cannot modify audit trail

#### **Parent Capabilities:**
- ✅ Register with NIK validation
- ✅ Add 1-5 children during registration
- ✅ View own dashboard
- ✅ Monitor all children's progress
- ✅ Access 6 KPIs per child
- ✅ View recommendations
- ✅ Change own password
- ❌ Cannot access other parents' data
- ❌ Cannot edit children's accounts

#### **Child Capabilities:**
- ✅ Login with generated credentials
- ✅ Access learning modules
- ✅ Practice Math & English
- ✅ View own progress
- ✅ Earn points & badges
- ✅ Change password
- ❌ Cannot see other children's data
- ❌ Cannot access admin features

---

## 📊 Functional Specifications

### **1. User Registration System**

#### **Features:**
- **3-Step Registration Form**
  - Step 1: Parent Data (NIK, name, email, password, contact)
  - Step 2: Children Data (1-5 children with age & grade)
  - Step 3: Verification & Submit

#### **Business Rules:**
- NIK must be exactly 16 digits
- NIK must be unique (checked against users + pending_registrations)
- Email must be unique
- Password minimum 8 characters
- Must add at least 1 child (maximum 5)
- Children ages: 6-12 years
- Children grades: 1-6 (Kelas 1-6 SD)

#### **Workflow:**
```
User fills form → Validate inputs → Check NIK uniqueness → 
Check email uniqueness → Hash password → Generate verification token → 
Insert to pending_registrations → Send verification email → 
Wait for admin approval
```

#### **Database Impact:**
- INSERT into `pending_registrations` table
- INSERT into `audit_visitors` (if anonymous)
- INSERT into `email_notifications`

---

### **2. Admin Approval Workflow**

#### **Approval Process:**

**Step-by-Step:**

1. **Admin views pending registrations**
   - GET /api/admin/pending-registrations
   - Displays: NIK, name, email, phone, children count

2. **Admin clicks "View Detail"**
   - Modal shows full parent info
   - Lists all children with age/grade

3. **Admin decides: Approve or Reject**

**If APPROVE:**
```
BEGIN TRANSACTION
  → Create parent user (role='parent', status='active')
  → For each child:
      → Generate username (e.g., budi1245)
      → Generate random password (12 chars)
      → Hash password
      → Create child user (role='child', status='active')
      → Link parent_children relationship
  → Update pending_registrations (status='approved')
  → Send approval email with children credentials
  → Log admin activity
  → Log data change
COMMIT TRANSACTION
```

**If REJECT:**
```
BEGIN TRANSACTION
  → Update pending_registrations (status='rejected', rejection_reason)
  → Send rejection email
  → Log admin activity
  → Log data change
COMMIT TRANSACTION
```

#### **Auto-Generated Credentials:**

**Username Format:**
```javascript
cleanedName + index + randomDigits
Example: "Budi Santoso" (child 1) → "budi1245"
```

**Password Format:**
```javascript
12 characters: uppercase + lowercase + numbers + symbols
Example: "aB3$xY9@mN4!"
```

#### **Email Notifications:**

**Approval Email:**
```html
Subject: Pendaftaran Disetujui - Smart Learning

Body:
- Welcome message
- HTML table with children credentials:
  | No | Nama Anak | Username | Password | Info |
- Security warnings
- Login instructions
- Login button link
```

**Rejection Email:**
```html
Subject: Pendaftaran Ditolak - Smart Learning

Body:
- Apology message
- Rejection reason (in colored box)
- Contact information for support
- Invitation to re-register with correct data
```

---

### **3. Login & Authentication System**

#### **Login Process:**

```
User enters email + password → 
POST /api/auth/login → 
Check user exists → 
Check account status → 
Check account lock (5 failed attempts) → 
Verify password (bcrypt) → 
Generate JWT token (24h expiry) → 
Create session in user_sessions → 
Log login attempt → 
Update user.last_login → 
Return token + user data
```

#### **Account Lock Mechanism:**

**Triggers:**
- 5 failed login attempts within any timeframe

**Behavior:**
- Account locked for 30 minutes
- During lock: Return 429 Too Many Requests
- After 30 min: Auto-unlock, reset counter
- Log security_event (brute_force)

#### **Session Management:**

**Session Data:**
```javascript
{
  user_id: number,
  session_token: string (UUID),
  refresh_token: string (UUID),
  ip_address: string,
  device_type: 'mobile' | 'tablet' | 'desktop',
  browser: string,
  os: string,
  login_at: timestamp,
  expires_at: timestamp (login_at + 24h),
  is_active: boolean
}
```

**Session Expiry:**
- JWT: 24 hours
- Session table: 24 hours
- Auto-cleanup of expired sessions (can be scheduled)

#### **Role-Based Redirect:**

After successful login:
```javascript
if (role === 'superadmin') → /dashboard/superadmin
if (role === 'admin') → /dashboard/admin
if (role === 'parent') → /dashboard/parent
if (role === 'child') → /dashboard/child
if (role === 'teacher') → /dashboard/teacher
```

---

### **4. Parent Dashboard - Monitoring System**

#### **6 Key Performance Indicators (KPIs):**

**1. Overall Progress (0-100%)**
```javascript
Formula:
activity_score = min(total_questions / 100 * 50, 50)
accuracy_score = (avg_accuracy / 100) * 50
overall_progress = activity_score + accuracy_score
```

**2. Consistency Score (0-100%)**
```javascript
Formula:
active_days = COUNT(DISTINCT activity_date) FROM daily_activities WHERE activity_date >= CURRENT_DATE - 30
consistency_score = (active_days / 30) * 100
```

**3. Improvement Rate (%)**
```javascript
Formula:
current_week = weekly_summaries[0].weekly_accuracy
last_week = weekly_summaries[1].weekly_accuracy
improvement_rate = ((current_week - last_week) / last_week) * 100
```

**4. Learning Velocity (questions/day)**
```javascript
Formula:
total_questions_7days = SUM(total_questions) FROM daily_activities WHERE activity_date >= CURRENT_DATE - 7
learning_velocity = total_questions_7days / 7
```

**5. Focus Score (0-100%)**
```javascript
Formula:
sessions_by_subject = GROUP BY subject FROM learning_sessions
std_deviation = STDDEV(sessions_count)
focus_score = 100 - (std_deviation * 10)

// Lower std dev = more balanced study = higher score
```

**6. Mastery Distribution**
```javascript
Count topics by mastery_status:
- mastered
- practiced
- learning  
- not_started
```

#### **Smart Recommendations Engine:**

**Algorithm:**

```javascript
recommendations = []

// 1. Check overall accuracy
if (avg_accuracy < 60) {
  recommendations.push({
    type: 'urgent',
    title: 'Review Basic Concepts',
    description: 'Child is struggling with fundamentals',
    action: 'Focus on easier questions to build confidence'
  })
}

// 2. Check consistency
if (consistency_score < 40) {
  recommendations.push({
    type: 'urgent',
    title: 'Increase Study Frequency',
    description: 'Child is not studying regularly',
    action: 'Set a daily study schedule (15-20 min/day)'
  })
}

// 3. Check weak subjects
for (subject in subject_performance) {
  if (subject.accuracy < 70) {
    recommendations.push({
      type: 'warning',
      title: `Improve ${subject.name} Skills`,
      description: `Accuracy is ${subject.accuracy}%`,
      action: `Practice ${subject.name} for 10 min daily`
    })
  }
}

// 4. Check improvement trend
if (improvement_rate < -10) {
  recommendations.push({
    type: 'urgent',
    title: 'Performance Declining',
    description: `Down ${Math.abs(improvement_rate)}% from last week`,
    action: 'Review recent topics, check for distractions'
  })
}

// 5. Celebrate success
if (improvement_rate > 10) {
  recommendations.push({
    type: 'success',
    title: 'Great Progress!',
    description: `Up ${improvement_rate}% from last week`,
    action: 'Keep up the excellent work!'
  })
}

return recommendations.sort((a, b) => b.priority - a.priority)
```

#### **Dashboard Tabs:**

**Tab 1: Overview**
- 3 KPI cards (Overall Progress, Learning Velocity, Focus Score)
- Recent Activity Timeline (last 7 days)
- Daily accuracy bars with color coding

**Tab 2: By Subject**
- Subject cards (Math & English)
- Total sessions, Accuracy rate, Mastery level
- Grade (A+, A, B, C)
- Progress to next level bar

**Tab 3: Progress Chart**
- Weekly Progress (bar chart, 8 weeks)
- Daily Accuracy Trend (line chart, 14 days)
- SVG-based charts with animations

**Tab 4: Recommendations**
- AI-generated recommendations
- 4 types: Urgent (red), Warning (yellow), Success (green), Info (blue)
- Action plans for each

---

### **5. SuperAdmin Dashboard - User Management**

#### **Features:**

**User Table:**
- Paginated list (20 users per page)
- Columns: ID, Name, Email, Role, Status, Created Date, Actions
- Real-time search by name/email
- Filter by role (all/superadmin/admin/parent/teacher/child)
- Filter by status (all/active/pending/suspended/rejected/deleted)

**CRUD Operations:**

**CREATE (Indirect):**
- Users are created via registration + approval workflow
- SuperAdmin can manually edit to create-like effect

**READ:**
- GET /api/superadmin/users
- View all user details
- Search & filter capabilities

**UPDATE:**
- PUT /api/superadmin/edit-user
- Edit: full_name, email, role, status, password, NIK, phone, etc.
- Dynamic update (only changed fields)
- Full audit trail logging

**DELETE (Soft Delete):**
- DELETE /api/superadmin/delete-user?user_id={id}
- Sets status='deleted'
- Stores deletion metadata in JSON field
- Cannot delete own account
- Cannot delete other SuperAdmins
- If parent deleted → auto-delete children
- Logs high-severity security event

#### **Edit User Modal:**

**Editable Fields:**
```javascript
{
  full_name: string,
  email: string,
  role: 'superadmin' | 'admin' | 'parent' | 'teacher' | 'child',
  status: 'pending' | 'active' | 'suspended' | 'rejected',
  password: string (optional - leave empty to keep current),
  nik: string (16 digits),
  phone: string,
  whatsapp: string,
  address: string,
  age: number (for children),
  grade_level: number (for children)
}
```

**Validation:**
- Email uniqueness check (exclude current user)
- Role must be valid enum
- Status must be valid enum
- If password provided: hash with bcrypt

---

## 🔄 Business Processes

### **Process 1: Parent Registration → Account Creation**

```mermaid
graph TD
    A[Parent visits /register] --> B[Fill 3-step form]
    B --> C{Validate inputs}
    C -->|Invalid| B
    C -->|Valid| D[Check NIK uniqueness]
    D -->|Duplicate| E[Show error]
    D -->|Unique| F[Check email uniqueness]
    F -->|Duplicate| E
    F -->|Unique| G[Hash password]
    G --> H[Generate verification token]
    H --> I[INSERT pending_registrations]
    I --> J[Log visitor activity]
    J --> K[Send verification email]
    K --> L[Show success screen]
    L --> M[Wait for admin approval]
    
    M --> N{Admin Decision}
    N -->|Approve| O[Create parent user]
    O --> P[Generate child usernames]
    P --> Q[Generate child passwords]
    Q --> R[Create child users]
    R --> S[Link parent_children]
    S --> T[Update registration status]
    T --> U[Send approval email with credentials]
    U --> V[Parent & children can login]
    
    N -->|Reject| W[Update registration status]
    W --> X[Send rejection email]
    X --> Y[End - Registration rejected]
```

### **Process 2: Daily Learning Session**

```mermaid
graph TD
    A[Child logs in] --> B[Session created in user_sessions]
    B --> C[Navigate to subject]
    C --> D[Select difficulty level]
    D --> E[START: Learning session]
    E --> F[Display question]
    F --> G[Child answers]
    G --> H{Check answer}
    H -->|Correct| I[+10 points, streak++]
    H -->|Wrong| J[Show explanation, streak=0]
    I --> K{More questions?}
    J --> K
    K -->|Yes| F
    K -->|No| L[END: Save session]
    
    L --> M[INSERT learning_sessions]
    M --> N[Trigger: Update subject_performance]
    N --> O[Trigger: Update daily_activities]
    O --> P[Calculate accuracy]
    P --> Q[Determine mastery level]
    Q --> R[Update KPIs]
    R --> S[Generate recommendations]
    S --> T[Parent dashboard updated]
```

### **Process 3: Admin Approval Workflow**

```mermaid
graph LR
    A[Pending Registration] --> B[Admin views queue]
    B --> C[Click View Detail]
    C --> D{Decision}
    
    D -->|Approve| E[BEGIN TRANSACTION]
    E --> F[Create parent user]
    F --> G[Loop: Create children]
    G --> H[Generate credentials]
    H --> I[Link relationships]
    I --> J[Update registration]
    J --> K[Send approval email]
    K --> L[Log activities]
    L --> M[COMMIT]
    
    D -->|Reject| N[BEGIN TRANSACTION]
    N --> O[Enter rejection reason]
    O --> P[Update registration]
    P --> Q[Send rejection email]
    Q --> R[Log activities]
    R --> S[COMMIT]
```

### **Process 4: Security Monitoring**

```mermaid
graph TD
    A[User Action] --> B{Track Event}
    
    B -->|Login Attempt| C[Log to audit_login_attempts]
    C --> D{Success?}
    D -->|No| E[Increment failed_login_count]
    E --> F{Count >= 5?}
    F -->|Yes| G[Lock account for 30 min]
    G --> H[INSERT security_event: brute_force]
    F -->|No| I[Continue]
    
    B -->|Post-Login Activity| J[Log to audit_user_activities]
    J --> K{Category}
    K -->|CRUD| L[Log to audit_data_changes]
    K -->|Navigation| M[Log page view]
    K -->|Authentication| N[Log session event]
    
    B -->|Suspicious Activity| O[Calculate risk score]
    O --> P{Risk > 70?}
    P -->|Yes| Q[INSERT security_event]
    Q --> R[Flag for review]
```

---

## 🗄️ Database Schema

### **16 Tables Total:**

#### **Core Tables (10):**

1. **users** - Central user table
   ```sql
   id SERIAL PRIMARY KEY
   full_name VARCHAR(255)
   email VARCHAR(255) UNIQUE
   password TEXT (bcrypt hash)
   role VARCHAR(50) CHECK (superadmin, admin, parent, teacher, child)
   status VARCHAR(50) CHECK (pending, active, suspended, rejected, deleted)
   nik VARCHAR(16) UNIQUE
   phone, whatsapp, address
   age, grade_level (for children)
   parent_id (for children, FK to users.id)
   approved_by, approved_at
   last_login, login_count, failed_login_count
   created_at, updated_at
   notes TEXT
   metadata JSONB
   ```

2. **pending_registrations** - Registration queue
   ```sql
   id SERIAL PRIMARY KEY
   nik VARCHAR(16) UNIQUE
   full_name, email UNIQUE, password_hash
   phone, whatsapp, address
   children_data JSONB (array of {full_name, age, grade_level})
   number_of_children INT
   verification_token
   status CHECK (pending, approved, rejected)
   reviewed_by FK, reviewed_at, rejection_reason
   ip_address, user_agent, country, city, lat/long
   created_at
   ```

3. **parent_children** - Parent-child relationships
   ```sql
   id SERIAL PRIMARY KEY
   parent_id FK to users.id
   child_id FK to users.id
   relationship_status CHECK (active, inactive)
   created_at
   UNIQUE(parent_id, child_id)
   ```

4. **learning_sessions** - Learning activity records
   ```sql
   id SERIAL PRIMARY KEY
   user_id FK to users.id
   subject VARCHAR(50) CHECK (math, english)
   level VARCHAR(50)
   total_questions, correct_answers, total_points
   accuracy DECIMAL
   started_at, ended_at
   ```

5. **subject_performance** - Performance aggregation
   ```sql
   id SERIAL PRIMARY KEY
   user_id FK
   subject, level
   total_sessions, total_questions, correct_answers
   accuracy_rate
   mastery_level CHECK (beginner, intermediate, advanced, expert)
   last_session_at
   ```

6. **topic_mastery** - Topic-level tracking
   ```sql
   id SERIAL PRIMARY KEY
   user_id FK
   subject, topic
   mastery_status CHECK (not_started, learning, practiced, mastered)
   attempts, correct_count
   last_attempt_at
   ```

7. **daily_activities** - Daily aggregation
   ```sql
   id SERIAL PRIMARY KEY
   user_id FK
   activity_date DATE
   subject
   total_questions, correct_answers
   daily_accuracy
   session_count
   total_time_minutes
   UNIQUE(user_id, activity_date, subject)
   ```

8. **weekly_summaries** - Weekly aggregation
   ```sql
   id SERIAL PRIMARY KEY
   user_id FK
   week_start_date DATE
   total_sessions, total_questions
   weekly_accuracy
   improvement_from_last_week
   created_at
   UNIQUE(user_id, week_start_date)
   ```

9. **parent_insights** - AI-generated insights
   ```sql
   id SERIAL PRIMARY KEY
   parent_id FK
   child_id FK
   insight_type CHECK (improvement, concern, achievement)
   title, description
   priority INT
   created_at
   ```

10. **study_recommendations** - Smart recommendations
    ```sql
    id SERIAL PRIMARY KEY
    user_id FK (child)
    recommendation_type CHECK (urgent, warning, success, info)
    category, title, description
    action_plan TEXT
    priority INT
    created_at
    ```

#### **Audit Tables (6):**

11. **audit_visitors** - Anonymous visitor tracking
12. **audit_login_attempts** - Login attempt logs
13. **audit_user_activities** - Post-login activities
14. **audit_data_changes** - CRUD operation logs
15. **security_events** - Security incident logs
16. **user_sessions** - Active session tracking
17. **email_notifications** - Email tracking

### **6 Helper Functions:**

1. `check_nik_exists(nik) → boolean`
2. `log_visitor(...) → visitor_id`
3. `log_login_attempt(...) → attempt_id`
4. `log_user_activity(...) → activity_id`
5. `log_data_change(...) → change_id`
6. `calculate_accuracy(correct, total) → decimal`

---

## 🔌 API Endpoints

### **Authentication Endpoints:**

```
POST /api/auth/register
Body: { parent: {...}, children: [{...}] }
Response: { success, message, registration_id }

GET /api/auth/check-nik?nik=3201234567890001
Response: { exists: boolean }

POST /api/auth/login
Body: { email, password }
Response: { success, token, user: {...} }
```

### **Admin Endpoints:**

```
GET /api/admin/pending-registrations?status=pending
Headers: Authorization: Bearer {token}
Response: { success, data: [...] }

POST /api/admin/approve-registration
Headers: Authorization: Bearer {token}
Body: { registration_id }
Response: { success, parent_id, children_count, email_sent }

POST /api/admin/reject-registration
Headers: Authorization: Bearer {token}
Body: { registration_id, rejection_reason }
Response: { success, message }
```

### **SuperAdmin Endpoints:**

```
GET /api/superadmin/users?page=1&limit=20&role=parent&status=active&search=john
Headers: Authorization: Bearer {token}
Response: { success, data: { users, pagination, statistics } }

PUT /api/superadmin/edit-user
Headers: Authorization: Bearer {token}
Body: { user_id, full_name, email, role, status, password, ... }
Response: { success, user, changed_fields }

DELETE /api/superadmin/delete-user?user_id=123
Headers: Authorization: Bearer {token}
Response: { success, deleted_user, deleted_children }
```

### **Parent Dashboard Endpoint:**

```
GET /api/progress/parent/dashboard
Headers: Authorization: Bearer {token}
Response: {
  success,
  data: {
    parent: {...},
    children: [
      {
        child: {...},
        overall_statistics: {...},
        subject_performance: [...],
        weekly_progress: [...],
        daily_activity: [...],
        kpis: {
          overall_progress: 75,
          consistency_score: 80,
          improvement_rate: 15,
          learning_velocity: 25,
          focus_score: 70
        },
        smart_recommendations: [...]
      }
    ]
  }
}
```

---

## 🔒 Security Features

### **1. Authentication Security:**

- **JWT Tokens:** 24-hour expiry with secret key
- **Password Hashing:** bcrypt with 10 salt rounds
- **Session Management:** Database-backed sessions with device tracking
- **Account Locking:** 5 failed attempts = 30-minute lockout

### **2. Brute Force Protection:**

```javascript
// After 5 failed login attempts:
if (user.failed_login_count >= 5) {
  const lockTime = new Date(user.last_failed_login).getTime() + (30 * 60 * 1000);
  if (Date.now() < lockTime) {
    // Still locked
    return { status: 429, error: 'Too Many Requests' };
  } else {
    // Unlock
    resetFailedLoginCount(user.id);
  }
}
```

### **3. Audit Trail:**

**5 Layers of Logging:**

1. **Anonymous Visitors** → audit_visitors
   - Session ID, IP, geolocation, page views, device info

2. **Login Attempts** → audit_login_attempts
   - All attempts (success + failure), IP, device, risk score

3. **User Activities** → audit_user_activities
   - Post-login actions, CRUD operations, navigation

4. **Data Changes** → audit_data_changes
   - Before/after snapshots, changed fields, change reason

5. **Security Events** → security_events
   - Brute force, suspicious activity, account lockouts

### **4. Role-Based Access Control (RBAC):**

```javascript
// Middleware example
function checkRole(allowedRoles: string[]) {
  return (req, res, next) => {
    const { role } = req.user; // From JWT
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

// Usage
app.get('/api/superadmin/users', 
  authenticate, 
  checkRole(['superadmin']), 
  getUsers
);
```

### **5. Input Validation:**

- **NIK:** Exactly 16 digits, unique
- **Email:** Valid format, unique
- **Password:** Min 8 characters
- **Age:** 6-12 for children
- **Grade:** 1-6 for children
- **SQL Injection:** Parameterized queries only

### **6. Security Events Auto-Detection:**

```javascript
// Automatic security event creation
if (failedLoginCount >= 5) {
  INSERT INTO security_events (
    event_type: 'brute_force',
    severity: 'high',
    title: 'Multiple Failed Login Attempts',
    description: `${failedLoginCount} failed attempts for ${email}`,
    user_id, email, ip_address
  );
}
```

---

## 📥 Installation Guide

### **Prerequisites:**
- Node.js 18+
- PostgreSQL 17.2
- npm or yarn

### **Step 1: Clone Repository**
```bash
git clone https://github.com/yourusername/smart-learning.git
cd smart-learning
```

### **Step 2: Install Dependencies**
```bash
npm install
# or
yarn install
```

Required packages:
```json
{
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "pg": "^8.11.0",
    "bcrypt": "^5.1.0",
    "jsonwebtoken": "^9.0.0",
    "lucide-react": "^0.263.0"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "@types/pg": "^8.11.0",
    "@types/jsonwebtoken": "^9.0.5",
    "typescript": "^5.0.0"
  }
}
```

### **Step 3: Database Setup**

**Create Database:**
```sql
CREATE DATABASE smart_learning;
```

**Run Migrations:**
```bash
psql -U postgres -d smart_learning -f database/migration-complete-system.sql
psql -U postgres -d smart_learning -f database/migration-parent-monitoring.sql
```

**Create Admin Users:**
```bash
node scripts/create-admin-users.js
```

Output:
```
✅ SuperAdmin created: superadmin@smartlearning.id / SuperAdmin@2025!
✅ Admin created: admin@smartlearning.id / Admin@2025!
⚠️  CHANGE PASSWORDS IMMEDIATELY!
```

### **Step 4: Environment Variables**

Create `.env.local`:
```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/smart_learning
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### **Step 5: Build & Run**

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm run build
npm start
```

### **Step 6: Verify Installation**

1. **Check Database:**
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   -- Should return 16 tables
   ```

2. **Test Login:**
   - Go to http://localhost:3000/login
   - Login as: `admin@smartlearning.id` / `Admin@2025!`
   - Should redirect to /dashboard/admin

3. **Test Registration:**
   - Go to http://localhost:3000/register
   - Fill form with test data
   - Check `pending_registrations` table

---

## 🧪 Testing Procedures

### **Test Scenario 1: Complete Registration → Approval Flow**

```bash
# 1. Register as parent
POST /register
{
  "parent": {
    "nik": "3201234567890001",
    "full_name": "Test Parent",
    "email": "parent.test@example.com",
    "password": "Test123456!",
    "phone": "08123456789"
  },
  "children": [
    { "full_name": "Budi", "age": 8, "grade_level": 2 },
    { "full_name": "Ani", "age": 10, "grade_level": 4 }
  ]
}

# 2. Check pending_registrations
SELECT * FROM pending_registrations WHERE email = 'parent.test@example.com';

# 3. Login as Admin
POST /api/auth/login
{ "email": "admin@smartlearning.id", "password": "Admin@2025!" }

# 4. Get pending registrations
GET /api/admin/pending-registrations?status=pending

# 5. Approve registration
POST /api/admin/approve-registration
{ "registration_id": 1 }

# 6. Check users created
SELECT * FROM users WHERE email LIKE '%test%';
-- Should show 3 users: 1 parent + 2 children

# 7. Check parent_children relationships
SELECT * FROM parent_children WHERE parent_id = (
  SELECT id FROM users WHERE email = 'parent.test@example.com'
);

# 8. Check email_notifications
SELECT * FROM email_notifications 
WHERE email_type = 'approval_granted' 
ORDER BY created_at DESC LIMIT 1;
-- Should contain children credentials in JSON

# 9. Test child login
POST /api/auth/login
{ 
  "email": "budi1245", // From email_notifications
  "password": "..." // From email_notifications
}
```

### **Test Scenario 2: Security - Brute Force Protection**

```bash
# 1. Attempt login with wrong password 5 times
for i in {1..5}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrongpassword"}'
  sleep 1
done

# 2. Check failed_login_count
SELECT failed_login_count, last_failed_login 
FROM users WHERE email = 'test@example.com';
-- Should be 5

# 3. Check security_events
SELECT * FROM security_events 
WHERE event_type = 'brute_force' 
ORDER BY detected_at DESC LIMIT 1;
-- Should have new event

# 4. Try login again (should be locked)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"correctpassword"}'
-- Should return 429 Too Many Requests

# 5. Wait 30 minutes (or manually reset)
UPDATE users SET failed_login_count = 0 
WHERE email = 'test@example.com';

# 6. Try again (should work)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"correctpassword"}'
-- Should return token
```

### **Test Scenario 3: SuperAdmin CRUD Operations**

```bash
# 1. Login as SuperAdmin
POST /api/auth/login
{ 
  "email": "superadmin@smartlearning.id", 
  "password": "SuperAdmin@2025!" 
}
# Get token from response

# 2. Get all users
GET /api/superadmin/users?page=1&limit=20
Headers: Authorization: Bearer {token}

# 3. Edit user
PUT /api/superadmin/edit-user
Headers: Authorization: Bearer {token}
{
  "user_id": 3,
  "full_name": "Updated Name",
  "status": "suspended"
}

# 4. Check audit_data_changes
SELECT * FROM audit_data_changes 
WHERE table_name = 'users' AND record_id = '3'
ORDER BY changed_at DESC LIMIT 1;
-- Should show old_data and new_data

# 5. Delete user
DELETE /api/superadmin/delete-user?user_id=3
Headers: Authorization: Bearer {token}

# 6. Verify soft delete
SELECT status, metadata FROM users WHERE id = 3;
-- status should be 'deleted'
-- metadata should contain deleted_info

# 7. Check security_events
SELECT * FROM security_events 
WHERE event_type = 'user_deletion'
ORDER BY detected_at DESC LIMIT 1;
-- Should have severity='high'
```

---

## 🔧 Troubleshooting

### **Issue 1: Database Connection Error**

**Error:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql
# or
pg_ctl status

# Start PostgreSQL
sudo systemctl start postgresql
# or
pg_ctl start

# Check DATABASE_URL in .env.local
echo $DATABASE_URL
```

---

### **Issue 2: NIK Already Exists**

**Error:**
```
{ "error": "NIK already registered" }
```

**Solution:**
```sql
-- Check who owns the NIK
SELECT id, full_name, email, status 
FROM users WHERE nik = '3201234567890001';

-- Also check pending registrations
SELECT id, full_name, email, status 
FROM pending_registrations WHERE nik = '3201234567890001';

-- If duplicate in pending: Delete or approve/reject first
-- If in users: Use different NIK
```

---

### **Issue 3: JWT Token Invalid**

**Error:**
```
{ "error": "Invalid token" }
```

**Solutions:**

1. **Check JWT_SECRET matches:**
   ```bash
   # In .env.local
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   
   # Must be same secret used when creating token
   ```

2. **Token expired (24h):**
   ```javascript
   // Login again to get new token
   POST /api/auth/login
   ```

3. **Token format wrong:**
   ```javascript
   // Correct format in header:
   Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
   
   // NOT:
   Authorization: eyJhbGciOiJIUzI1NiIs... // Missing "Bearer "
   ```

---

### **Issue 4: Account Locked**

**Error:**
```
{ 
  "error": "Account locked due to multiple failed login attempts",
  "retry_after": "2025-12-07T12:30:00Z"
}
```

**Solution:**

**Option 1: Wait 30 minutes**

**Option 2: Manual unlock (SuperAdmin only):**
```sql
UPDATE users 
SET failed_login_count = 0,
    last_failed_login = NULL
WHERE email = 'user@example.com';
```

---

### **Issue 5: Email Not Sent**

**Current Status:**
- Emails are **logged** but not actually sent
- Needs SMTP integration (SendGrid/AWS SES)

**Temporary Solution:**
```sql
-- Check email log
SELECT * FROM email_notifications 
WHERE recipient_email = 'parent@example.com'
ORDER BY created_at DESC LIMIT 1;

-- Get children credentials from email body
SELECT children_credentials 
FROM email_notifications 
WHERE email_type = 'approval_granted'
AND recipient_email = 'parent@example.com';
-- Copy credentials manually to parent
```

**Future Integration:**
```javascript
// Will use SendGrid or AWS SES
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: email,
  from: 'noreply@smartlearning.id',
  subject: subject,
  html: body
});
```

---

### **Issue 6: Charts Not Showing in Parent Dashboard**

**Possible Causes:**

1. **No data in database:**
   ```sql
   -- Check if child has learning sessions
   SELECT COUNT(*) FROM learning_sessions WHERE user_id = {child_id};
   
   -- Check daily_activities
   SELECT COUNT(*) FROM daily_activities WHERE user_id = {child_id};
   
   -- Check weekly_summaries
   SELECT COUNT(*) FROM weekly_summaries WHERE user_id = {child_id};
   ```

2. **Insert test data:**
   ```sql
   -- Insert sample learning session
   INSERT INTO learning_sessions (
     user_id, subject, level, 
     total_questions, correct_answers, 
     accuracy, started_at, ended_at
   ) VALUES (
     {child_id}, 'math', 'beginner',
     10, 8,
     80.0, NOW() - INTERVAL '1 hour', NOW()
   );
   
   -- Triggers should auto-update:
   -- - subject_performance
   -- - daily_activities
   ```

3. **Check browser console:**
   ```javascript
   // Open DevTools (F12) → Console
   // Look for errors like:
   // "Cannot read property 'slice' of undefined"
   
   // This means data array is null/undefined
   // Solution: Add safety checks in component
   {(data || []).slice(0, 7).map(...)}
   ```

---

## 📞 Support & Contact

### **Developer:**
- **Name:** Haritz
- **Production:** CreativeJawiProduction.prod
- **Year:** 2025

### **Repository:**
```
https://github.com/yourusername/smart-learning
```

### **License:**
```
© 2025 CreativeJawiProduction.prod - All Rights Reserved
Made with ❤️ for Indonesian Children Education
```

---

## 🎯 Future Enhancements

### **Phase 2 Features:**

1. **Email Service Integration**
   - SendGrid or AWS SES
   - Real email delivery
   - Email templates

2. **IP Geolocation Service**
   - ipapi.co or ipstack.com
   - Real country/city detection
   - Security threat detection

3. **Export Features**
   - PDF reports
   - Excel exports
   - Audit trail downloads

4. **Advanced Analytics**
   - Learning trends prediction
   - Performance forecasting
   - Comparative analysis

5. **Gamification**
   - Badges & achievements
   - Leaderboards
   - Rewards system

6. **Mobile Application**
   - React Native app
   - Push notifications
   - Offline mode

7. **Teacher Portal**
   - Class management
   - Assignment creation
   - Grading system

8. **Parent Community**
   - Forums
   - Chat groups
   - Parenting tips

---

**END OF DOCUMENTATION**

*Last Updated: December 7, 2025*