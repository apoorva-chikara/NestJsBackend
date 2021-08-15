import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { JWTAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('article')
export class ArticleController {
    constructor(
        private readonly articleService: ArticleService,
    ) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    @UseGuards(JWTAuthGuard)
    async getAllArticle() {
        return await this.articleService.getAllArticles();
    }

}
