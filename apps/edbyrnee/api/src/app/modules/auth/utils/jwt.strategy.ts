import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IRepositoryPort } from '../../../core/database/ports/repository-port';
import { IJwtConfig } from '../config';
import { UserProfile } from '../entities/user-profile.entity';
import { USER_REPO } from '../auth.providers';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @Inject(USER_REPO)
    private userProfileRepository: IRepositoryPort<UserProfile>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<IJwtConfig>('jwt').secret,
    });
  }

  async validate(payload): Promise<any> {
    const userUuid = payload.sub;

    const userProfile: UserProfile = await this.userProfileRepository.get(
      userUuid
    );

    // Is null or undefined
    if(userProfile == null) return null;

    const requestUser: RequestUser = {
      // Throw error if userProfile is null as this should never happen
      uuid: userProfile.uuid,
    };

    return userProfile ? requestUser : null;
  }
}
export class RequestUser {
  uuid: string;
}
