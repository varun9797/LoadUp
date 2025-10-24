import { Config } from '../types/config.type'

export const config: Config = {
    SERVICE_NAME: require('../../package.json').name,
    PORT: Number(process.env.PORT) || 3000,
    DATABASE_URL: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/',
    LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};