import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from '../schema/blog.schema';
import { Model, QueryFilter } from 'mongoose';
import { FilterBlogDTO } from '../dto/blog.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name)
    private readonly BlogModel: Model<Blog>,
  ) {}

  async createBlog(blog: Partial<Blog>) {
    const newBlog = new this.BlogModel(blog);
    return newBlog.save();
  }

  async getBlogs(query: FilterBlogDTO) {
    const filter: QueryFilter<Blog> = {};

    if (query.tags) {
      filter.tags = { $in: query.tags };
    }

    if (query.category) {
      filter.category = { $in: query.category };
    }

    if (query.keyword) {
      filter.$text = { $search: query.keyword };
    }

    return this.BlogModel.find(filter).sort({ views: -1, createdAt: -1 });
  }

  async getBlogById(id: string) {
    return this.BlogModel.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { returnDocument: 'after' },
    );
  }
}
