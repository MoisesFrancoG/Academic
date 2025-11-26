import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener mensaje de bienvenida' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Mensaje de bienvenida obtenido exitosamente',
  })
  getHello(): { message: string } {
    return { message: this.appService.getHello() };
  }
}
