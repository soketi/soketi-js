import { Connector } from './connector';
import { SoketiChannel, SoketiPrivateChannel, SoketiPresenceChannel } from '../channel';

export class SoketiConnector extends Connector {
    /**
     * The Socket.io connection instance.
     */
    socket: any;

    /**
     * All of the subscribed channel names.
     */
    channels: { [name: string]: SoketiChannel } = {};

    /**
     * Create a fresh Socket.io connection.
     */
    connect(): void {
        let io = this.getSocketIO();

        this.socket = io(this.compileHost(), this.options);

        this.socket.on('reconnect', () => {
            Object.values(this.channels).forEach((channel) => {
                channel.subscribe();
            });
        });

        return this.socket;
    }

    /**
     * Get socket.io module from global scope or options.
     */
    getSocketIO(): any {
        if (typeof this.options.client !== 'undefined') {
            return this.options.client;
        }

        if (typeof io !== 'undefined') {
            return io;
        }

        throw new Error('Socket.io client not found. Should be globally available or passed via options.client');
    }

    /**
     * Listen for an event on a channel instance.
     */
    listen(name: string, event: string, callback: Function): SoketiChannel {
        return this.channel(name).listen(event, callback);
    }

    /**
     * Get a channel instance by name.
     */
    channel(name: string): SoketiChannel {
        if (!this.channels[name]) {
            this.channels[name] = new SoketiChannel(this.socket, name, this.options);
        }

        return this.channels[name];
    }

    /**
     * Get a private channel instance by name.
     */
    privateChannel(name: string): SoketiPrivateChannel {
        if (!this.channels['private-' + name]) {
            this.channels['private-' + name] = new SoketiPrivateChannel(this.socket, 'private-' + name, this.options);
        }

        return this.channels['private-' + name] as SoketiPrivateChannel;
    }

    /**
     * Get a presence channel instance by name.
     */
    presenceChannel(name: string): SoketiPresenceChannel {
        if (!this.channels['presence-' + name]) {
            this.channels['presence-' + name] = new SoketiPresenceChannel(
                this.socket,
                'presence-' + name,
                this.options
            );
        }

        return this.channels['presence-' + name] as SoketiPresenceChannel;
    }

    /**
     * Leave the given channel, as well as its private and presence variants.
     */
    leave(name: string): void {
        let channels = [name, 'private-' + name, 'presence-' + name];

        channels.forEach((name) => {
            this.leaveChannel(name);
        });
    }

    /**
     * Leave the given channel.
     */
    leaveChannel(name: string): void {
        if (this.channels[name]) {
            this.channels[name].unsubscribe();

            delete this.channels[name];
        }
    }

    /**
     * Register a callback to be called on any event.
     */
     onAny(callback: Function): SoketiConnector {
        this.socket.onAny((event, ...args) => {
            callback(event, ...args);
        });

        return this;
    }

    /**
     * Get the socket ID for the connection.
     */
    socketId(): string {
        return this.socket.id;
    }

    /**
     * Disconnect Socketio connection.
     */
    disconnect(): void {
        this.socket.disconnect();
    }

    /**
     * Compile the host name for the connection.
     */
    protected compileHost(): string {
        return this.options.host
            ? this.options.host + ':' + this.options.port + '/' + this.options.key
            : `${this.options.cluster}-ws.soketi.app` + ':' + this.options.port + '/' + this.options.key;
    }
}
