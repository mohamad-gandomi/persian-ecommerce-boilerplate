import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { KavenegarService } from './kavenegar.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.secret') || 'ecommerce_boilerplate_jwt_secret_key_change_in_production',
        signOptions: {
          expiresIn: config.get<string>('jwt.expiresIn') || '7d',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, KavenegarService],
  exports: [AuthService, JwtStrategy, PassportModule, JwtModule, KavenegarService],
})
export class AuthModule {}
