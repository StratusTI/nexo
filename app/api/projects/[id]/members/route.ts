import type { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { requireProjectRole } from '@/src/http/middlewares/require-project-role';
import { ConflictError } from '@/src/use-cases/errors/conflict-error';
import { InsufficientPermissionsError } from '@/src/use-cases/errors/insufficient-permissions-error';
import { ResourceNotFoundError } from '@/src/use-cases/errors/resource-not-found-error';
import { makeAddProjectMemberUseCase } from '@/src/use-cases/factories/make-add-project-member';
import { makeGetProjectMembersUsecase } from '@/src/use-cases/factories/make-get-project-members';
import { standardError, successResponse } from '@/src/utils/http-response';
import { addMemberSchema } from '@/src/utils/zod-schemas/add-member-schema';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const projectId = Number.parseInt(id, 10);

  if (Number.isNaN(projectId)) {
    return standardError('BAD_REQUEST', 'Invalid project ID');
  }

  const { user, error } = await requireProjectRole({
    projectId,
    minimumRole: 'viewer',
  });

  if (error) return error;

  try {
    const getProjectMembers = makeGetProjectMembersUsecase();

    if (!user) return standardError('UNAUTHORIZED', 'User not found');

    const { members } = await getProjectMembers.execute({
      user: user,
      projectId,
    });

    return successResponse(
      {
        members: members.map((m) => ({
          id: m.id,
          userId: m.usuarioId,
          role: m.role,
          source: m.source,
          addedAt: m.adicionadoEm,
          user: {
            id: m.usuario.id,
            nome: m.usuario.nome,
            sobrenome: m.usuario.sobrenome,
            email: m.usuario.email,
            foto: m.usuario.foto,
          },
        })),
      },
      200,
    );
  } catch (err) {
    console.error('[GET] /api/projects/[id]/members Unexpected error', err);
    return standardError('INTERNAL_SERVER_ERROR', 'Unexpected error');
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const projectId = Number.parseInt(id, 10);

  if (Number.isNaN(projectId)) {
    return standardError('BAD_REQUEST', 'Invalid project ID');
  }

  const { user, error: authError } = await requireProjectRole({
    projectId,
    permission: 'invite_member',
  });

  if (authError) return authError;

  try {
    const body = await req.json();
    const validatedData = addMemberSchema.parse(body);

    const addMember = makeAddProjectMemberUseCase();

    if (!user) return standardError('UNAUTHORIZED', 'User not found');

    const { member } = await addMember.execute({
      user: user,
      projectId,
      userId: validatedData.userId,
      role: validatedData.role,
    });

    return successResponse(
      {
        member: {
          id: member.id,
          userId: member.userId,
          role: member.role,
          addedAt: member.addedAt,
          user: member.user,
        },
      },
      201,
      'Member added successfully',
    );
  } catch (err) {
    if (err instanceof ZodError) {
      return standardError('VALIDATION_ERROR', 'Validation failed');
    }

    if (err instanceof ResourceNotFoundError) {
      return standardError('RESOURCE_NOT_FOUND', 'User or project not found');
    }

    if (err instanceof ConflictError) {
      return standardError('CONFLICT', err.message);
    }

    if (err instanceof InsufficientPermissionsError) {
      return standardError('FORBIDDEN', err.message);
    }

    console.error('[POST /api/projects/[id]/members]  Unexpected error', err);
    return standardError('INTERNAL_SERVER_ERROR', 'Failed to add member');
  }
}
