
declare global {

    namespace NodeJS {

        interface ProcessEnv {
            LOG_LEVEL: string;
            PORT?: number | 2302;
            CONTEXT_PATH: string;
            SERVICE_NAME: string;
            DATABASE_HOST: string;
            DATABASE_PORT: number;
            SERVICE_BASE_URL: string;
            DATABASE_SCHEMA: string;
            DATABASE_USERNAME: string;
            DATABASE_PASSWORD: string;
            CHAT_SERVER_JWT_TOKEN: string;
            NODE_ENV: 'local' | 'development' | 'uat' | 'production';
        }

    }
    
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export { }
