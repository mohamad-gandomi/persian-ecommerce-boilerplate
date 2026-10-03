import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { CreateBlogPostDto, UpdateBlogPostDto } from './dto/create-blog-post.dto';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';
import { FilterBlogPostsDto } from './dto/filter-blog-posts.dto';
import { Public } from '@/common/decorators/public.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/common/enums/role.enum';

@ApiTags('Blog & Interior Design Articles')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Public()
  @Get('categories/tree')
  @ApiOperation({ summary: 'Public: Get hierarchical tree of blog categories' })
  findCategoryTree() {
    return this.blogService.findCategoryTree();
  }

  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'Public: Get all blog categories' })
  findAllCategories() {
    return this.blogService.findAllCategories();
  }

  @Post('categories')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Create a blog category' })
  createCategory(@Body() dto: CreateBlogCategoryDto) {
    return this.blogService.createCategory(dto);
  }

  @Patch('categories/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Update a blog category' })
  updateCategory(@Param('id') id: string, @Body() dto: UpdateBlogCategoryDto) {
    return this.blogService.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Delete a blog category' })
  deleteCategory(@Param('id') id: string) {
    return this.blogService.deleteCategory(id);
  }

  @Get('admin/posts')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Get all blog posts including drafts' })
  findAllAdminPosts(@Query() filters: any) {
    return this.blogService.findAllAdminPosts(filters);
  }

  @Public()
  @Get('posts')
  @ApiOperation({ summary: 'Public: Filter & list published blog posts' })
  findAllPosts(@Query() filters: FilterBlogPostsDto) {
    return this.blogService.findAllPosts(filters);
  }

  @Public()
  @Get('posts/:slug')
  @ApiOperation({ summary: 'Public: Get full blog post by slug' })
  findPostBySlug(@Param('slug') slug: string) {
    return this.blogService.findPostBySlug(slug);
  }

  @Post('posts')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Publish or draft a blog post' })
  createPost(@CurrentUser('id') authorId: string, @Body() dto: CreateBlogPostDto) {
    return this.blogService.createPost(authorId, dto);
  }

  @Patch('posts/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Update a blog post' })
  updatePost(@Param('id') id: string, @Body() dto: UpdateBlogPostDto) {
    return this.blogService.updatePost(id, dto);
  }

  @Delete('posts/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Delete a blog post' })
  deletePost(@Param('id') id: string) {
    return this.blogService.deletePost(id);
  }
}
