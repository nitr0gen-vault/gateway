import { Module } from '@nestjs/common';
import { ActiveledgerService } from '../activeledger/activeledger.service';

@Module({
    imports:[ActiveledgerService],
    exports:[ActiveledgerService],
    providers:[ActiveledgerService]
})
export class CommonModule {}
