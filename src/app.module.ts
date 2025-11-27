import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ProgramaEstudioModule } from './programa-estudio/programa-estudio.module';
import { AlumnoModule } from './alumno/alumno.module';
import { AsignaturaModule } from './asignatura/asignatura.module';
import { DocenteModule } from './docente/docente.module';
import { GrupoModule } from './grupo/grupo.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ProgramaEstudioModule,
    AlumnoModule,
    AsignaturaModule,
    DocenteModule,
    GrupoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
