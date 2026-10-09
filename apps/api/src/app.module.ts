import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { PrismaModule } from "./common/prisma.service";
import { CatalogModule } from "./modules/catalog.module";
import { InquiriesModule } from "./modules/inquiries.module";

@Module({
  imports: [ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]), PrismaModule, CatalogModule, InquiriesModule],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
