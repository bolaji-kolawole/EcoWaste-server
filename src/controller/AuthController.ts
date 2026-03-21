import { Controller, RequestMapping, RequestMethod } from "barmoury/api";
import User, { UserRequest, UserSignInRequest } from "../model/User";
import { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from 'bcryptjs';
import { randomUUID } from "crypto";
import { Validated } from "barmoury/validation";
import { UserService } from "../services/UserService";
import { UnauthorisedError } from "../exceptions/UnauthorisedError";
import { createVerifier } from "fast-jwt";
import { createWelcomeLink } from "../utils/SendMail";


const verifier = createVerifier({ key: process.env.NEST_JWT_TOKEN });
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
        await createWelcomeLink(requestPayload?.email);
        return await this.processResponse(reply, 200, user, ` You have successfully registered! Please check your email to verify your account. `);
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

    @RequestMapping({ value: "/verify-email/:id", method: RequestMethod.GET })
    async verifyEmail(request: FastifyRequest, reply: FastifyReply) {
        const { id: token } = request.params as { id: string };
        const payload = verifier(token); // token from the query string
        const email = payload.email;
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            throw new UnauthorisedError('User not found');
        }
        if (user.emailVerified) {
            throw new UnauthorisedError('Email already verified');
        }
        const verified = await User.update({ emailVerified: true }, { where: { email } });
        return await this.processResponse(reply, 200, email, `Email verified successfully`);
    }

    @RequestMapping({ value: "/resend-verification", method: RequestMethod.POST })
    async resendVerification(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { email } = request.body as { email: string };

            if (!email) {
                return this.processResponse(reply, 400, null, "Email is required");
            }

            // Find the user
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return this.processResponse(reply, 404, null, "User not found");
            }

            if (user.emailVerified) {
                return this.processResponse(reply, 400, null, "Email is already verified");
            }

            await createWelcomeLink(email);

            return this.processResponse(reply, 200, { email }, "Verification email resent successfully");
        } catch (error) {
            console.error(error);
            return this.processResponse(reply, 500, null, "Server error while resending verification email");
        }
    }



}