/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as SettingsImport } from './routes/settings'
import { Route as QueueImport } from './routes/queue'
import { Route as IndexImport } from './routes/index'
import { Route as VideoIdImport } from './routes/video.$id'
import { Route as VideoQueryIdImport } from './routes/video-query.$id'

// Create/Update Routes

const SettingsRoute = SettingsImport.update({
  path: '/settings',
  getParentRoute: () => rootRoute,
} as any)

const QueueRoute = QueueImport.update({
  path: '/queue',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const VideoIdRoute = VideoIdImport.update({
  path: '/video/$id',
  getParentRoute: () => rootRoute,
} as any)

const VideoQueryIdRoute = VideoQueryIdImport.update({
  path: '/video-query/$id',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/queue': {
      id: '/queue'
      path: '/queue'
      fullPath: '/queue'
      preLoaderRoute: typeof QueueImport
      parentRoute: typeof rootRoute
    }
    '/settings': {
      id: '/settings'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof SettingsImport
      parentRoute: typeof rootRoute
    }
    '/video-query/$id': {
      id: '/video-query/$id'
      path: '/video-query/$id'
      fullPath: '/video-query/$id'
      preLoaderRoute: typeof VideoQueryIdImport
      parentRoute: typeof rootRoute
    }
    '/video/$id': {
      id: '/video/$id'
      path: '/video/$id'
      fullPath: '/video/$id'
      preLoaderRoute: typeof VideoIdImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  IndexRoute,
  QueueRoute,
  SettingsRoute,
  VideoQueryIdRoute,
  VideoIdRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/queue",
        "/settings",
        "/video-query/$id",
        "/video/$id"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/queue": {
      "filePath": "queue.tsx"
    },
    "/settings": {
      "filePath": "settings.tsx"
    },
    "/video-query/$id": {
      "filePath": "video-query.$id.tsx"
    },
    "/video/$id": {
      "filePath": "video.$id.tsx"
    }
  }
}
ROUTE_MANIFEST_END */