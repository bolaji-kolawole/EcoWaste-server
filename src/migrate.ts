import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";
dotenv.config();

import database from "./config/DatabaseConfig";
import registerAssociations from "./model/Association";

(async () => {

    const connected = await database.connected();

    if (!connected) {
        console.error(`[ecowaste.migrate] unable to connect to the database`);
        process.exit(1);
    }

    console.log(`[ecowaste.migrate] preparing for the database migration`);

    const modelsPath = path.join(__dirname, "model");

    fs.readdirSync(modelsPath)
        .filter((file) => {
            return (
                file.indexOf(".") !== 0 &&
                (file.endsWith(".ts") || file.endsWith(".js")) &&
                !file.includes("Association")
            );
        })
        .forEach((file) => {

            const filePath = path.join(modelsPath, file);

            console.log(
                `[ecowaste.migrate] preparing to migrate the table ${file}`
            );

        });

    // Register relationships
    registerAssociations();

    console.log(`[ecowaste.migrate] running sequelize sync`);

    await database.migrate({ alter: true });

    console.log(`[ecowaste.migrate] database migration completed successfully`);

})();