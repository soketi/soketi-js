import { SoketiChannel } from './';

export class SoketiPrivateChannel extends SoketiChannel {
    /**
     * Trigger client event on the channel.
     */
    whisper(eventName: string, data: any): SoketiPrivateChannel {
        this.socket.emit('client event', {
            channel: this.name,
            event: `client-${eventName}`,
            data: data,
        });

        return this;
    }

    /**
     * Subscribe to a Socket.io channel.
     */
    subscribe(): void {
        this.authenticate().then(response => {
            this.socket.emit('subscribe', {
                channel: this.name,
                auth: this.options.auth || {},
                channel_data: response.channel_data,
                token: response.auth,
            });
        }, error => console.log(error));
    }

    /**
     * Authenticate the client.
     */
    protected authenticate(): Promise<any> {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();

            xhr.open('POST', this.options.authHost + this.options.authEndpoint);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.withCredentials = true;

            for (let header in this.options.auth.headers) {
                xhr.setRequestHeader(header, this.options.auth.headers[header]);
            }

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        try {
                            resolve(JSON.parse(xhr.responseText || '{}'));
                        } catch (e) {
                            reject(e);
                        }
                    } else {
                        reject({ message: 'The authentication failed with non-200.' });
                    }
                }
            };

            xhr.send(JSON.stringify({
                channel_name: this.name,
                socket_id: this.socket.id,
            }));
        });
    }
}
