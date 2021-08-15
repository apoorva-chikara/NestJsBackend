import { UserModule } from './user/user.module';
import { ArticleModule } from './article/article.module';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { warn } from 'console';
import { ValidationPipe } from '@nestjs/common';
import { ErrorFilter } from "./error.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors : true});
  app.useGlobalPipes(new ValidationPipe({
    // disableErrorMessages: true,
  }));
  app.useGlobalFilters(new ErrorFilter())
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  warn(`APP IS LISTENING TO PORT ${PORT}`);
}
bootstrap();
