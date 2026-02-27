import { Module } from '@nestjs/common';
import { LivekitService } from './livekit.service';
import { RoomsController } from './rooms.controller';

@Module({
  providers: [LivekitService],
  controllers: [RoomsController],
  exports: [LivekitService],
})
export class LivekitModule {}
