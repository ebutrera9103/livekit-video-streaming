// src/livekit/rooms.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { LivekitService } from './livekit.service';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly livekitService: LivekitService) {}

  @Get('join')
  async joinRoom(
    @Query('roomName') roomName?: string,
    @Query('userName') userName?: string,
  ) {
    if (!roomName) roomName = 'demo-room';
    if (!userName) userName = 'user-' + Math.floor(Math.random() * 10_000);

    await this.livekitService.ensureOneToOneRoom(roomName);

    const identity = `${userName}-${Date.now()}`;

    const token = await this.livekitService.generateToken({
      roomName,
      identity,
      canPublish: true,
      canSubscribe: true,
    });

    return {
      token,
      serverUrl: this.livekitService.getWsUrl(), // wss://test-pbi27x2y.livekit.cloud
      roomName,
      identity,
    };
  }
}
