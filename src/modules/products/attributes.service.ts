import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from '@/database/prisma.service';
import { CreateAttributeDto, UpdateAttributeDto } from './dto/create-attribute.dto';
import { CreateAttributeValueDto, UpdateAttributeValueDto } from './dto/create-attribute-value.dto';

@Injectable()
export class AttributesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.attribute.findMany({
      include: {
        values: {
          orderBy: { name: 'asc' },
        },
        _count: { select: { productAttributes: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const attribute = await this.prisma.attribute.findUnique({
      where: { id },
      include: {
        values: {
          orderBy: { name: 'asc' },
        },
      },
    });

    if (!attribute) {
      throw new NotFoundException(`Attribute with ID ${id} not found`);
    }

    return attribute;
  }

  async create(dto: CreateAttributeDto) {
    const slug = dto.slug
      ? slugify(dto.slug, { lower: true, strict: true })
      : slugify(dto.name, { lower: true, strict: true });

    const existing = await this.prisma.attribute.findUnique({
      where: { slug },
    });
    if (existing) {
      throw new ConflictException(`Attribute with slug '${slug}' already exists`);
    }

    return this.prisma.attribute.create({
      data: {
        name: dto.name,
        slug,
        displayType: dto.displayType || 'TEXT',
      },
      include: { values: true },
    });
  }

  async update(id: string, dto: UpdateAttributeDto) {
    await this.findOne(id);

    let slug: string | undefined;
    if (dto.slug) {
      slug = slugify(dto.slug, { lower: true, strict: true });
    } else if (dto.name) {
      slug = slugify(dto.name, { lower: true, strict: true });
    }

    if (slug) {
      const existing = await this.prisma.attribute.findUnique({
        where: { slug },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException(`Attribute with slug '${slug}' already exists`);
      }
    }

    return this.prisma.attribute.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(slug && { slug }),
        ...(dto.displayType !== undefined && { displayType: dto.displayType }),
      },
      include: { values: true },
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.attribute.delete({
      where: { id },
    });
  }

  // --- Values / Terms ---

  async addValue(attributeId: string, dto: CreateAttributeValueDto) {
    await this.findOne(attributeId);

    const value = dto.value
      ? slugify(dto.value, { lower: true, strict: true })
      : slugify(dto.name, { lower: true, strict: true });

    const existing = await this.prisma.attributeValue.findUnique({
      where: {
        attributeId_value: {
          attributeId,
          value,
        },
      },
    });

    if (existing) {
      throw new ConflictException(`Value '${value}' already exists for this attribute`);
    }

    return this.prisma.attributeValue.create({
      data: {
        attributeId,
        name: dto.name,
        value,
        colorHex: dto.colorHex,
        image: dto.image,
      },
    });
  }

  async updateValue(valueId: string, dto: UpdateAttributeValueDto) {
    const term = await this.prisma.attributeValue.findUnique({
      where: { id: valueId },
    });

    if (!term) {
      throw new NotFoundException(`Attribute value with ID ${valueId} not found`);
    }

    let value = term.value;
    if (dto.value) {
      value = slugify(dto.value, { lower: true, strict: true });
    } else if (dto.name && !dto.value) {
      value = slugify(dto.name, { lower: true, strict: true });
    }

    if (value !== term.value) {
      const existing = await this.prisma.attributeValue.findUnique({
        where: {
          attributeId_value: {
            attributeId: term.attributeId,
            value,
          },
        },
      });
      if (existing && existing.id !== valueId) {
        throw new ConflictException(`Value '${value}' already exists for this attribute`);
      }
    }

    return this.prisma.attributeValue.update({
      where: { id: valueId },
      data: {
        ...(dto.name && { name: dto.name }),
        value,
        ...(dto.colorHex !== undefined && { colorHex: dto.colorHex }),
        ...(dto.image !== undefined && { image: dto.image }),
      },
    });
  }

  async deleteValue(valueId: string) {
    const term = await this.prisma.attributeValue.findUnique({
      where: { id: valueId },
    });

    if (!term) {
      throw new NotFoundException(`Attribute value with ID ${valueId} not found`);
    }

    return this.prisma.attributeValue.delete({
      where: { id: valueId },
    });
  }
}
