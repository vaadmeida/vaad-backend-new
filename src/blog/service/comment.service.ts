import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from '../schema/comment.schema';
import { CreateBlogCommentDTO } from '../dto/blog.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name)
    private readonly CommentModel: Model<Comment>,
  ) {}

  async createComment({ blogId, ...comment }: CreateBlogCommentDTO) {
    const newComment = new this.CommentModel({ ...comment, blog: blogId });

    if (comment.parentCommentId) {
      return this.createReply({ blogId, ...comment });
    }

    return newComment.save();
  }

  async createReply({ parentCommentId, ...comment }: CreateBlogCommentDTO) {
    const newComment = await this.CommentModel.create({ ...comment });

    return this.CommentModel.findByIdAndUpdate(
      parentCommentId,
      {
        $set: { reply: newComment._id },
      },
      { returnDocument: 'after' },
    )
      .orFail(new Error('Parent comment not found'))
      .populate('reply');
  }

  async getComments(blogId: string) {
    const comments = await this.CommentModel.find({ blog: blogId })
      .populate('reply')
      .sort({ createdAt: -1 });

    return comments;
  }
}
