// Original file: proto/daemon.proto

export const RequestType = {
  REQUEST_TYPE_UNSPECIFIED: 'REQUEST_TYPE_UNSPECIFIED',
  REQUEST_TYPE_COMMUNITY: 'REQUEST_TYPE_COMMUNITY',
  REQUEST_TYPE_UNIFIED: 'REQUEST_TYPE_UNIFIED',
  REQUEST_TYPE_WEBAPI: 'REQUEST_TYPE_WEBAPI',
} as const;

export type RequestType =
  | 'REQUEST_TYPE_UNSPECIFIED'
  | 0
  | 'REQUEST_TYPE_COMMUNITY'
  | 1
  | 'REQUEST_TYPE_UNIFIED'
  | 2
  | 'REQUEST_TYPE_WEBAPI'
  | 3

export type RequestType__Output = typeof RequestType[keyof typeof RequestType]
