export interface CreateUserInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface UserAttributes {
  id: string;
  email: string;
  passwordHash: string;
  firstName?: string | null;
  lastName?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}




