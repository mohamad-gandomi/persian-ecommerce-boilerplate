import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { REQUIRE_FEATURE_KEY, FeatureKey } from '../decorators/require-feature.decorator';

@Injectable()
export class FeatureGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredFeature = this.reflector.getAllAndOverride<FeatureKey>(
      REQUIRE_FEATURE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredFeature) {
      return true;
    }

    const isEnabled = this.configService.get<boolean>(
      `features.${requiredFeature}`,
      true,
    );

    if (!isEnabled) {
      throw new NotFoundException(
        `Feature "${requiredFeature}" is disabled on this server instance`,
      );
    }

    return true;
  }
}
