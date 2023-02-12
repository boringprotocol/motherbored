import { NextApiRequest, NextApiResponse } from 'next';
import { getUserByWalletOrSlug } from '../../../helpers/user';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { id } = req.query;

        const user = await getUserByWalletOrSlug(id as string);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        console.log(user);
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

