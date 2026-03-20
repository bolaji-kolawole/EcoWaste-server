
import fs from "fs";
import path from "path";
import * as dotenv from "dotenv"; dotenv.config();
import database from './config/DatabaseConfig';

// TODO accept options for specific table migration, alter e.t.c. and use non .sync, generate migration and run
database.connected().then(async connected => {
    if (!connected) {
        console.error(`[ecowaste.migrate]`, `unable to connect to the database, shutting down!`);
        process.exit(1);
    }
    console.log(`[ecowaste.migrate]`, `preparing for the database migration`);
    const db: any = {};
    const models = path.join(__dirname, 'model');
    fs.readdirSync(models)
        .filter(function (file) {
            return (file.indexOf('.') !== 0) && (file.slice(-3) === '.ts' || file.slice(-3) === '.js');
        }).forEach(function (file) {
            const model = require(path.join(models, file));
            console.log(`[ecowaste.migrate]`, `preparing to migrate the table ${path.join(models, file)}`);
            db[model.name] = model;
        });
    await database.migrate({ alter: true });
    console.log(`[ecowaste.migrate]`, `database migration completed successfully`);
});
