import { Injectable } from '@nestjs/common';

@Injectable()
export class SeedService {
  constructor(@InjectRepository) {}
}
