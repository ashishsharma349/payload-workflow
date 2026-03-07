import type { CollectionConfig } from 'payload'
import { createWorkflowHook } from '../utils/workflowHook'

export const Contracts: CollectionConfig = {
  slug: 'contracts',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'content', type: 'richText', required: true },
    {
      name: 'contractType',
      type: 'select',
      options: [
        { label: 'Legal', value: 'legal' },
        { label: 'HR', value: 'hr' },
        { label: 'Finance', value: 'finance' },
      ],
      required: true,
    },
    {
      name: 'workflow',
      type: 'relationship',
      relationTo: 'workflows',
      required: true,
    },
    { name: 'currentStage', type: 'number', defaultValue: 0 },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
      defaultValue: 'pending',
    },
    {
      name: 'action',
      type: 'select',
      options: [
        { label: 'No Action', value: 'none' },
        { label: 'Approve', value: 'approve' },
        { label: 'Reject', value: 'reject' },
      ],
      defaultValue: 'none',
      validate: (value: any) => true,
    },
    {
      name: 'approvalHistory',
      type: 'array',
      admin: { readOnly: true },
      fields: [
        { name: 'stage', type: 'number' },
        { name: 'action', type: 'text' },
        { name: 'at', type: 'date' },
      ],
    },
  ],
  hooks: {
    beforeChange: [createWorkflowHook('contracts')],
  },
}