import { Injectable } from '@nestjs/common';
import { NotificationsGateway } from './notification.gateway';

@Injectable()
export class NotificationsService {
    constructor(private readonly notificationsGateway: NotificationsGateway) {}
  
    sendServiceChargeUpdate(newCharge: number) {
      this.notificationsGateway.sendToAll({
        type: 'SERVICE_CHARGE_UPDATE',
        charge: newCharge,
      });
    }
  }