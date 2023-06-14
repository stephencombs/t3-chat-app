import PusherServer from 'pusher';
import { env } from '~/env.mjs';

let pusherServerClient: PusherServer;

export function getPusherServerClient(): PusherServer {
    if (!pusherServerClient) {
        pusherServerClient = new PusherServer({
            appId: env.PUSHER_APP_ID,
            key: env.PUSHER_KEY,
            secret: env.PUSHER_SECRET,
            cluster: env.PUSHER_CLUSTER,
            useTLS: true
        });
    }

    return pusherServerClient;
}
