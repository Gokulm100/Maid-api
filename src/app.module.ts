import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ServicesModule } from './services/services.module';
import { AuthMiddleware } from './middlewares/auth.middleware';
@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://gokulmishere:Inapp%40%40111@cluster0.iexd4.mongodb.net/Maid-app'), // replace with your MongoDB connection string
    UsersModule, ServicesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('/services'); // Apply the middleware to all routes
  }
}
