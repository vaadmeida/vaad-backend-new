import { Module } from '@nestjs/common';
import { BlogService } from './service/blog.service';
import { BlogController } from './controller/blog.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './schema/blog.schema';
import { CommentSchema, Comment } from './schema/comment.schema';
import { CommentService } from './service/comment.service';

@Module({
  controllers: [BlogController],
  providers: [BlogService, CommentService],
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
})
export class BlogModule {}
