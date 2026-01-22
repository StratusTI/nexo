import { User } from "../@types/user";

export interface SearchUsersParams {
  companyId: number
  query?: string
  excludeProjectId?: number
  limit?: number
}

export interface UsersRepository {
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  searchByCompany(params: SearchUsersParams): Promise<User[]>;
}
