
import bcrypt from 'bcryptjs';
import User, { AuthResponse, UserSignInRequest } from "../model/User";
import { UnauthorisedError } from '../exceptions/UnauthorisedError';
import { JwtTokenUtil, UserDetails } from 'barmoury/api';
import UserRole from '../model/UserRole';

export class UserService {

    jwtTokenUtil = new JwtTokenUtil();

    async authenticate(request: UserSignInRequest): Promise<AuthResponse> {
        const { email, password, roleId } = request;
        const user = await User.findOne({ where: { email } });
        if (!bcrypt.compareSync(password!, user!.password)) {
            throw new UnauthorisedError('Invalid login details');
        }
        // if (!user?.emailVerified) {
        //     throw new UnauthorisedError('Email not verified');
        // }
        if (user?.status === "DEACTIVATED") {
            throw new UnauthorisedError('Your account has been deactivated');
        }
        const userRole = await UserRole.findOne({ where: { userId: user?.externalId, roleId: roleId } });
        
        if (!userRole) {
            throw new UnauthorisedError('You do not have access to this');
        }
        return {
            accessToken: this.generateAuthToken(user!)
        }
    }

    private generateAuthToken(user: User) {
        const twentyFourHoursInSeconds = 60 * 60 * 24;
        const data = {
            phone: user?.phone,
            email: user?.email,
            user_type: "USER",
            profile_picture_location: user?.profilePictureLocation,
            last_name: user?.lastName,
            first_name: user?.firstName,
        }
        return this.jwtTokenUtil.generateToken("user", new UserDetails(user!.externalId, data), twentyFourHoursInSeconds); // 
    }

}
