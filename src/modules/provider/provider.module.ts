import { Module } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { ProviderController } from './provider.controller';
import { Provider } from './entities/provider.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ProviderController],
  providers: [ProviderService],
  imports: [TypeOrmModule.forFeature([Provider])],
})
export class ProviderModule {}
