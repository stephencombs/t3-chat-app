import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { getServerAuthSession } from '~/server/auth';
import { getPusherServerClient } from '~/server/pusher';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { channel_name, socket_id } = z.object({ channel_name: z.string(), socket_id: z.string() }).parse(req.body);
    const session = await getServerAuthSession({ req, res });

    if (!session) {
        res.status(401).send('No session provided');
        return;
    }

    res.send(
        getPusherServerClient().authorizeChannel(socket_id, channel_name, {
            user_id: session.user.id
        })
    );
}
