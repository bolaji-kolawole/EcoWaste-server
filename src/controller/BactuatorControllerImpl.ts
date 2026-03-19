
import User from "../model/User";
import { FastifyRequest } from "fastify";
import { Permission } from "../constant/Permission";
import { Controller, Model, Request, RequestMapping } from "barmoury/api";
import BactuatorController from "barmoury/api/controller/BactuatorController";
import AuthController from "./AuthController";

@RequestMapping("/bactuator")
export default class BactuatorControllerImpl extends BactuatorController {

    springLike: boolean = true;

    isSnakeCase() {
        return true;
    }

    serviceName(): string {
        return "Intrasoft Gateway User Service";
    }

    iconLocation(): string {
        return "https://avatars.githubusercontent.com/u/14879387?v=4";
    }

    serviceApiName(): string {
        return "intrasoft-gateway-user-api";
    }

    downloadsCount(): number {
        return 0;
    }

    serviceDescription(): string {
        return "The Intrasoft API service";
    }

    databaseQueryRoute(): string {
        return "/intrasoft/api/v1/bactuator/database/query/single";
    }

    databaseMultipleQueryRoute(): string {
        return "/intrasoft/api/v1/bactuator/database/query/multiple";
    }

    logUrls(): { [index: string]: string; }[] {
        return [];
    }

    userStatistics(): { [index: string]: number; } {
        return {};
    }

    earningStatistics(): { [index: string]: number; } {
        return {};
    }

    resources(): any[] {
        return [
            User,
        ];
    }

    controllers(): Controller<Model<any, any>, Request>[] {
        return [
            new AuthController(),
        ];
    }

    pageable: boolean = true;

    isServiceOk(): boolean {
        return true;
    }
    
    principalCan(request: FastifyRequest, dbMethod: string): boolean {
        const authoritiesValues = (request as any).authoritiesValues;
        return authoritiesValues.includes(Permission.SUPER_ADMIN)
                    || authoritiesValues.includes(`DATABASE_${dbMethod}`)
    }

}
