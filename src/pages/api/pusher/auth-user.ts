import { type NextApiRequest, type NextApiResponse } from 'next';
import { z } from 'zod';
import { getServerAuthSession } from '~/server/auth';
import { getPusherServerClient } from '~/server/pusher';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { socket_id } = z.object({ socket_id: z.string() }).parse(req.body);
    const session = await getServerAuthSession({ req, res });

    if (!session) {
        res.status(401).send('No session provided');
        return;
    }

    const pusherAuth = getPusherServerClient().authenticateUser(socket_id, session.user);
    res.send(pusherAuth);
}
