// src/livekit/livekit.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { RoomServiceClient, AccessToken, VideoGrant } from 'livekit-server-sdk';

@Injectable()
export class LivekitService {
  private readonly logger = new Logger(LivekitService.name);
  private readonly roomClient: RoomServiceClient;
  private readonly apiKey: string;
  private readonly apiSecret: string;
  private readonly wsUrl: string; // wss://...

  constructor() {
    this.wsUrl = process.env.LIVEKIT_URL!;
    this.apiKey = process.env.LIVEKIT_API_KEY!;
    this.apiSecret = process.env.LIVEKIT_API_SECRET!;

    if (!this.wsUrl || !this.apiKey || !this.apiSecret) {
      throw new Error(
        'Faltan LIVEKIT_URL, LIVEKIT_API_KEY o LIVEKIT_API_SECRET',
      );
    }

    // LiveKit server SDK espera https:// para las APIs REST
    const httpUrl = this.wsUrl.replace(/^wss:/, 'https:');

    this.logger.log(
      `LiveKit config -> httpUrl=${httpUrl}, wsUrl=${this.wsUrl}, apiKey=${this.apiKey}`,
    );

    this.roomClient = new RoomServiceClient(
      httpUrl,
      this.apiKey,
      this.apiSecret,
    );
  }

  async ensureOneToOneRoom(roomName: string): Promise<void> {
    try {
      await this.roomClient.createRoom({
        name: roomName,
        maxParticipants: 2,
      });
      this.logger.log(`Room "${roomName}" creada`);
    } catch (err: any) {
      const msg = String(err?.message ?? '');
      if (!msg.includes('already exists')) {
        this.logger.error(`Error creando room ${roomName}`, err);
        throw err;
      }
      this.logger.log(`Room "${roomName}" ya existía, continuamos`);
    }
  }

  async generateToken(params: {
    roomName: string;
    identity: string;
    canPublish?: boolean;
    canSubscribe?: boolean;
  }): Promise<string> {
    const grant: VideoGrant = {
      room: params.roomName,
      roomJoin: true,
      canPublish: params.canPublish ?? true,
      canSubscribe: params.canSubscribe ?? true,
    };

    const at = new AccessToken(this.apiKey, this.apiSecret, {
      identity: params.identity,
    });
    at.addGrant(grant);
    return at.toJwt();
  }

  getWsUrl(): string {
    return this.wsUrl;
  }
}
