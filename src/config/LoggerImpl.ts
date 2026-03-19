
import { Log, Logger } from "barmoury/log";
import { Cache, ListCacheImpl } from "barmoury/cache";

export class LoggerImpl extends Logger {

    serviceName!: string;
    cache: ListCacheImpl<Log> = new ListCacheImpl();

    getCache(): Cache<Log> {
        return this.cache;
    }

    getLogDate() {
        const date = new Date();
        return date.toLocaleString('default', { hour12: false });
    }

    preLog(log: Log): void {
        if (!this.serviceName) this.serviceName = process.env.SERVICE_NAME;
        log.group = this.serviceName;
        if (log.level == Log.Level.ERROR || log.level == Log.Level.FATAL) {
            console.error(`[${this.getLogDate()}] ${log.level.padEnd(7)} ${log.content}`);
        } else {
            console.log(`[${this.getLogDate()}] ${log.level.padEnd(7)} ${log.content}`);
        }
    }

    async flush(): Promise<void> {
        const logs = this.getCache().getCached();
        /*ffs.post(mnemosynePostUrl, logs, { headers: { "Authorization": `Bearer ${transiflowPlatformAccessToken}` } }).then((response: any) => {
            console.log(`[${this.getLogDate()}] ${"INFO".padEnd(7)} Response and status from log record flush to mnemosyne %s %s`,
                response.status, response.body);
        }).catch((err: any) => {
            console.error(`[${this.getLogDate()}] ${"ERROR".padEnd(7)} Failed to send to mnemosyne the logs ${JSON.stringify(logs)}`);
            console.error(`[${this.getLogDate()}] ${"ERROR".padEnd(7)} Log record flush to mnemosyne from cache failed. Reason: `, err.message, err.response);
        });*/
    }

};

const logger = new LoggerImpl();

export default logger;

