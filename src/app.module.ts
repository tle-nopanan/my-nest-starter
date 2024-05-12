import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(), // Initialize ConfigModule
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Make ConfigModule available
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        user: configService.get<string>('MONGODB_USERNAME'),
        pass: configService.get<string>('MONGODB_PASSWORD'),
        dbName: configService.get<string>('MONGODB_DATABASE'),
      }),
      inject: [ConfigService], // Inject ConfigService to use it in useFactory
    }),
    ProductsModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
