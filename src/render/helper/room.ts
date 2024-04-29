import { SkyChatClient } from 'skychat';
import { SanitizedRoom } from 'skychat/build/server/skychat/Room';
import slugify from 'slugify';

export function renderRoom(client: SkyChatClient, room: SanitizedRoom) {
    // If room is current room, add a star
    const isCurrentRoom = room.id === client.state.currentRoomId;
    const currentRoomStr = isCurrentRoom ? '*' : ' ';

    // Connected count
    const userCount = client.state.roomConnectedUsers[room.id]?.length ?? 0;
    const userCountStr = userCount === 0 ? null : `(${userCount})`;

    // '@' if private
    const privateRoomStr = room.isPrivate ? '@' : null;

    // Compute a name
    const others = room.whitelist?.filter((u) => u !== client.state.user.username.toLowerCase());
    const name = slugify(room.name) || others.join(', ') || '- no one -';

    // Return the final string
    return [currentRoomStr, privateRoomStr, name, userCountStr].filter(Boolean).join(' ');
}
