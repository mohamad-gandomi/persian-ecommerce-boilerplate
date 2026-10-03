import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AttributesService } from './attributes.service';
import { CreateAttributeDto, UpdateAttributeDto } from './dto/create-attribute.dto';
import { CreateAttributeValueDto, UpdateAttributeValueDto } from './dto/create-attribute-value.dto';
import { Public } from '@/common/decorators/public.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/common/enums/role.enum';

@ApiTags('Product Attributes & Variations')
@Controller('attributes')
export class AttributesController {
  constructor(private readonly attributesService: AttributesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Public: List all attributes with their values/swatches' })
  findAll() {
    return this.attributesService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Public: Get single attribute with its values' })
  findOne(@Param('id') id: string) {
    return this.attributesService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Create a new attribute (e.g., Wood Finish, Fabric Color)' })
  create(@Body() dto: CreateAttributeDto) {
    return this.attributesService.create(dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Update an attribute' })
  update(@Param('id') id: string, @Body() dto: UpdateAttributeDto) {
    return this.attributesService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Delete an attribute and its values' })
  delete(@Param('id') id: string) {
    return this.attributesService.delete(id);
  }

  @Post(':id/values')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Add a value/term to an attribute (e.g., Walnut to Wood Finish)' })
  addValue(@Param('id') attributeId: string, @Body() dto: CreateAttributeValueDto) {
    return this.attributesService.addValue(attributeId, dto);
  }

  @Patch('values/:valueId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Update an attribute value/term' })
  updateValue(@Param('valueId') valueId: string, @Body() dto: UpdateAttributeValueDto) {
    return this.attributesService.updateValue(valueId, dto);
  }

  @Delete('values/:valueId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Delete an attribute value/term' })
  deleteValue(@Param('valueId') valueId: string) {
    return this.attributesService.deleteValue(valueId);
  }
}
