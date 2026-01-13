// infrastructure/database/prisma/repositories/prisma-user-repository.ts
import { UserRepository } from "@/src/application/repositories/user-repository";
import { UserEntity } from "@/src/domain/entities/user";
import { prismaSteel } from "../prisma-clients";

export class PrismaUserRepository implements UserRepository {
  async findById(id: number): Promise<UserEntity | null> {
    const user = await prismaSteel.usuario.findUnique({
      where: { id }
    });

    if (!user || !user.email) return null;

    return new UserEntity(
      user.id,
      user.nome ?? '',
      user.sobrenome ?? '',
      user.email,
      user.foto ?? '',
      user.telefone ?? '',
      user.admin ?? false,
      user.superadmin ?? false,
      user.role ?? this.mapRole(user.admin ?? false, user.superadmin ?? false),
      user.idempresa ?? null,
      user.departamento ?? null,
      user.time ?? '',
      user.online
    );
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await prismaSteel.usuario.findUnique({
      where: { email }
    });

    if (!user || !user.email) return null;

    return new UserEntity(
      user.id,
      user.nome ?? '',
      user.sobrenome ?? '',
      user.email,
      user.foto ?? '',
      user.telefone ?? '',
      user.admin ?? false,
      user.superadmin ?? false,
      user.role ?? this.mapRole(user.admin ?? false, user.superadmin ?? false),
      user.idempresa ?? null,
      user.departamento ?? null,
      user.time ?? '',
      user.online
    );
  }

  private mapRole(admin: boolean, superadmin: boolean): 'admin' | 'member' | 'viewer' {
    if (superadmin) return 'admin';
    if (admin) return 'admin';
    return 'member';
  }
}
