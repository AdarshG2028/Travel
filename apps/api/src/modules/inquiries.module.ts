import { Body, Controller, Get, Inject, Module, Post, UseGuards } from "@nestjs/common";
import { inquirySchema, type InquiryInput } from "@travel/validation";
import { AdminGuard } from "../common/admin.guard";
import { PrismaService } from "../common/prisma.service";
import { ZodPipe } from "../common/zod.pipe";

@Controller("inquiries")
export class InquiriesController {
  constructor(@Inject(PrismaService) private readonly db: PrismaService) {}

  @Post()
  async create(@Body(new ZodPipe(inquirySchema)) body: InquiryInput) {
    const row = await this.db.inquiry.create({ data: body });
    return { id: row.id };
  }

  @Get()
  @UseGuards(AdminGuard)
  list() {
    return this.db.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  }
}

@Module({ controllers: [InquiriesController], providers: [AdminGuard] })
export class InquiriesModule {}
