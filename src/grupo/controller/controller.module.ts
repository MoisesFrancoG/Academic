import { Module } from '@nestjs/common';
import { GrupoController } from './grupo.controller';
import { GrupoServiceModule } from '../service/service.module';

@Module({
  imports: [GrupoServiceModule],
  controllers: [GrupoController],
})
export class GrupoControllerModule {}
