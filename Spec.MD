# Frontend Design and UI Specifications

## Brand Colors Palette

| Color Name       | Hex Code | Purpose                                    |
| ---------------- | -------- | ------------------------------------------ |
| Primary Blue     | #6BA6F7  | Primary actions, buttons, highlights       |
| Secondary Green  | #57D8A5  | Success messages, approvals, notifications |
| Accent Purple    | #A78BFA  | Highlights, links, subtle emphasis         |
| Background Light | #F7FAFC  | Main background (light and clean)          |
| Text Dark Gray   | #374151  | Primary text color                         |
| Text Light Gray  | #718096  | Secondary text, placeholders               |
| Warning Yellow   | #FFD966  | Warnings and attention highlights          |
| Error Soft Red   | #FC8181  | Error messages, warnings                   |

## Frontend Screens and Sections

### 1. Dashboard (Home Screen)

**Purpose**: Provide a quick overview of the user's content and activity.

#### Sections:

- **Welcome Header**
  - Displays the user's name and a quick action button (e.g., "Create Content")
- **Content Summary**
  - Number of drafts, approved, and scheduled content
  - Visual bar chart of post categories (e.g., Blogs, Ads, SEO)
- **Upcoming Schedule**
  - Calendar view of scheduled content
  - Highlighted slots for evergreen content
- **Quick Links**
  - Buttons for "New Content", "View Library", and "Analytics"
- **Organization Selector**
  - Dropdown or sidebar navigation to switch between organizations
  - Displays current organization name and logo
  - Option to "Create New Organization" (Admins only)

### 2. Content Library

**Purpose**: Manage all content in one place.

#### Sections:

- **Content Filters**
  - Dropdowns to filter by category (e.g., Blogs, Ads) or status (e.g., Draft, Approved)
  - Search bar for keywords
- **Content Cards**
  - Each card displays the title, category, status, and options (edit, delete)
  - Tags for evergreen or multi-platform status
- **Bulk Actions**
  - Options to delete, approve, or schedule multiple items at once

### 3. Content Creation Screen

**Purpose**: Enable users to generate or upload content.

#### Sections:

- **Category Selection**
  - Dropdown to choose a content category (e.g., Blogs, Ads, SEO)
  - Preview of category-specific templates
- **Custom Form**
  - Dynamically updates based on category selection
  - Fields: Tone, demographic, keywords, purpose, and platform focus
- **AI Suggestions**
  - Displays AI-generated content drafts with options to refine or accept
- **Editor**
  - Rich text editor for manual modifications
  - Buttons for adding media, hashtags, and links
- **Save/Submit Options**
  - Buttons to save as draft, submit for approval, or schedule directly

### 4. Scheduling Screen

**Purpose**: Manage and automate content publishing.

#### Sections:

- **Platform Selection**
  - Toggle buttons for platforms (e.g., Facebook, Twitter)
  - Integration checklists to ensure accounts are linked
- **Calendar View**
  - Drag-and-drop interface for scheduling
  - Visual markers for evergreen content
- **Recurring Schedule Setup**
  - Interface to set recurring schedules (e.g., "Post Ads every Monday at 9 AM")

### 5. Approval Workflow Screen (Admin/Reviewer Only)

**Purpose**: Allow admins and reviewers to approve or reject content.

#### Sections:

- **Pending Approvals**
  - List of content awaiting approval
  - Cards showing title, category, status, and submission date
- **Content Review Panel**
  - Inline content preview with commenting options
  - Approve/Reject buttons with optional feedback form
- **Audit Logs**
  - Action history for transparency (e.g., who edited what and when)

### 6. Analytics Dashboard

**Purpose**: Display performance metrics for content.

#### Sections:

- **Key Metrics Overview**
  - Total posts, average engagement rate, and category breakdown
- **Engagement Trends**
  - Line chart for engagement over time (likes, shares, comments)
- **Category Insights**
  - Pie chart of category performance (e.g., Blogs performing better than Ads)
- **Platform-Specific Data**
  - Metrics for each platform (e.g., Twitter, LinkedIn)
- **Export Reports**
  - Button to download PDF or CSV reports

### 7. Profile and Settings

**Purpose**: Manage user preferences and integrations.

#### Sections:

- **User Profile**
  - Name, email, and role
- **Integrations**
  - Link/unlink social accounts (e.g., Facebook, Canva)
  - Configure email notifications
- **Team Management (Admin Only)**
  - Add/remove team members
  - Assign roles (e.g., Reviewer, Editor)
- **API Keys**
  - Generate and manage API keys for external integrations

### 8. Organization Overview Screen

**Purpose**: Display organization information and settings.

#### Sections:

- **Organization Info**
  - Organization logo, name, and description
  - Total teams and users
- **Teams Section**
  - List of all teams in the organization
  - Add/remove teams (Admin only)
  - Quick links to team dashboards
- **Users Section**
  - List of all users across teams
  - Role management (Admin only)
- **Organization Settings**
  - Billing and subscription information (Organization Owner only)
  - Analytics for organization-wide content performance

### 9. Team Dashboard

**Purpose**: Display team-specific information and settings.

#### Sections:

- **Team Overview**
  - Team details
  - Member management
- **Content Summary**
  - Team-specific content status
