import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import helmet from "helmet";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors({
    origin: [process.env.WEB_ORIGIN ?? "http://localhost:3000", process.env.ADMIN_ORIGIN ?? "http://localhost:3001"],
    credentials: true,
  });
  await app.listen(Number(process.env.API_PORT ?? 4000));
}
bootstrap();
