# Dynamic Workflow Management System

Built with Payload CMS v3, Node.js, and MongoDB

## What is this?

A dynamic workflow management system where admins can create multi-stage approval workflows and attach them to any collection (Blogs, Contracts, etc.) directly from the Admin UI - no code changes needed.

## Features

- Dynamic workflow creation from Admin UI
- Multi-stage approval system
- Works for any collection (Blogs, Contracts)
- Immutable audit trail (WorkflowLogs)
- Custom REST APIs for workflow status and triggering
- Email notifications (simulated via console logs)

## Project Structure

```
src/
├── collections/
│   ├── Blogs.ts          # Blog collection with approval hooks + custom endpoints
│   ├── Contracts.ts      # Contract collection with approval hooks
│   ├── Workflows.ts      # Dynamic workflow definitions
│   ├── WorkflowLogs.ts   # Immutable audit trail
│   └── Users.ts          # Authentication
├── endpoints/
│   └── workflows.ts      # Custom REST API handlers
└── payload.config.ts     # Main Payload configuration
```

## Architecture

- **Collections** - Define data structure (like MongoDB schemas)
- **Hooks** - `beforeChange` hook handles approval logic automatically
- **Relationships** - Blogs/Contracts link to Workflows dynamically
- **WorkflowLogs** - Append-only audit trail (update/delete disabled)

## How Workflows Work

```
1. Admin creates a Workflow with stages from UI
2. Writer creates a Blog/Contract and selects a Workflow
3. Reviewer opens the document, selects "Approve" and saves
4. Hook runs automatically → moves to next stage
5. After all stages approved → status becomes "Approved"
6. Every action is logged in WorkflowLogs
```

## Setup Instructions

### Requirements

- Node.js v22+
- MongoDB (local or Atlas)

### Installation

```bash
# Clone the repository
git clone YOUR_REPO_URL
cd payload-workflow

# Install dependencies
npm install
```

### Environment Variables

Create `.env` file in root:

```
DATABASE_URL=mongodb://127.0.0.1/payload-workflow
PAYLOAD_SECRET=your-secret-key-here
```

### Run the project

```bash
npm run dev
```

Open: `http://localhost:3000/admin`

## Demo Credentials

```
Email:    admin@gmail.com
Password: admin@123
```

## Sample Workflow Setup

1. Login to admin panel
2. Go to **Workflows** → Create New
3. Add name: `Blog Approval Process`
4. Add stages:
   - Stage 1: "Editor Review" → assign to admin
   - Stage 2: "Final Approval" → assign to admin
5. Save workflow
6. Go to **Blogs** → Create New Blog
7. Select the workflow you just created
8. Save the blog
9. Edit the blog → change Action to "Approve" → Save
10. Watch `currentStage` increment!

## Custom APIs

### Get Workflow Status

```
GET /api/blogs/:docId/status

Response:
{
  "docId": "...",
  "status": "pending",
  "currentStage": 1,
  "totalStages": 2,
  "currentStageName": "Final Approval",
  "workflowName": "Blog Approval Process"
}
```

### Trigger Workflow Manually

```
POST /api/blogs/trigger

Body:
{
  "docId": "document-id",
  "workflowId": "workflow-id"
}

Response:
{
  "message": "Workflow triggered successfully"
}
```

## Deployment
Deployment was planned for Vercel but not implemented 
within the given time. Local setup instructions above 
are fully functional.

## What I Learned

- Payload CMS v3 collections, fields, and hooks
- beforeChange hooks for automatic workflow logic
- Dynamic data modeling for reusable systems
- Custom endpoint registration in Payload v3
- Immutable collections using access control