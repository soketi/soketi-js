import { decode as encodeUTF8 } from '@stablelib/utf8';
import { decode as decodeBase64 } from '@stablelib/base64';
import { SoketiPrivateChannel } from './soketi-private-channel';

const nacl = require('tweetnacl');

export class SoketiEncryptedPrivateChannel extends SoketiPrivateChannel {
    /**
     * The shared secret for the encrypted channel.
     */
    protected sharedSecret: string;

    /**
     * Subscribe to a Socket.io channel.
     */
     subscribe(): void {
        this.authenticate().then(response => {
            this.sharedSecret = response.shared_secret;

            this.socket.emit('subscribe', {
                channel: this.name,
                auth: this.options.auth || {},
                channel_data: response.channel_data,
                token: response.auth,
            });
        }, error => console.log(error));
    }

    /**
     * Listen for an event on the encrypted channel instance.
     */
    listen(event: string, callback: Function): SoketiEncryptedPrivateChannel {
        this.on(this.eventFormatter.format(event), event => {
            callback(this.decrypt(event));
        });

        return this;
    }

    /**
     * Decrypt the given event data.
     */
    protected decrypt(event: any) {
        let cipherText = decodeBase64(event.ciphertext);
        let nonce = decodeBase64(event.nonce);
        let key = decodeBase64(this.sharedSecret);

        let raw = encodeUTF8(nacl.secretbox.open(cipherText, nonce, key));

        try {
            return JSON.parse(raw);
        } catch {
            return raw;
        }
    }
}
