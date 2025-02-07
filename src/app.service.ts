import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  welcomeMessage(): string {
    return 'WELCOME TO THE ESTATE MANAGEMENT APP';
  }
}
