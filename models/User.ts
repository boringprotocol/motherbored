export class User {
    static findOne(arg0: { $or: ({ wallet: string; } | { slug: string; })[]; }): User | PromiseLike<User | null> | null {
        throw new Error('Method not implemented.');
    }
    name?: string;
    wallet?: string;
    bio?: string;
    image?: string;
  
    constructor(name?: string, wallet?: string, bio?: string, image?: string) {
      this.name = name;
      this.wallet = wallet;
      this.bio = bio;
      this.image = image;
    }
  }
  