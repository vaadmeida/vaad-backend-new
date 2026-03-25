import { CommentService } from './../service/comment.service';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { BlogService } from '../service/blog.service';
import { BlogCategory, BlogTags } from '../enum/blog-category.enum';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateBlogCommentDTO,
  CreateBlogDTO,
  FilterBlogDTO,
} from '../dto/blog.dto';

@ApiTags('Blogs')
@Controller('blogs')
export class BlogController {
  constructor(
    private readonly blogService: BlogService,
    private readonly commentService: CommentService,
  ) {}

  @Get('assets')
  assets() {
    return {
      tags: Object.values(BlogTags),
      categories: Object.values(BlogCategory),
    };
  }

  @Post()
  createBlog(@Body() blog: CreateBlogDTO) {
    return this.blogService.createBlog(blog);
  }

  @Get()
  getBlogs(@Query() query: FilterBlogDTO) {
    return this.blogService.getBlogs(query);
  }

  @Get(':id')
  getOneBlog(@Param('id') id: string) {
    return this.blogService.getBlogById(id);
  }

  @Post('comments')
  createComment(@Body() blogDto: CreateBlogCommentDTO) {
    return this.commentService.createComment(blogDto);
  }

  @Get(':id/comments')
  getBlogComments(@Param('id') blogId: string) {
    return this.commentService.getComments(blogId);
  }
}
