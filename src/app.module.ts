import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controllers/user/user.controller';
import { KeysController } from './controllers/keys/keys.controller';
import { User } from './entities/user.entity';
import { Key } from './entities/key.entity';
import { ActiveledgerService } from './activeledger/activeledger.service';
import { NftController } from './controllers/nft/nft.controller';
import { Layer2Controller } from './controllers/layer2/layer2.controller';
import { GenericController } from './controllers/generic/generic.controller';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return {
          type: 'mongodb',
          url: process.env.MONGODB_CONNECTION_STRING,
          database: process.env.MONGODB_DATABASE,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
        };
      },
    }),
    TypeOrmModule.forFeature([User, Key]),
    // CommonModule,
  ],
  controllers: [UserController, KeysController, NftController, Layer2Controller, GenericController],
  providers: [ActiveledgerService],
})
export class AppModule {}
