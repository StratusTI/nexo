import { UserRepository } from "@/src/application/repositories/user-repository";
import { UserEntity } from "@/src/domain/entities/user";
import { prismaSteel } from "../prisma-clients";

export class PrismaUserRepository implements UserRepository {
  async findById(id: number): Promise<UserEntity | null> {
    const user = await prismaSteel.usuario.findUnique({
      where: { id },
      include: {
        empresa: {
          select: {
            id: true,
            nome: true
          }
        }
      }
    });

    if (!user) return null;

    return new UserEntity(
      user.id,
      user.nome ?? '',
      user.email ?? '',
      user.sobrenome ?? '',
      user.foto ?? '',
      user.telefone ?? '',
      user.admin ?? false,
      user.superadmin ?? false,
      user.role ?? 'member',
      user.idempresa,
      user.departamento ?? '',
      user.time ?? '',
      user.online
    );
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await prismaSteel.usuario.findUnique({
      where: { email },
      include: {
        empresa: {
          select: {
            id: true,
            nome: true
          }
        }
      }
    })

    if (!user) return null

    return new UserEntity(
      user.id,
      user.nome ?? '',
      user.email ?? '',
      user.sobrenome ?? '',
      user.foto ?? '',
      user.telefone ?? '',
      user.admin ?? false,
      user.superadmin ?? false,
      user.role ?? 'member',
      user.idempresa,
      user.departamento ?? '',
      user.time ?? '',
      user.online
    );
  }
}
