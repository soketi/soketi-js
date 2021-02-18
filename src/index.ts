import { SoketiConnector } from './connector';
import Echo from '../echo/src/echo';

export default class Soketi extends Echo {
    /**
     * Create a new connection.
     */
    connect(): void {
        this.connector = new SoketiConnector(this.options);
    }
}
