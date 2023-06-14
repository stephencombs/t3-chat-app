import { env } from '~/env.mjs';
import Pusher, { type PresenceChannel } from 'pusher-js';
import { useEffect, useRef } from 'react';

export const usePusher = () => {
    let pusherClient: Pusher;
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

    return { pusherClient };
};

const usePusherClient = () => {
    const pusherClient = useRef<Pusher>();

    if (Pusher.instances.length) {
        pusherClient.current = Pusher.instances[0] as Pusher;
        pusherClient.current.connect();
        pusherClient.current.signin();
    } else {
        pusherClient.current = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
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

    return { pusherClient: pusherClient.current };
};

export function useEvent<TData>(channelName: string, eventName: string, callback: (data: TData) => void) {
    const { pusherClient } = usePusherClient();
    const stableCallback = useRef(callback);

    useEffect(() => {
        stableCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        const channel = pusherClient.subscribe(channelName);

        channel.bind(eventName, stableCallback.current);

        return () => {
            console.log('Cleanup useEvent');
            pusherClient.unbind(eventName, stableCallback.current);
            pusherClient.unsubscribe(channelName);
        };
    }, [channelName, eventName, pusherClient]);
}
