import { SkyChatClient } from 'skychat';
import { AuthToken } from 'skychat/build/server';

type ConnectCredentials = {
    mode: 'credentials';
    user: string;
    password: string;
};

type ConnectToken = {
    mode: 'token';
    token: AuthToken;
};

type ConnectGuest = {
    mode: 'guest';
};

export function getAnyAvailableRoom(client: SkyChatClient) {
    const room = client.state.rooms.find((room) => !room.isPrivate && !room.plugins.roomprotect);
    if (!room) {
        throw new Error('No available room to join');
    }
    return room;
}

export function joinAnyAvailableRoom(client: SkyChatClient) {
    client.join(getAnyAvailableRoom(client).id);
}

export function getEndPointUrl(protocol: string, host: string): string {
    return `${protocol}://${host}/ws`;
}

export function connect(
    client: SkyChatClient,
    credentials?: ConnectCredentials | ConnectToken | ConnectGuest,
): Promise<void> {
    return new Promise((resolve) => {
        const continueWhenReady = () => {
            // Rooms arn't received yet
            if (client.state.rooms.length === 0) {
                return;
            }

            // If we already joined a room, do not join another one
            if (client.state.currentRoomId !== null) {
                return;
            }

            if (!credentials) {
                // No credentials, do not join any room
                resolve();
            } else if (credentials.mode === 'credentials') {
                // User + password
                client.once('set-user', resolve);
                client.login(credentials.user, credentials.password);
                resolve();
            } else if (credentials.mode === 'token') {
                // Token
                client.setToken(credentials.token);
                resolve();
            } else {
                // Guest
                joinAnyAvailableRoom(client);
                resolve();
            }
        };

        client.connect();
        client.once('room-list', continueWhenReady);
        client.once('join-room', continueWhenReady);
    });
}
