import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { CreateShippingMethodDto, UpdateShippingMethodDto } from './dto/shipping.dto';

export interface ShippingMethodOption {
  id: string;
  name: string;
  type: string;
  carrier: string;
  price: number;
  currency: string;
  estimatedDays: string;
  description: string;
  isDefault: boolean;
  isActive: boolean;
  displayOrder: number;
  supportsTracking: boolean;
}

@Injectable()
export class ShippingService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedDefaultsIfEmpty();
  }

  private async seedDefaultsIfEmpty() {
    try {
      const count = await this.prisma.shippingMethod.count();
      if (count === 0) {
        await this.prisma.shippingMethod.createMany({
          data: [
            {
              name: 'Fixed-Rate Furniture Freight',
              type: 'FIXED',
              price: 50.0,
              currency: 'USD',
              carrier: 'Chapar / Old Dominion Heavy Freight',
              estimatedDays: '3-6 business days',
              description: 'Standard fixed-rate curbside freight with timber packaging and protective crating.',
              isDefault: true,
              isActive: true,
              displayOrder: 1,
            },
            {
              name: 'Express Courier Dispatch',
              type: 'FIXED',
              price: 35.0,
              currency: 'USD',
              carrier: 'Tipax Express Courier',
              estimatedDays: '1-3 business days',
              description: 'Expedited parcel dispatch for small pieces, accents, swatches, and craft components.',
              isDefault: false,
              isActive: true,
              displayOrder: 2,
            },
            {
              name: 'Store Direct Pickup',
              type: 'LOCAL_PICKUP',
              price: 0.0,
              currency: 'USD',
              carrier: 'Self-Pickup (Central Store)',
              estimatedDays: '1-2 business days',
              description: 'Collect your order directly from our store.',
              isDefault: false,
              isActive: true,
              displayOrder: 3,
            },
          ],
        });
      }
    } catch {
      // Ignore if table not yet migrated during startup
    }
  }

  async findAll(): Promise<ShippingMethodOption[]> {
    await this.seedDefaultsIfEmpty();
    const records = await this.prisma.shippingMethod.findMany({
      where: { isActive: true },
      orderBy: [{ isDefault: 'desc' }, { displayOrder: 'asc' }, { createdAt: 'asc' }],
    });

    return records.map((r) => this.formatOption(r));
  }

  async findAllAdmin() {
    await this.seedDefaultsIfEmpty();
    const records = await this.prisma.shippingMethod.findMany({
      orderBy: [{ isDefault: 'desc' }, { displayOrder: 'asc' }, { createdAt: 'asc' }],
    });

    return records.map((r) => this.formatOption(r));
  }

  async findById(id: string): Promise<ShippingMethodOption> {
    const record = await this.prisma.shippingMethod.findUnique({
      where: { id },
    });

    if (!record) {
      throw new NotFoundException(`Shipping method with ID "${id}" not found`);
    }

    return this.formatOption(record);
  }

  async create(dto: CreateShippingMethodDto) {
    if (dto.isDefault) {
      // Unset previous defaults
      await this.prisma.shippingMethod.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }

    const created = await this.prisma.shippingMethod.create({
      data: {
        name: dto.name,
        type: dto.type || 'FIXED',
        price: dto.price,
        currency: dto.currency || 'USD',
        carrier: dto.carrier || null,
        estimatedDays: dto.estimatedDays || null,
        description: dto.description || null,
        isDefault: dto.isDefault || false,
        isActive: dto.isActive !== undefined ? dto.isActive : true,
        displayOrder: dto.displayOrder || 0,
      },
    });

    return this.formatOption(created);
  }

  async update(id: string, dto: UpdateShippingMethodDto) {
    await this.findById(id);

    if (dto.isDefault) {
      await this.prisma.shippingMethod.updateMany({
        where: { isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    const updated = await this.prisma.shippingMethod.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.type !== undefined && { type: dto.type }),
        ...(dto.price !== undefined && { price: dto.price }),
        ...(dto.currency !== undefined && { currency: dto.currency }),
        ...(dto.carrier !== undefined && { carrier: dto.carrier }),
        ...(dto.estimatedDays !== undefined && { estimatedDays: dto.estimatedDays }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.isDefault !== undefined && { isDefault: dto.isDefault }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
        ...(dto.displayOrder !== undefined && { displayOrder: dto.displayOrder }),
      },
    });

    return this.formatOption(updated);
  }

  async delete(id: string) {
    await this.findById(id);
    return this.prisma.shippingMethod.delete({
      where: { id },
    });
  }

  private formatOption(r: any): ShippingMethodOption {
    return {
      id: r.id,
      name: r.name,
      type: r.type || 'FIXED',
      carrier: r.carrier || 'Express Courier',
      price: Number(r.price),
      currency: r.currency || 'USD',
      estimatedDays: r.estimatedDays || '3-5 business days',
      description: r.description || '',
      isDefault: r.isDefault || false,
      isActive: r.isActive,
      displayOrder: r.displayOrder || 0,
      supportsTracking: r.type !== 'LOCAL_PICKUP',
    };
  }
}
