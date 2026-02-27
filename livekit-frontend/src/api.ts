export interface JoinResponse {
  token: string;
  serverUrl: string;
  roomName: string;
  identity: string;
}

export async function joinRoom(params: {
  roomName: string;
  userName: string;
}): Promise<JoinResponse> {
  const query = new URLSearchParams({
    roomName: params.roomName,
    userName: params.userName,
  }).toString();

  const res = await fetch(`http://localhost:3000/rooms/join?${query}`);
  if (!res.ok) {
    throw new Error(`Error joining room: ${res.status}`);
  }
  return res.json();
}
