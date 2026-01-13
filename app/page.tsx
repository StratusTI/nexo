import { redirect } from "next/navigation";
import { requireAuth } from "@/src/interface-adapters/guards/require-auth";

export default async function ProfilePage() {
  const { user, error } = await requireAuth();

  if (error || !user) {
    redirect('/login');
  }

  const nomeCompleto = `${user.nome} ${user.sobrenome}`.trim();
  const isAdmin = user.admin === true;
  const isSuperAdmin = user.superadmin === true;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Meu Perfil</h1>

      <div className="space-y-2">
        <p><strong>Nome:</strong> {nomeCompleto}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Telefone:</strong> {user.telefone}</p>
        <p><strong>Departamento:</strong> {user.departamento}</p>
        <p><strong>Time:</strong> {user.time}</p>
        <p><strong>Role:</strong> {user.role}</p>

        <div className="flex gap-2 mt-4">
          {isAdmin && (
            <span className="px-2 py-1 bg-blue-500 text-white rounded">
              Administrador
            </span>
          )}

          {isSuperAdmin && (
            <span className="px-2 py-1 bg-purple-500 text-white rounded">
              Super Admin
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
