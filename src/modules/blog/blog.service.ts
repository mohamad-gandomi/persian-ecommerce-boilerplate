import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import slugify from 'slugify';
import { Prisma, PostStatus } from '@prisma/client';
import { PrismaService } from '@/database/prisma.service';
import { CreateBlogPostDto, UpdateBlogPostDto } from './dto/create-blog-post.dto';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';
import { FilterBlogPostsDto } from './dto/filter-blog-posts.dto';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  // --- Categories ---

  async findCategoryTree() {
    return this.prisma.blogCategory.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            children: true,
            _count: { select: { posts: true } },
          },
          orderBy: { displayOrder: 'asc' },
        },
        _count: { select: { posts: true, children: true } },
      },
      orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
    });
  }

  async findAllCategories() {
    return this.prisma.blogCategory.findMany({
      include: {
        parent: { select: { id: true, name: true, slug: true } },
        children: {
          orderBy: { displayOrder: 'asc' },
        },
        _count: { select: { posts: true, children: true } },
      },
      orderBy: [{ parentId: 'asc' }, { displayOrder: 'asc' }, { name: 'asc' }],
    });
  }

  async createCategory(dto: CreateBlogCategoryDto) {
    const slug = dto.slug
      ? slugify(dto.slug, { lower: true, strict: true })
      : slugify(dto.name, { lower: true, strict: true });

    const existing = await this.prisma.blogCategory.findUnique({
      where: { slug },
    });
    if (existing) {
      throw new ConflictException(`Category with slug '${slug}' already exists`);
    }

    if (dto.parentId) {
      const parent = await this.prisma.blogCategory.findUnique({
        where: { id: dto.parentId },
      });
      if (!parent) {
        throw new NotFoundException(`Parent category with ID '${dto.parentId}' does not exist`);
      }
    }

    return this.prisma.blogCategory.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description || null,
        image: dto.image || null,
        parentId: dto.parentId || null,
        displayOrder: dto.displayOrder ? Number(dto.displayOrder) : 0,
      },
      include: {
        parent: true,
        _count: { select: { posts: true } },
      },
    });
  }

  async updateCategory(id: string, dto: UpdateBlogCategoryDto) {
    const existing = await this.prisma.blogCategory.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Blog category with ID '${id}' not found`);
    }

    if (dto.parentId) {
      if (dto.parentId === id) {
        throw new ConflictException('A category cannot be its own parent');
      }
      const parent = await this.prisma.blogCategory.findUnique({
        where: { id: dto.parentId },
      });
      if (!parent) {
        throw new NotFoundException(`Parent category with ID '${dto.parentId}' does not exist`);
      }
    }

    let slug = existing.slug;
    if (dto.slug && dto.slug !== existing.slug) {
      slug = slugify(dto.slug, { lower: true, strict: true });
      const duplicate = await this.prisma.blogCategory.findUnique({
        where: { slug },
      });
      if (duplicate && duplicate.id !== id) {
        throw new ConflictException(`Category with slug '${slug}' already exists`);
      }
    } else if (dto.name && !dto.slug && dto.name !== existing.name) {
      slug = slugify(dto.name, { lower: true, strict: true });
      const duplicate = await this.prisma.blogCategory.findUnique({
        where: { slug },
      });
      if (duplicate && duplicate.id !== id) {
        slug = existing.slug;
      }
    }

    return this.prisma.blogCategory.update({
      where: { id },
      data: {
        name: dto.name ?? existing.name,
        slug,
        description: dto.description !== undefined ? dto.description : existing.description,
        image: dto.image !== undefined ? dto.image : existing.image,
        parentId: dto.parentId !== undefined ? (dto.parentId || null) : existing.parentId,
        displayOrder: dto.displayOrder !== undefined ? Number(dto.displayOrder) : existing.displayOrder,
      },
      include: {
        parent: true,
        _count: { select: { posts: true } },
      },
    });
  }

  async deleteCategory(id: string) {
    const existing = await this.prisma.blogCategory.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Blog category with ID '${id}' not found`);
    }

    return this.prisma.blogCategory.delete({
      where: { id },
    });
  }

  // --- Posts ---

  async findAllPosts(filters: FilterBlogPostsDto) {
    const { skip, limit, search, categorySlug, status } = filters;

    const where: Prisma.BlogPostWhereInput = {};

    if (status) {
      where.status = status;
    } else {
      where.status = PostStatus.PUBLISHED;
    }

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [posts, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          author: { select: { id: true, firstName: true, lastName: true } },
        },
      }),
      this.prisma.blogPost.count({ where }),
    ]);

    return {
      data: posts,
      meta: {
        total,
        page: filters.page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findAllAdminPosts(filters: { search?: string; status?: string; categoryId?: string }) {
    const where: Prisma.BlogPostWhereInput = {};

    if (filters.status && filters.status !== 'ALL') {
      where.status = filters.status as PostStatus;
    }

    if (filters.categoryId && filters.categoryId !== 'ALL') {
      where.categoryId = filters.categoryId;
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { content: { contains: filters.search, mode: 'insensitive' } },
        { excerpt: { contains: filters.search, mode: 'insensitive' } },
        { slug: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async findPostBySlug(slugOrId: string) {
    const post = await this.prisma.blogPost.findFirst({
      where: {
        OR: [{ slug: slugOrId }, { id: slugOrId }],
      },
      include: {
        category: true,
        author: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    if (!post) {
      throw new NotFoundException(`Blog post '${slugOrId}' not found`);
    }

    return post;
  }

  async createPost(authorId: string, dto: CreateBlogPostDto) {
    const slug = dto.slug
      ? slugify(dto.slug, { lower: true, strict: true })
      : slugify(dto.title, { lower: true, strict: true });

    const existing = await this.prisma.blogPost.findUnique({
      where: { slug },
    });
    if (existing) {
      throw new ConflictException(`Blog post with slug '${slug}' already exists`);
    }

    return this.prisma.blogPost.create({
      data: {
        ...dto,
        slug,
        authorId,
        publishedAt: dto.status === PostStatus.PUBLISHED ? new Date() : null,
      },
      include: {
        category: true,
        author: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async updatePost(id: string, dto: UpdateBlogPostDto) {
    const existing = await this.prisma.blogPost.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }

    let slug = existing.slug;
    if (dto.slug) {
      slug = slugify(dto.slug, { lower: true, strict: true });
    } else if (dto.title && !dto.slug) {
      slug = slugify(dto.title, { lower: true, strict: true });
    }

    if (slug !== existing.slug) {
      const conflict = await this.prisma.blogPost.findUnique({ where: { slug } });
      if (conflict && conflict.id !== id) {
        throw new ConflictException(`Blog post with slug '${slug}' already exists`);
      }
    }

    return this.prisma.blogPost.update({
      where: { id },
      data: {
        ...dto,
        slug,
        ...(dto.status === PostStatus.PUBLISHED && !existing.publishedAt && {
          publishedAt: new Date(),
        }),
      },
      include: {
        category: true,
        author: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async deletePost(id: string) {
    const existing = await this.prisma.blogPost.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }

    return this.prisma.blogPost.delete({
      where: { id },
    });
  }
}
