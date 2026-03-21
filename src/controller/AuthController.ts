import { Controller, RequestMapping, RequestMethod } from "barmoury/api";
import User, { UserRequest, UserSignInRequest } from "../model/User";
import { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from 'bcryptjs';
import { randomUUID } from "crypto";
import { Validated } from "barmoury/validation";
import { UserService } from "../services/UserService";
import { UnauthorisedError } from "../exceptions/UnauthorisedError";

@RequestMapping({ value: "/auth", model: User })
export default class AuthController extends Controller<User, UserRequest> {
    userService = new UserService();

    @Validated({ model: UserRequest })
    @RequestMapping({ value: "/register", method: RequestMethod.POST })
    async registerUser(request: FastifyRequest, reply: FastifyReply) {
        const requestPayload = request.body as any;
        requestPayload.password = await bcrypt.hash(requestPayload.password, 10);
        requestPayload.externalId = randomUUID();
        const user = await User.create(requestPayload);
        return await this.processResponse(reply, 200, user, ` You have successfully registered`);
    };

    @Validated({ model: UserSignInRequest })
    @RequestMapping({ value: "/login", method: RequestMethod.POST })
    async loginUser(request: FastifyRequest, reply: FastifyReply) {
        return await this.processResponse(reply, 200, await this.userService.authenticate(request.body as UserSignInRequest), `Login successfully`);
    };

    @RequestMapping({ value: "/profile", method: RequestMethod.GET })
    async getUser(request: FastifyRequest, reply: FastifyReply) {
        const { id: userId } = (request as any).user;
        const user = await User.findOne({
            where: { externalId: userId },
            attributes: { exclude: ['password'] },
        });

        return await this.processResponse(reply, 200, user, `Profile fetched successfully`);
    };

    async getResourceById(id: any, authentication?: any): Promise<User> {
        return this.queryArmoury.getResourceByColumn(this.t1Constructor, "externalId", id,
            Controller.NO_RESOURCE_FORMAT_STRING.replace("${name}", this.fineName));

    }


}