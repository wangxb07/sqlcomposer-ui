export interface Doc {
  uuid: string
  name: string
  content: string
  path: string
  created_at: string
  updated_at: string
}

export interface DocumentList {
  data: Doc[]
  total: number
}

export interface DbConfig {
  uuid: string
  name: string
  dsn: string
}

export interface FilterParam {
  attr: string
  op: string
  val: string
}
