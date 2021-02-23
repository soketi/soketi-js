import { SoketiChannel, SoketiPresenceChannel } from './../channel';

export abstract class Connector {
    /**
     * Default connector options.
     */
    private _defaultOptions: any = {
        auth: {
            headers: {},
        },
        authHost: 'http://127.0.0.1',
        authEndpoint: '/broadcasting/auth',
        csrfToken: null,
        host: null,
        port: 6001,
        key: null,
        cluster: 'ws',
        authorizer: null,
        namespace: 'App.Events',
        transports: ['websocket'],
    };

    /**
     * Connector options.
     */
    options: any;

    /**
     * Create a new class instance.
     */
    constructor(options: any) {
        this.setOptions(options);
        this.connect();
    }

    /**
     * Merge the custom options with the defaults.
     */
    protected setOptions(options: any): any {
        this.options = Object.assign(this._defaultOptions, options);

        if (this.csrfToken()) {
            this.options.auth.headers['X-CSRF-TOKEN'] = this.csrfToken();
        }

        return options;
    }

    /**
     * Extract the CSRF token from the page.
     */
    protected csrfToken(): string {
        let selector;

        if (typeof window !== 'undefined' && window['Laravel'] && window['Laravel'].csrfToken) {
            return window['Laravel'].csrfToken;
        } else if (this.options.csrfToken) {
            return this.options.csrfToken;
        } else if (
            typeof document !== 'undefined' &&
            typeof document.querySelector === 'function' &&
            (selector = document.querySelector('meta[name="csrf-token"]'))
        ) {
            return selector.getAttribute('content');
        }

        return null;
    }

    /**
     * Create a fresh connection.
     */
    abstract connect(): void;

    /**
     * Get a channel instance by name.
     */
    abstract channel(channel: string): SoketiChannel;

    /**
     * Get a private channel instance by name.
     */
    abstract privateChannel(channel: string): SoketiChannel;

    /**
     * Get a presence channel instance by name.
     */
    abstract presenceChannel(channel: string): SoketiPresenceChannel;

    /**
     * Leave the given channel, as well as its private and presence variants.
     */
    abstract leave(channel: string): void;

    /**
     * Leave the given channel.
     */
    abstract leaveChannel(channel: string): void;

    /**
     * Get the socket_id of the connection.
     */
    abstract socketId(): string;

    /**
     * Disconnect from the Echo server.
     */
    abstract disconnect(): void;
}
