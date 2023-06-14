import { type NextApiRequest, type NextApiResponse } from 'next';
import z from 'zod';
import { getServerAuthSession } from '~/server/auth';
import { getPusherServerClient } from '~/server/pusher';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { groupId } = z.object({ groupId: z.string() }).parse(req.body);
    const session = await getServerAuthSession({ req, res });

    if (!session) {
        res.status(401).send('No session provided');
        return;
    }

    await getPusherServerClient().trigger(`groupMessage-${groupId}`, 'userTyping', {
        id: session.user.id,
        name: session.user.name
    });
    res.status(200).send(undefined);
}
