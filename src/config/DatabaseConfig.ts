
import logger from "./LoggerImpl";
import { CallBack } from "barmoury/util";

const { Sequelize } = require('sequelize');

export interface DatabaseCredential {
    host: string;
    schema: string;
    username: string;
    password: string;
    dialect?: string;
}

const isDev = process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'development';

export class DatabaseConfig {

    logger: any;
    sequelizeConnection: typeof Sequelize;

    constructor(logger: any, cred: DatabaseCredential) {
        this.logger = logger;
        this.sequelizeConnection = new Sequelize(cred.schema, cred.username, cred.password, {
            host: cred.host,
            dialect: cred.dialect || 'mysql',
            logging: (...msg: any[]) => process.env.LOG_LEVEL === "TRACE"
                && this.logger.trace(`[ecowaste.${DatabaseConfig.name}] ${JSON.stringify(msg, null, 4)}`)
        });
        this.logger.info(`[ecowaste.${DatabaseConfig.name}] ` +
            `Setting up database connection. ${cred.host}@${cred.username} ${cred.schema}`);
    }

    async connected(): Promise<boolean> {
        try {
            await this.sequelizeConnection.authenticate();
            this.logger.info(`[ecowaste.${DatabaseConfig.name}] Database connected`);
            return true;
        } catch (error) {
            this.logger.error(`[ecowaste.${DatabaseConfig.name}]`, error);
            return false;
        }
    }

    shutdown(cb: CallBack) {
        if (!this.sequelizeConnection) {
            cb(true);
            return;
        }
        this.sequelizeConnection.close().then(() => cb(true) || (this.sequelizeConnection = null)).catch(() => cb(false));
    }

    async migrate(options: any) {
        await this.sequelizeConnection.sync({ alter: false, ...options });
    }

}

const databaseCredential: DatabaseCredential = {
    host: process.env.DATABASE_HOST!,
    schema: process.env.DATABASE_SCHEMA!,
    username: process.env.DATABASE_USERNAME!,
    password: process.env.DATABASE_PASSWORD!,
}

const database = new DatabaseConfig(logger, databaseCredential);
export default database;
