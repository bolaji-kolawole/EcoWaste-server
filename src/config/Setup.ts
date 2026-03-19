
import logger from "./LoggerImpl";
import database from './DatabaseConfig';
import { FieldUtil } from "barmoury/util";
import fastJson from "fast-json-stringify";
import * as BarmouryApi from 'barmoury/api';
import { ZlibCompressor } from "barmoury/crypto";
import { ErrorAdvise, ApiResponse } from "barmoury/api";
import { FastifyInstance, FastifyRequest } from "fastify";
import AuthController from "../controller/AuthController";
import BactuatorControllerImpl from "../controller/BactuatorControllerImpl";
import AddressController from "../controller/AddressController";
import RoleController from "../controller/RoleController";
import UserRoleController from "../controller/UserRoleController";
import WasteRequestController from "../controller/WasteRequestController";
import WasteTypeController from "../controller/WasteTypeController";
import SubscriptionPlanController from "../controller/SubscriptionPlanController";
import UserSubscriptionController from "../controller/UserSubscriptionController";
import PaymentController from "../controller/PaymentController";
import RecyclingCompanyController from "../controller/RecyclingCompanyController";
import CompanyUserController from "../controller/CompanyUserController";
import NotificationController from "../controller/NotificationController";
import RequestImageController from "../controller/RequestImageController";
import ClusterRequestController from "../controller/ClusterRequestController";
import StreetClusterController from "../controller/StreetClusterController";
import SuperAdminController from "../controller/SuperAdminController";
import RequestStatusController from "../controller/RequestStatusController";
import RewardTransactionController from "../controller/RewardTransactionController";


export const Setup = {

    stringify: fastJson({}),
    prefix: process.env.CONTEXT_PATH,
    serviceName: process.env.SERVICE_NAME,
    userSecret: process.env.NEST_JWT_TOKEN,

    configure(fastify: FastifyInstance) {
        Setup.registerErrorAdviser(fastify);
        Setup.registerRoutes(fastify);
        Setup.registerJwt(fastify);
        fastify.addHook('preValidation', async (request, _) => {
            if (!request.body) return request.body;
            request.body = FieldUtil.keysToCamelCase(request.body as any, ["parameters"]);
        });
        fastify.addHook('onSend', async (request, reply, payload: any) => {
            if (!payload || !(reply.getHeader("Content-Type") as string).includes("json")
                || request.routeOptions.url?.endsWith("/stat")
                || request.routeOptions.url?.endsWith("/introspect")
                || request.routeOptions.url?.includes("database/query")) return payload;
            return Setup.stringify(FieldUtil.keysToSnakeCase(JSON.parse(payload), ["parameters", "headers"]));
        });
    },

    registerRoutes(fastify: FastifyInstance) {
        BarmouryApi.registerControllers(fastify, {
            prefix: Setup.prefix,
            sequelize: database.sequelizeConnection,
            bacuator: new BactuatorControllerImpl()
        }, [

            new RoleController(),
            new AuthController(),
            new PaymentController(),
            new AddressController(),
            new UserRoleController(),
            new WasteTypeController(),
            new SuperAdminController(),
            new CompanyUserController(),
            new NotificationController(),
            new RequestImageController(),
            new WasteRequestController(),
            new StreetClusterController(),
            new RequestStatusController(),
            new ClusterRequestController(),
            new UserSubscriptionController(),
            new SubscriptionPlanController(),
            new RecyclingCompanyController(),
            new RewardTransactionController(),
        ]);
    },

    registerErrorAdviser(fastify: FastifyInstance) {
        BarmouryApi.registerErrorAdvisers(fastify, { logger }, [
            ErrorAdviser,
            BarmouryApi.ErrorAdviser
        ]);
    },

    registerJwt(fastify: FastifyInstance) {
        BarmouryApi.registerJwt(fastify, {
            authorityPrefix: "",
            prefix: Setup.prefix,
            secrets: {
                "user": Setup.userSecret!,
            },
            encryptor: new ZlibCompressor(),
            openUrlPatterns: [
                { method: "OPTIONS", route: "/**" }, // TODO move to barmoury in cors
                { method: "GET", route: "/bactuator/health" },
                { method: "POST", route: "/auth/login" },
                { method: "POST", route: "/auth/register" },
                { method: "POST", route: "/user-role" },
                { method: "GET", route: "/role" },
            ],
            validate: (_, __: string, userDetails: BarmouryApi.UserDetails<any>) => {
                return userDetails.getData()?.user_type === "USER" || userDetails.getData()?.projects?.includes(Setup.serviceName);
            },
        });
    },

}

class ErrorAdviser {

    @ErrorAdvise({ errorNames: ["___UnknownError___"] })
    default(error: Error, options?: any) {
        options.logger?.error(`[chat_server.ErrorAdviser] ${error.message}`, error);
        return new ApiResponse([options.msg || error.message]);
    }

    async auditAndReportAuthError(error: Error, msg: string, options?: any) {
        return this.default(error, { ...options, msg });
    }

    @ErrorAdvise({ errorNames: ["UnauthorisedError"], statusCode: 401 })
    unauthoriseError(error: Error, options?: any) {
        return this.auditAndReportAuthError(error, error.message, options);
    }
    @ErrorAdvise({ errorNames: ["MalformedTokenError"], statusCode: 401 })
    malformedAuthToken(error: Error, options?: any) {
        return this.auditAndReportAuthError(error, "The authorization token is malformed", options);
    }

    @ErrorAdvise({ errorNames: ["FST_JWT_NO_AUTHORIZATION_IN_HEADER", "MissingTokenError"], statusCode: 401 })
    missingAuthToken(error: Error, options?: any) {
        return this.auditAndReportAuthError(error, "Authorization token is missing", options);
    }

    @ErrorAdvise({ errorNames: ["FST_JWT_AUTHORIZATION_TOKEN_INVALID"], statusCode: 401 })
    unauthorizedErrors(error: Error, options?: any) {
        return this.auditAndReportAuthError(error, "Invalid Authorization token", options);
    }

    @ErrorAdvise({ errorNames: ["FST_JWT_AUTHORIZATION_TOKEN_EXPIRED", "ExpiredTokenError"], statusCode: 401 })
    expiredTokenErrors(error: Error, options?: any) {
        return this.auditAndReportAuthError(error, "The authorization token has expired", options);
    }

}

