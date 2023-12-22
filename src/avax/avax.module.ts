import { Module } from '@nestjs/common';
import { AvaxService } from 'src/avax/avax.task';
@Module({
    providers: [AvaxService],
})
export class AvaxModule { }
