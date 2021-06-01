import { SoketiConnector } from './connector';
import Echo from '../echo/src/echo';

export default class Soketi extends Echo {
    /**
     * Create a new connection.
     */
    connect(): void {
        this.connector = new SoketiConnector(this.options);
    }

    /**
     * Register a callback to be called on any event.
     */
    onAny(callback: Function): SoketiConnector {
        return this.connector.onAny(callback);
    }

    /**
     * Register a callback to catch errors.
     */
    error(callback: Function): SoketiConnector {
        return this.connector.error(callback);
    }
}
