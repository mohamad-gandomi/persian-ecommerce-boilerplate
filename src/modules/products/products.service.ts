import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import slugify from 'slugify';
import { Prisma, ProductStatus } from '@prisma/client';
import { PrismaService } from '@/database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductsDto, ProductSortBy } from './dto/filter-products.dto';
import { CreateVariantDto, UpdateVariantDto } from './dto/create-variant.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: FilterProductsDto) {
    const {
      skip,
      limit,
      search,
      categoryId,
      categorySlug,
      minPrice,
      maxPrice,
      featured,
      status,
      sortBy,
    } = filters;

    const where: Prisma.ProductWhereInput = {};

    if (status) {
      where.status = status;
    } else {
      where.status = ProductStatus.PUBLISHED;
    }

    if (featured !== undefined) {
      where.featured = featured;
    }

    if (categorySlug) {
      const cat = await this.prisma.category.findUnique({
        where: { slug: categorySlug },
        include: {
          children: {
            select: {
              id: true,
              children: { select: { id: true } },
            },
          },
        },
      });
      if (cat) {
        const allIds = [
          cat.id,
          ...cat.children.map((c) => c.id),
          ...cat.children.flatMap((c) => c.children.map((gc) => gc.id)),
        ];
        where.categoryId = { in: allIds };
      } else {
        where.category = { slug: categorySlug };
      }
    } else if (categoryId) {
      const cat = await this.prisma.category.findUnique({
        where: { id: categoryId },
        include: {
          children: {
            select: {
              id: true,
              children: { select: { id: true } },
            },
          },
        },
      });
      if (cat) {
        const allIds = [
          cat.id,
          ...cat.children.map((c) => c.id),
          ...cat.children.flatMap((c) => c.children.map((gc) => gc.id)),
        ];
        where.categoryId = { in: allIds };
      } else {
        where.categoryId = categoryId;
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.basePrice = {};
      if (minPrice !== undefined) {
        where.basePrice.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.basePrice.lte = maxPrice;
      }
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    switch (sortBy) {
      case ProductSortBy.PRICE_ASC:
        orderBy = { basePrice: 'asc' };
        break;
      case ProductSortBy.PRICE_DESC:
        orderBy = { basePrice: 'desc' };
        break;
      case ProductSortBy.NAME_ASC:
        orderBy = { name: 'asc' };
        break;
      case ProductSortBy.NAME_DESC:
        orderBy = { name: 'desc' };
        break;
      case ProductSortBy.NEWEST:
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          images: { orderBy: { displayOrder: 'asc' } },
          attributes: {
            include: {
              attribute: {
                include: { values: true },
              },
            },
          },
          variants: {
            where: { isActive: true },
            include: {
              attributeValues: {
                include: {
                  attributeValue: {
                    include: { attribute: true },
                  },
                },
              },
            },
          },
          _count: { select: { variants: true } },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page: filters.page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlugOrId(identifier: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        OR: [
          { id: identifier },
          { slug: identifier },
        ],
      },
      include: {
        category: true,
        images: { orderBy: { displayOrder: 'asc' } },
        attributes: {
          include: {
            attribute: {
              include: { values: true },
            },
          },
        },
        variants: {
          include: {
            attributeValues: {
              include: {
                attributeValue: {
                  include: {
                    attribute: true,
                  },
                },
              },
            },
          },
          orderBy: { price: 'asc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with identifier '${identifier}' not found`);
    }

    return product;
  }

  async findBySlug(slug: string) {
    return this.findBySlugOrId(slug);
  }

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: { orderBy: { displayOrder: 'asc' } },
        attributes: {
          include: {
            attribute: {
              include: { values: true },
            },
          },
        },
        variants: {
          include: {
            attributeValues: {
              include: {
                attributeValue: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }

    return product;
  }

  async create(dto: CreateProductDto) {
    const slug = dto.slug
      ? slugify(dto.slug, { lower: true, strict: true })
      : slugify(dto.name, { lower: true, strict: true });

    const existingSlug = await this.prisma.product.findUnique({
      where: { slug },
    });
    if (existingSlug) {
      throw new ConflictException(`Product with slug '${slug}' already exists`);
    }

    if (dto.sku) {
      const existingSku = await this.prisma.product.findUnique({
        where: { sku: dto.sku },
      });
      if (existingSku) {
        throw new ConflictException(`Product with SKU '${dto.sku}' already exists`);
      }
    }

    const { images, attributes, variants, ...productData } = dto;

    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          ...productData,
          slug,
          images: images && images.length > 0
            ? {
                create: images.map((img, idx) => ({
                  url: img.url,
                  altText: img.altText,
                  displayOrder: img.displayOrder ?? idx,
                  isPrimary: img.isPrimary ?? idx === 0,
                })),
              }
            : undefined,
          attributes: attributes && attributes.length > 0
            ? {
                create: attributes.map((attr) => ({
                  attributeId: attr.attributeId,
                  isVariation: attr.isVariation ?? true,
                })),
              }
            : undefined,
        },
      });

      if (variants && variants.length > 0) {
        for (const v of variants) {
          await tx.productVariant.create({
            data: {
              productId: product.id,
              sku: v.sku,
              price: v.price,
              salePrice: v.salePrice,
              stockQuantity: v.stockQuantity ?? 0,
              image: v.image,
              weight: v.weight,
              dimensions: v.dimensions,
              isActive: v.isActive ?? true,
              attributeValues: {
                create: v.attributeValueIds.map((attrValId) => ({
                  attributeValueId: attrValId,
                })),
              },
            },
          });
        }
      }

      return tx.product.findUnique({
        where: { id: product.id },
        include: {
          category: true,
          images: true,
          attributes: { include: { attribute: { include: { values: true } } } },
          variants: { include: { attributeValues: { include: { attributeValue: true } } } },
        },
      });
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    const existing = await this.findById(id);

    let slug = existing.slug;
    if (dto.slug) {
      slug = slugify(dto.slug, { lower: true, strict: true });
    } else if (dto.name && !dto.slug) {
      slug = slugify(dto.name, { lower: true, strict: true });
    }

    if (slug !== existing.slug) {
      const conflict = await this.prisma.product.findUnique({ where: { slug } });
      if (conflict && conflict.id !== id) {
        throw new ConflictException(`Product with slug '${slug}' already exists`);
      }
    }

    const { images, attributes, variants, ...productData } = dto;

    return this.prisma.$transaction(async (tx) => {
      if (images) {
        await tx.productImage.deleteMany({ where: { productId: id } });
        await tx.productImage.createMany({
          data: images.map((img, idx) => ({
            productId: id,
            url: img.url,
            altText: img.altText,
            displayOrder: img.displayOrder ?? idx,
            isPrimary: img.isPrimary ?? idx === 0,
          })),
        });
      }

      if (attributes) {
        await tx.productAttribute.deleteMany({ where: { productId: id } });
        await tx.productAttribute.createMany({
          data: attributes.map((attr) => ({
            productId: id,
            attributeId: attr.attributeId,
            isVariation: attr.isVariation ?? true,
          })),
        });
      }

      const updated = await tx.product.update({
        where: { id },
        data: {
          ...productData,
          slug,
        },
        include: {
          category: true,
          images: { orderBy: { displayOrder: 'asc' } },
          attributes: { include: { attribute: { include: { values: true } } } },
          variants: { include: { attributeValues: { include: { attributeValue: true } } } },
        },
      });

      return updated;
    });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.product.delete({
      where: { id },
    });
  }

  // --- Variations Management ---

  async addVariant(productId: string, dto: CreateVariantDto) {
    const product = await this.findById(productId);

    const existingSku = await this.prisma.productVariant.findUnique({
      where: { sku: dto.sku },
    });
    if (existingSku) {
      throw new ConflictException(`Variant with SKU '${dto.sku}' already exists`);
    }

    const attributeValues = await this.prisma.attributeValue.findMany({
      where: { id: { in: dto.attributeValueIds } },
    });

    if (attributeValues.length !== dto.attributeValueIds.length) {
      throw new BadRequestException('One or more attribute value IDs are invalid');
    }

    const variant = await this.prisma.productVariant.create({
      data: {
        productId: product.id,
        sku: dto.sku,
        price: dto.price,
        salePrice: dto.salePrice,
        stockQuantity: dto.stockQuantity ?? 0,
        image: dto.image,
        weight: dto.weight,
        dimensions: dto.dimensions,
        isActive: dto.isActive ?? true,
        attributeValues: {
          create: dto.attributeValueIds.map((attrValId) => ({
            attributeValueId: attrValId,
          })),
        },
      },
      include: {
        attributeValues: {
          include: {
            attributeValue: {
              include: { attribute: true },
            },
          },
        },
      },
    });

    return variant;
  }

  async updateVariant(variantId: string, dto: UpdateVariantDto) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      throw new NotFoundException(`Product variant with ID ${variantId} not found`);
    }

    if (dto.sku && dto.sku !== variant.sku) {
      const existingSku = await this.prisma.productVariant.findUnique({
        where: { sku: dto.sku },
      });
      if (existingSku && existingSku.id !== variantId) {
        throw new ConflictException(`Variant with SKU '${dto.sku}' already exists`);
      }
    }

    const { attributeValueIds, ...variantData } = dto;

    return this.prisma.$transaction(async (tx) => {
      if (attributeValueIds) {
        await tx.variantAttributeValue.deleteMany({
          where: { variantId },
        });

        await tx.variantAttributeValue.createMany({
          data: attributeValueIds.map((valId) => ({
            variantId,
            attributeValueId: valId,
          })),
        });
      }

      return tx.productVariant.update({
        where: { id: variantId },
        data: variantData,
        include: {
          attributeValues: {
            include: {
              attributeValue: {
                include: { attribute: true },
              },
            },
          },
        },
      });
    });
  }

  async deleteVariant(variantId: string) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      throw new NotFoundException(`Product variant with ID ${variantId} not found`);
    }

    return this.prisma.productVariant.delete({
      where: { id: variantId },
    });
  }
}
