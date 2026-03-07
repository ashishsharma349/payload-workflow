import type { Endpoint } from 'payload'

export const triggerWorkflow: Endpoint['handler'] = async (req) => {
  const body = req.json ? await req.json() : {}
  const { docId, collection, workflowId } = body

  if (!docId || !collection || !workflowId) {
    return Response.json({ error: 'docId, collection, workflowId required' }, { status: 400 })
  }

  const doc = await req.payload.findByID({
    collection,
    id: docId,
  })

  if (!doc) {
    return Response.json({ error: 'Document not found' }, { status: 404 })
  }

  await req.payload.update({
    collection,
    id: docId,
    data: {
      workflow: workflowId,
      currentStage: 0,
      status: 'pending',
    },
  })

  return Response.json({ message: 'Workflow triggered successfully', docId, workflowId })
}

export const getWorkflowStatus: Endpoint['handler'] = async (req) => {
  const docId = req.routeParams?.docId as string
  const collection = (req.query?.collection as string) || 'blogs'

  const doc = await req.payload.findByID({
    collection,
    id: docId,
    depth: 2,
  })

  if (!doc) {
    return Response.json({ error: 'Document not found' }, { status: 404 })
  }

  const workflow = doc.workflow
  const currentStage = doc.currentStage ?? 0
  const stages = workflow?.stages || []
  const currentStageInfo = stages[currentStage]

  return Response.json({
    docId,
    collection,
    status: doc.status,
    currentStage,
    totalStages: stages.length,
    currentStageName: currentStageInfo?.stageName || 'N/A',
    assignedTo: currentStageInfo?.assignedTo || 'N/A',
    workflowName: workflow?.name || 'N/A',
  })
}