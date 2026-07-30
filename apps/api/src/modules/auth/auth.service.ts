import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { PasswordService } from './password.service';
import { RegisterDto, LoginDto, RefreshDto, LogoutDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService, private pw: PasswordService) {}

  private sign(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwt.sign(payload, { expiresIn: '15m' });
    return accessToken;
  }

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findFirst({ where: { OR: [{ email: dto.email }, { phone: dto.phone }] } });
    if (exists) throw new ConflictException('البريد أو الجوال مسجل مسبقاً');
    const user = await this.prisma.user.create({
      data: {
        firstName: dto.firstName, lastName: dto.lastName, email: dto.email, phone: dto.phone,
        passwordHash: await this.pw.hash(dto.password), cityId: dto.cityId || null,
      },
    });
    return { user: this.sanitize(user), accessToken: this.sign(user) };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({ where: { OR: [{ email: dto.identifier }, { phone: dto.identifier }] } });
    if (!user || !(await this.pw.verify(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('بيانات الدخول غير صحيحة');
    }
    if (user.status !== 'ACTIVE') throw new UnauthorizedException('الحساب غير نشط');
    const refreshToken = crypto.randomBytes(32).toString('hex');
    await this.prisma.refreshToken.create({
      data: { userId: user.id, tokenHash: this.hash(refreshToken), expiresAt: new Date(Date.now() + 7 * 86400000) },
    });
    return { user: this.sanitize(user), accessToken: this.sign(user), refreshToken };
  }

  async refresh(dto: RefreshDto) {
    const stored = await this.prisma.refreshToken.findUnique({ where: { tokenHash: this.hash(dto.refreshToken) } });
    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) throw new UnauthorizedException('رمز غير صالح');
    // Rotation: revoke old token, issue new one
    await this.prisma.refreshToken.update({ where: { id: stored.id }, data: { revokedAt: new Date() } });
    const user = await this.prisma.user.findUnique({ where: { id: stored.userId } });
    if (!user) throw new UnauthorizedException('غير صالح');
    const refreshToken = crypto.randomBytes(32).toString('hex');
    await this.prisma.refreshToken.create({ data: { userId: user.id, tokenHash: this.hash(refreshToken), expiresAt: new Date(Date.now() + 7 * 86400000) } });
    return { accessToken: this.sign(user), refreshToken };
  }

  // R2 — Logout: revoke refresh token immediately
  async logout(dto: LogoutDto) {
    const stored = await this.prisma.refreshToken.findUnique({ where: { tokenHash: this.hash(dto.refreshToken) } });
    if (!stored || stored.revokedAt) {
      // idempotent — already revoked or unknown token, treat as success
      return { message: 'تم تسجيل الخروج' };
    }
    await this.prisma.refreshToken.update({ where: { id: stored.id }, data: { revokedAt: new Date() } });
    return { message: 'تم تسجيل الخروج' };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('غير موجود');
    return this.sanitize(user);
  }

  private hash(s: string) { return crypto.createHash('sha256').update(s).digest('hex'); }
  private sanitize(u: any) {
    return { id: u.id, firstName: u.firstName, lastName: u.lastName, email: u.email, phone: u.phone, role: u.role };
  }
}
