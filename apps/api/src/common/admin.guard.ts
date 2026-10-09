import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

/** Placeholder until Phase 5 (Clerk): requires a shared admin key, never exposed to browsers. */
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const key = process.env.ADMIN_API_KEY;
    const req = ctx.switchToHttp().getRequest();
    if (!key || req.headers["x-admin-key"] !== key) throw new UnauthorizedException();
    return true;
  }
}
