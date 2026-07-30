import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'dev-secret-min-32-chars-xxxxxxxxxx',
    });
  }
  async validate(payload: any) {
    const user = await prismaSafe(this.prisma, payload.sub);
    if (!user || user.status !== 'ACTIVE') throw new UnauthorizedException('غير صالح');
    return user;
  }
}

async function prismaSafe(prisma: PrismaService, id: string) {
  return prisma.user.findUnique({ where: { id } });
}
