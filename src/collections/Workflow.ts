import type { CollectionConfig } from 'payload'

export const Workflows: CollectionConfig = {
  slug: 'workflows',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'stages',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'stageName',
          type: 'text',
          required: true,
        },
        {
          name: 'assignedTo',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
      ],
    },
  ],
}