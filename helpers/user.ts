import { User } from '../models/User';
export async function getUserByWalletOrSlug(id: string): Promise<User | null> {
  let user: User | null = null;

  try {
    user = await User.findOne({
      $or: [
        { wallet: id },
        { slug: id }
      ]
    });
  } catch (error) {
    console.error(error);
  }

  return user;
}
