import bcrypt from 'bcrypt';
import { User } from '../model/user.model';
import { UserRepository } from '../repository/user.repository';
import { CreateUserInput } from '../interfaces/user.interface';

export class UserService {
  constructor(private readonly repo: UserRepository = new UserRepository()) {}

  async signup(input: CreateUserInput): Promise<User> {
    const existing = await this.repo.findByEmail(input.email);
    if (existing) {
      const err: any = new Error('Email already in use');
      err.status = 409;
      throw err;
    }
    const passwordHash = await bcrypt.hash(input.password, 10);
    return this.repo.create({
      email: input.email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
    });
  }

  async validateCredentials(email: string, password: string): Promise<User | null> {
    const user = await this.repo.findByEmail(email);
    if (!user) return null;
    //add jwt
    const ok = await bcrypt.compare(password, user.passwordHash);
    return ok ? user : null;
  }
}




