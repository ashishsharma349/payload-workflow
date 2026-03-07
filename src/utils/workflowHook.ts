import type { CollectionBeforeChangeHook } from 'payload'

export const createWorkflowHook = (collectionName: string) => {
    const hook: CollectionBeforeChangeHook = async ({ data, req, originalDoc }) => {
        if (!data.action || data.action === 'none') return data

        const payload = req.payload

        const workflow = await payload.findByID({
            collection: 'workflows',
            id: data.workflow || originalDoc?.workflow,
        })

        const totalStages = workflow.stages?.length || 0
        const currentStage = originalDoc?.currentStage ?? 0
        // Role-based access check
        const assignedUser = (workflow as any).stages[currentStage]?.assignedTo
        const currentUserId = req.user?.id

        if (assignedUser && currentUserId) {
            const assignedId = typeof assignedUser === 'object' ? assignedUser.id : assignedUser
            if (String(assignedId) !== String(currentUserId)) {
                throw new Error(`Not authorized! Stage "${(workflow as any).stages[currentStage]?.stageName}" is assigned to a different user.`)
            }
        }

        await payload.create({
            collection: 'workflow-logs',
            data: {
                workflowId: data.workflow || originalDoc?.workflow,
                documentId: String(originalDoc?.id),
                collectionName: collectionName,
                stepIndex: currentStage,
                action: data.action,
                timestamp: new Date().toISOString(),
            },
        })

        if (data.action === 'reject') {
            data.status = 'rejected'
            data.action = 'none'
            console.log(`📧 EMAIL: Document REJECTED at stage ${currentStage}`)
            return data
        }

        if (data.action === 'approve') {
            const nextStage = currentStage + 1
            if (nextStage >= totalStages) {
                data.status = 'approved'
                data.currentStage = nextStage
                console.log(`📧 EMAIL: Document fully APPROVED!`)
            } else {
                data.currentStage = nextStage
                data.status = 'pending'
                const nextReviewer = (workflow as any).stages[nextStage]
                console.log(`📧 EMAIL SENT TO: ${nextReviewer?.assignedTo}`)
                console.log(`   Subject: Action Required - ${nextReviewer?.stageName}`)
            }
            data.action = 'none'
        }

        return data
    }
    return hook
}