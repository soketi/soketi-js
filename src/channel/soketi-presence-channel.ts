import { SoketiPrivateChannel } from './';

export class SoketiPresenceChannel extends SoketiPrivateChannel {
    /**
     * Register a callback to be called anytime the member list changes.
     */
    here(callback: Function): SoketiPresenceChannel {
        this.on('presence:subscribed', (members: any[]) => {
            callback(members.map((m) => m.user_info));
        });

        return this;
    }

    /**
     * Listen for someone joining the channel.
     */
    joining(callback: Function): SoketiPresenceChannel {
        this.on('presence:joining', (member) => callback(member.user_info));

        return this;
    }

    /**
     * Listen for someone leaving the channel.
     */
    leaving(callback: Function): SoketiPresenceChannel {
        this.on('presence:leaving', (member) => callback(member.user_info));

        return this;
    }
}
