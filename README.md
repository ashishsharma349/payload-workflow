# Dynamic Workflow Management System

Built with Payload CMS v3, Node.js, TypeScript, and MongoDB

## What is this?

A dynamic workflow management system where admins can create multi-stage approval workflows and attach them to any collection (Blogs, Contracts, etc.) directly from the Admin UI.

## Features Implemented

- ✅ Dynamic workflow creation from Admin UI
- ✅ Multi-stage approval system with stage tracking
- ✅ Works for multiple collections (Blogs, Contracts)
- ✅ Immutable audit trail via WorkflowLogs
- ✅ Role-based access control (only assigned user can approve their stage)
- ✅ Email notifications (simulated via console logs)
- ✅ Custom REST APIs for workflow status and manual triggering
- ✅ Reusable shared hook utility (DRY principle)

## Not Implemented

- ❌ Unlimited nested/conditional workflow branching
- ❌ Custom Admin UI tab for inline workflow progress
- ❌ SLA per step with auto-escalation
- ❌ Field-level conditions per step
- ❌ Vercel deployment

> Due to time constraints, the above features could not be implemented.

## Project Structure

```
src/
├── collections/
│   ├── Blogs.ts          
│   ├── Contracts.ts      
│   ├── Workflows.ts      
│   ├── WorkflowLogs.ts   
│   └── Users.ts          
├── utils/
│   └── workflowHook.ts   
├── endpoints/
│   └── workflows.ts      
└── payload.config.ts     
```

## Setup Instructions

### Requirements

- Node.js v22+
- MongoDB (local or Atlas)

### Installation

```bash
git clone https://github.com/ashishsharma349/payload-workflow.git
cd payload-workflow
npm install
```

### Environment Variables

Create `.env` file:

```
DATABASE_URL=mongodb://127.0.0.1/payload-workflow
PAYLOAD_SECRET=your-secret-key-here
```

### Run

```bash
npm run dev
```

Open: `http://localhost:3000/admin`

## Demo Credentials

```
Email:    admin@gmail.com
Password: admin@123
```

## Sample Workflow

1. Workflows → Create New → Add stages
2. Blogs → Create New → Select workflow
3. Edit blog → Action = "Approve" → Save
4. Watch stage increment and WorkflowLogs update!

## Custom APIs

### Get Workflow Status
```
GET /api/blogs/:docId/status
```

### Trigger Workflow Manually
```
POST /api/blogs/trigger
Body: { "docId": "...", "workflowId": "..." }
```

## What I Learned

- Payload CMS v3 collections, hooks, and endpoints
- Dynamic data modeling for reusable workflow systems
- Role-based access control implementation
- Debugging and problem-solving with unfamiliar technology