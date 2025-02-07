import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { PayloadType } from "./types";
import { authConstants } from "./constants";

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
    constructor() {
    super({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
    ignoreExpiration: false, 
    secretOrKey: authConstants.secret, 
    });
    }
    async validate(payload: PayloadType) {
    
        return { userId: payload.userId, email: payload.email, artistId: payload.artistId, }; 
}
}