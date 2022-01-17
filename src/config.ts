import dotenv from 'dotenv'

interface IConfig {
  token: string
  owner: string
  repo: string
  environmentPrefix: string
}

export class Config implements IConfig {
  token: string
  owner: string
  repo: string
  environmentPrefix: string

  constructor() {
    dotenv.config()
    this.token = process.env.GITHUB_TOKEN || ''
    this.owner = process.env.OWNER || ''
    this.repo = process.env.REPO || ''
    this.environmentPrefix = process.env.ENVIRONMENT_PREFIX || ''
  }
}
