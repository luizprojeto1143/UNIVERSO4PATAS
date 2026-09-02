import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InventoryService } from './inventory.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { StockMovementDto } from './dto/stock-movement.dto';
import { CreateControlledLogDto } from './dto/controlled-log.dto';

@UseGuards(JwtAuthGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // --- LOTES & VALIDADES ---
  @Post('batches')
  createBatch(@Body() dto: CreateBatchDto) {
    return this.inventoryService.createBatch(dto);
  }

  @Get('batches/expiring')
  getExpiringBatches(@Request() req: any, @Query('days') days?: string) {
    const daysAhead = days ? parseInt(days, 10) : 60;
    return this.inventoryService.getExpiringBatches(req.user.organizationId, daysAhead);
  }

  @Get('batches/product/:productId')
  findBatchesByProduct(@Param('productId') productId: string) {
    return this.inventoryService.findBatchesByProduct(productId);
  }

  // --- MOVIMENTAÇÕES DE ESTOQUE ---
  @Post('movements')
  registerStockMovement(@Request() req: any, @Body() dto: StockMovementDto) {
    return this.inventoryService.registerStockMovement(req.user.organizationId, req.user.userId, dto);
  }

  @Get('movements')
  getStockMovements(@Request() req: any, @Query('productId') productId?: string) {
    return this.inventoryService.getStockMovements(req.user.organizationId, productId);
  }

  // --- MEDICAMENTOS CONTROLADOS ---
  @Post('controlled')
  createControlledLog(@Request() req: any, @Body() dto: CreateControlledLogDto) {
    return this.inventoryService.createControlledLog(req.user.organizationId, dto);
  }

  @Get('controlled')
  getControlledLogs(@Request() req: any, @Query('productId') productId?: string) {
    return this.inventoryService.getControlledLogs(req.user.organizationId, productId);
  }
}
