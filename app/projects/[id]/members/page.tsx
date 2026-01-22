import { redirect } from 'next/navigation';
import { getAuthUser } from '@/src/http/middlewares/verify-jwt';
import { makeGetProjectDetailsUseCase } from '@/src/use-cases/factories/make-get-project-details';
import { ProjectMembersClient } from './project-members-client';

export default async function ProjectMembersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getAuthUser();

  if (!user) {
    redirect('https://painel.stratustelecom.com.br/main/login.php');
  }

  const { id } = await params;
  const projectId = Number.parseInt(id, 10);

  if (Number.isNaN(projectId)) {
    redirect('/projects');
  }

  try {
    const getProjectDetails = makeGetProjectDetailsUseCase();
    const { project } = await getProjectDetails.execute({ user, projectId });

    return <ProjectMembersClient project={project} user={user} />;
  } catch (err) {
    console.error(err);
    redirect('/projects');
  }
}
