import { Controller, Get } from '@nestjs/common';
import { BlogService } from '../service/blog.service';
import { BlogCategory, BlogTags } from '../enum/blog-category.enum';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  assets() {
    return {
      tags: Object.values(BlogTags),
      categories: Object.values(BlogCategory),
    };
  }
}
