import { Body, Controller, Post } from '@nestjs/common';
import { ManagerService } from './manager.service';

@Controller('manager')
export class ManagerController {
    constructor(private readonly managersService: ManagerService) {}

    @Post('update-service-charge')
    updateServiceCharge(@Body('charge') charge: number) {
        this.managersService.updateServiceCharge(charge);
        return `Service charge updated to ${charge} and notification sent`
    }
}
