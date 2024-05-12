import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { Model } from 'mongoose';

import { ProductsService } from 'src/products/products.service';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private productsService: ProductsService,
  ) {}
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const productResult = await this.productsService.findOne(
      createOrderDto.productId,
    );

    if (!productResult) {
      throw new NotFoundException('product not found');
    }

    const result = new this.orderModel(createOrderDto);
    return result.save();
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = this.orderModel.findById(id).populate('productId').exec();
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const productResult = await this.productsService.findOne(
      updateOrderDto.productId,
    );

    if (!productResult) {
      throw new NotFoundException('product not found');
    }
    const result = this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
      .exec();
    if (!result) {
      throw new NotFoundException('Order not found');
    }
    return result;
  }

  async remove(id: string) {
    try {
      const result = await this.orderModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException('id not found');
      }
      return { message: 'Delete successful' };
    } catch (error) {
      throw error;
    }
  }
}
