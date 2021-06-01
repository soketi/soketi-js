Soketi.js
=========

![CI](https://github.com/soketi/soketi-js/workflows/CI/badge.svg?branch=master)
[![Latest Stable Version](https://img.shields.io/github/v/release/soketi/soketi-js)](https://www.npmjs.com/package/@soketi/soketi-js)
[![Total Downloads](https://img.shields.io/npm/dt/@soketi/soketi-js)](https://www.npmjs.com/package/@soketi/soketi-js)
[![License](https://img.shields.io/npm/l/@soketi/soketi-js)](https://www.npmjs.com/package/@soketi/soketi-js)

Soketi.js is a hard fork of [Laravel Echo](https://github.com/laravel/echo) that works with Soketi, a Laravel-ready WebSockets service.

## 🤝 Supporting

Renoki Co. on GitHub aims on bringing a lot of open source projects and helpful projects to the world. Developing and maintaining projects everyday is a harsh work and tho, we love it.

If you are using your application in your day-to-day job, on presentation demos, hobby projects or even school projects, spread some kind words about our work or sponsor our work. Kind words will touch our chakras and vibe, while the sponsorships will keep the open source projects alive.

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/R6R42U8CL)

## 🚀 Installation

You can install the package via npm:

```bash
npm install --save-dev @soketi/soketi-js
```

## 🙌 Usage

Soketi.js is a hard fork of [laravel/echo](https://github.com/laravel/echo), meaning that you can use it as a normal Echo client, being fully compatible with all the docs [in the Broadcasting docs](https://laravel.com/docs/8.x/broadcasting).

```js
import Soketi from '@soketi/soketi-js';

window.Soketi = new Soketi({
    host: window.location.hostname,
    key: 'echo-app-key', // should be replaced with the App Key
    authHost: 'http://127.0.0.1',
    authEndpoint: '/broadcasting/auth',
});

// for example
Soketi.channel('twitter').listen('.tweet', e => {
    console.log({ tweet: e.tweet });
});
```

## Authorizing Sanctum

The package has full compatibility with the Pusher.js connector, meaning that you can [specify the `authorizer` for the request](https://laravel.com/docs/8.x/sanctum#authorizing-private-broadcast-channels):

```js
window.Soketi = new Soketi({
    host: window.location.hostname,
    key: 'echo-app-key',
    encrypted: true,
    authorizer: (channel, options) => {
        return {
            authorize: (socketId, callback) => {
                axios.post('/api/broadcasting/auth', {
                    socket_id: socketId,
                    channel_name: channel.name,
                })
                .then(response => {
                    callback(false, response.data);
                })
                .catch(error => {
                    callback(true, error);
                });
            },
        };
    },
});
```

## Catching any event

You can catch any event using `.onAny()`:

```js
Soketi.onAny((event, ...args) => {
    //
});
```

## Catching errors

Sometimes the connection might throw errors:

```js
Soketi.error(({ message, code }) => {
    //
});
```

## 🐛 Testing

``` bash
npm run test
```

## 🤝 Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

## 🔒  Security

If you discover any security related issues, please email alex@renoki.org instead of using the issue tracker.

## 🎉 Credits

- [Alex Renoki](https://github.com/rennokki)
- [All Contributors](../../contributors)
