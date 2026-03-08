import type { CollectionConfig } from 'payload'
import { createWorkflowHook } from '../utils/workflowHook'

export const Blogs: CollectionConfig = {
  slug: 'blogs',
  admin: {
    useAsTitle: 'title',
  },
  endpoints: [
    {
      path: '/:docId/status',
      method: 'get',
      handler: async (req) => {
        const docId = req.routeParams?.docId as string
        const doc = await req.payload.findByID({
          collection: 'blogs',
          id: docId,
          depth: 2,
        }) as any

        if (!doc) {
          return Response.json({ error: 'Document not found' }, { status: 404 })
        }

        const workflow = doc.workflow
        const currentStage = doc.currentStage ?? 0
        const stages = workflow?.stages || []
        const currentStageInfo = stages[currentStage]

        return Response.json({
          docId,
          status: doc.status,
          currentStage,
          totalStages: stages.length,
          currentStageName: currentStageInfo?.stageName || 'N/A',
          assignedTo: currentStageInfo?.assignedTo || 'N/A',
          workflowName: workflow?.name || 'N/A',
        })
      },
    },
    {
      path: '/trigger',
      method: 'post',
      handler: async (req) => {
        // const body = await req.json()
        const body = await req.json?.() ?? {}
        const { docId, workflowId } = body

        if (!docId || !workflowId) {
          return Response.json({ error: 'docId and workflowId required' }, { status: 400 })
        }

        const doc = await req.payload.findByID({
          collection: 'blogs',
          id: docId,
        }) as any

        if (!doc) {
          return Response.json({ error: 'Document not found' }, { status: 404 })
        }

        await req.payload.update({
          collection: 'blogs',
          id: docId,
          data: {
            workflow: workflowId,
            currentStage: 0,
            status: 'pending',
          },
        })

        return Response.json({ message: 'Workflow triggered successfully', docId, workflowId })
      },
    },
  ],
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'content', type: 'richText', required: true },
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
    beforeChange: [createWorkflowHook('blogs')],
  },
}