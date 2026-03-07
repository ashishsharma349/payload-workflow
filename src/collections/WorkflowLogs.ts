// import type { CollectionConfig } from 'payload'

// export const WorkflowLogs: CollectionConfig = {
//   slug: 'workflow-logs',
//   admin: {
//     useAsTitle: 'action',
//   },
//   // Nobody can edit or delete logs - immutable!
//   access: {
//     update: () => false,
//     delete: () => false,
//   },
//   fields: [
//     { name: 'workflowId', type: 'relationship', relationTo: 'workflows' },
//     { name: 'documentId', type: 'text' },
//     { name: 'collectionName', type: 'text' }, 
//     { name: 'stepIndex', type: 'number' },
//     { name: 'action', type: 'select', options: [
//       { label: 'Approved', value: 'approved' },
//       { label: 'Rejected', value: 'rejected' },
//     ]},
//     { name: 'comment', type: 'text' },
//     { name: 'timestamp', type: 'date' },
//   ],
// }

import type { CollectionConfig } from 'payload'

export const WorkflowLogs: CollectionConfig = {
  slug: 'workflow-logs',
  admin: {
    useAsTitle: 'action',
  },
  access: {
    update: () => false,
    delete: () => false,
  },
  fields: [
    { name: 'workflowId', type: 'relationship', relationTo: 'workflows' },
    { name: 'documentId', type: 'text' },
    { name: 'collectionName', type: 'text' },
    { name: 'stepIndex', type: 'number' },
    {
      name: 'action',
      type: 'text',
    },
    { name: 'comment', type: 'text' },
    { name: 'timestamp', type: 'date' },
  ],
}