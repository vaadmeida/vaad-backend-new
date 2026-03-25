import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { BlogCategory, BlogTags } from '../enum/blog-category.enum';

export class CreateBlogDTO {
  @ApiProperty({ example: 'http://example.com/image.jpg' })
  @IsUrl()
  @IsNotEmpty()
  image: string;

  @ApiProperty({ example: 'Uses of water' })
  @IsString()
  @IsNotEmpty()
  headline: string;

  @ApiProperty({ example: 'Uses of water in homes' })
  @IsString()
  @IsNotEmpty()
  subHeadline: string;

  @ApiProperty({ example: BlogCategory.Campaigns })
  @IsEnum(BlogCategory)
  @IsNotEmpty()
  category: BlogCategory;

  @ApiProperty({ example: [BlogTags.Campaigns, BlogTags.NewsAndUpdate] })
  @IsEnum(BlogTags, { each: true })
  @IsOptional()
  tags: BlogTags[];

  @ApiProperty({ example: 'This is the body of the blog post.' })
  @IsString()
  @IsNotEmpty()
  body: string;
}

export class FilterBlogDTO {
  @ApiProperty({ example: 'Campaign' })
  @IsOptional()
  keyword: string;

  @ApiProperty({
    example: [BlogCategory.Campaigns, BlogCategory.LocationAndVisibility],
  })
  @IsEnum(BlogCategory, { each: true })
  @IsOptional()
  category: BlogCategory[];

  @ApiProperty({ example: [BlogTags.Campaigns, BlogTags.NewsAndUpdate] })
  @IsEnum(BlogTags, { each: true })
  @IsOptional()
  tags: BlogTags[];
}

export class CreateBlogCommentDTO {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({ example: '69c4597b75a696493289f139' })
  @IsString()
  @IsOptional()
  blogId: string;

  @ApiProperty({ example: '69c4597b75a696493289f139' })
  @IsString()
  @IsOptional()
  parentCommentId: string;

  @ApiProperty({ example: 'This is the body of the blog post.' })
  @IsString()
  @IsNotEmpty()
  message: string;
}