- **Activity Feed**
  - Member activities
- **Team Member Management**
  - Role assignment
  - Member addition/removal

## Multi-Organization and Team Management

### Purpose

Allow users to manage or switch between multiple organizations and teams effortlessly.

### Target Roles

- Admins
- Organization Owners
- Team Managers
- Members

### Sections and Features

#### Organization Selector

- Dropdown or sidebar navigation to switch between organizations
- Displays current organization name and logo
- Option to "Create New Organization" (Admins only)
- Permissions:
  - Only users with access to multiple organizations see this feature
  - Restricted to Admins or Organization Owners for creating new organizations

#### Team Selector

- Available within an organization
- Dropdown or tabs to switch between teams
- Displays:
  - Team name
  - Member count
  - Assigned roles (e.g., Admin, Member)

#### User Roles and Permissions

| Role               | Scope             | Capabilities                                                        |
| ------------------ | ----------------- | ------------------------------------------------------------------- |
| Organization Owner | Organization-wide | Manage billing, create teams, manage users, oversee analytics       |
| Team Admin         | Team-specific     | Add/remove members, assign roles, manage team content and schedules |
| Team Member        | Team-specific     | Create and edit content, participate in workflows                   |
| Viewer             | Team-specific     | View content and analytics; no editing capabilities                 |

## UI/UX Design Features

- **Consistency**: Use brand colors for buttons, text, and backgrounds to maintain uniformity
- **Responsiveness**: Fully responsive design for both web and mobile interfaces
- **Accessibility**: Ensure high contrast for text and use ARIA roles for screen readers
- **Interactivity**:
  - Hover effects for buttons and content cards
  - Drag-and-drop for scheduling and team management
- **Visual Cues**:
  - Organization/team differentiation
  - Current context highlighting
- **User-Friendly Switching**:
  - Minimal clicks for context switching
  - Clear navigation breadcrumbs
- **Role-Based Views**:
  - Dynamic UI elements based on permissions

## Implementation Plan

### 1. Data Model & Types

- Create new TypeScript interfaces:

  ```typescript
  interface Organization {
    id: string;
    name: string;
    logo?: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
  }

  interface Team {
    id: string;
    organizationId: string;
    name: string;
    description?: string;
    memberCount: number;
  }

  interface UserRole {
    organizationId: string;
    teamId?: string; // Optional for org-wide roles
    role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
  }
  ```

### 2. State Management

- Implement global state management:
  - Current organization context
  - Current team context
  - User roles and permissions
- Create context providers:
  - OrganizationProvider
  - TeamProvider
- Develop custom hooks:
  - useOrganization
  - useTeam
  - usePermissions

### 3. Component Updates

#### New Components

- OrganizationSelector
  - Organization dropdown
  - Create organization modal
  - Organization switcher
- TeamSelector
  - Team dropdown/tabs
  - Team creation interface
  - Quick team switcher
- OrganizationOverview
  - Organization details
  - Team management
  - User management
- TeamDashboard
  - Team metrics
  - Activity feed
  - Member management
- PermissionsManager
  - Role assignment
  - Permission matrix
  - Access control UI

#### Existing Component Updates

- Layout.tsx
  - Add organization selector to header
  - Add team selector to sidebar
  - Update navigation based on context
- Dashboard.tsx
  - Add organization/team context
  - Update metrics for team scope
- Settings.tsx
  - Add organization settings
  - Add team settings
  - Update permission checks

### 4. Routing Structure

```typescript
// New Routes
/org/:orgId/dashboard
/org/:orgId/team/:teamId/dashboard
/org/:orgId/settings
/org/:orgId/team/:teamId/settings
/org/:orgId/teams
/org/:orgId/members
```

### 5. Authorization System

- Implement RBAC (Role-Based Access Control)
  - Define permission matrix
  - Create permission checking utilities
  - Add route protection
- Create authorization hooks:
  - useAuthorization
  - usePermissionCheck
- Add permission checks to components

### 6. API Integration

- Organization endpoints:
  - CRUD operations
  - Member management
  - Settings management
- Team endpoints:
  - CRUD operations
  - Member management
  - Activity tracking

### 7. Migration Strategy

1. Implement data models and types
2. Add state management system
3. Create new components
4. Update existing components
5. Implement routing changes
6. Add authorization system
7. Integrate with API
8. Test and validate

### 8. Testing Requirements

- Unit tests for:
  - State management
  - Authorization logic
  - Component rendering
- Integration tests for:
  - Organization switching
  - Team management
  - Permission checks
- E2E tests for:
  - User flows
  - Role-based access
  - Data persistence

### 9. Documentation Needs

- API documentation
- Component documentation
- State management guide
- Authorization guide
- Migration guide for existing users

<!-- Firebase Cleanup/Seed -->

node dist/scripts/cleanup.js
node dist/scripts/seed.js

=== Seeded Account Credentials ===
Organization Accounts:
Email: admin@mitheia.com
Password: password123

---

Email: owner@test.com
Password: password123

---

Email: manager@test.com
Password: password123

---

Email: user@test.com
Password: password123

---

Email: owner@small.com
Password: password123

---

Individual Accounts:
Email: john.doe@example.com
Password: password123

---

Email: jane.smith@example.com
Password: password123

---
