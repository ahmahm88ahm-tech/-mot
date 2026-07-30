import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordService } from './password.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({ secret: process.env.JWT_SECRET || 'dev-secret-min-32-chars-xxxxxxxxxx', signOptions: { expiresIn: '15m' } }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PasswordService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
