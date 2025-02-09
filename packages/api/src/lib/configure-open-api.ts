import { apiReference } from '@scalar/hono-api-reference'

import packageJSON from '../../package.json' assert { type: 'json' }
import type { AppOpenAPI } from '~/types/app-context'

export default function configureOpenAPI(app: AppOpenAPI) {
  app.doc('/doc', {
    openapi: '3.0.0',
    info: {
      version: packageJSON.version,
      title: 'Tasks API',
    },
  })

  app.get(
    '/reference',
    apiReference({
      theme: 'kepler',
      layout: 'classic',
      defaultHttpClient: {
        targetKey: 'javascript',
        clientKey: 'fetch',
      },
      spec: {
        url: '/doc',
      },
    }),
  )
}