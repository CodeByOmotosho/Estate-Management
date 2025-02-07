import { Injectable } from '@nestjs/common';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class ManagerService {
    constructor(private readonly notificationsService: NotificationsService) {}

  updateServiceCharge(newCharge: number) {
    // Business logic to update service charge
    console.log(`Service charge updated to ${newCharge}`);

    // Notify all connected users via WebSockets
    this.notificationsService.sendServiceChargeUpdate(newCharge);
  }
}
