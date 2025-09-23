import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.use(cookieParser()); // 🔑 enables req.cookies

  app.enableCors({
    origin: ["https://nesskai-email-marketing.netlify.app","http://localhost:3000","https://email-marketing-frontend.onrender.com"], // Specific frontend origin
    credentials: true, // Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"], // Explicit methods
    allowedHeaders: ["Content-Type", "Authorization"], // Explicit headers
  });
  const port = process.env.APP_PORT || 8000;
  await app.listen(port);
  console.log(`API running on http://0.0.0.0:${port}/api`);
}
bootstrap();
