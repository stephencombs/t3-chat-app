import Pusher from 'pusher-js';
import { env } from '~/env.mjs';

let pusherClient: Pusher;

export function getPusherClient(): Pusher {
    if (Pusher.instances.length) {
        pusherClient = Pusher.instances[0] as Pusher;
        pusherClient.connect();
        pusherClient.signin();
    } else {
        pusherClient = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
            cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
            userAuthentication: {
                endpoint: '/api/pusher/auth-user',
                transport: 'ajax'
            },
            channelAuthorization: {
                endpoint: '/api/pusher/auth-channel',
                transport: 'ajax'
            }
        });
    }
    return pusherClient;
}
