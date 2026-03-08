import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Workflows } from './collections/Workflow'
import { Blogs } from './collections/Blogs'
import { WorkflowLogs } from './collections/WorkflowLogs'
import { Contracts } from './collections/Contracts'
import { triggerWorkflow, getWorkflowStatus } from './endpoints/workflows'


const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Workflows, Blogs, Contracts, WorkflowLogs],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  endpoints: [
    {
      path: '/workflows/trigger',
      method: 'post',
      handler: triggerWorkflow,
    },
    {
      path: '/workflows/status/:docId',
      method: 'get',
      handler: getWorkflowStatus,
    },
  ],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [],
})