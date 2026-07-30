import { Controller, Post, Get, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshDto, LogoutDto } from './dto';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private svc: AuthService) {}

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ strict: { ttl: 60_000, limit: 5 } })
  @ApiOperation({ summary: 'تسجيل مستخدم جديد' })
  @ApiBody({ type: RegisterDto })
  register(@Body() dto: RegisterDto) { return this.svc.register(dto); }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @Throttle({ strict: { ttl: 60_000, limit: 5 } })
  @ApiOperation({ summary: 'تسجيل الدخول' })
  @ApiBody({ type: LoginDto })
  login(@Body() dto: LoginDto) { return this.svc.login(dto); }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @Throttle({ strict: { ttl: 60_000, limit: 10 } })
  @ApiOperation({ summary: 'تجديد رمز الجلسة مع تدوير التوكن' })
  @ApiBody({ type: RefreshDto })
  refresh(@Body() dto: RefreshDto) { return this.svc.refresh(dto); }

  // R2 — Logout: revoke refresh token
  @Post('logout')
  @Public()
  @HttpCode(HttpStatus.OK)
  @Throttle({ strict: { ttl: 60_000, limit: 20 } })
  @ApiOperation({ summary: 'تسجيل الخروج وإلغاء رمز التجديد' })
  @ApiBody({ type: LogoutDto })
  logout(@Body() dto: LogoutDto) { return this.svc.logout(dto); }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @SkipThrottle({ strict: true })
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'بيانات المستخدم الحالي' })
  me(@CurrentUser('id') id: string) { return this.svc.me(id); }
}
