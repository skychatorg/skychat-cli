import { SkyChatClient } from 'skychat';
import { SanitizedRoom } from 'skychat/build/server/skychat/Room';
import slugify from 'slugify';

export function renderRoom(client: SkyChatClient, room: SanitizedRoom) {
    // If room is current room, add a star
    const star = room.id === client.state.currentRoomId ? '*' : ' ';

    // Compute a name
    let name;
    if (room.isPrivate) {
        const others = room.whitelist.filter((u) => u !== client.state.user.username.toLowerCase());
        name = `@ ${others.join(', ')}`;
    } else {
        name = slugify(room.name);
    }

    return `${star} ${name}`;
}
