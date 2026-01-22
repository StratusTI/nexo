-- DropForeignKey
ALTER TABLE `projeto_membros` DROP FOREIGN KEY `fk_pm_projeto`;

-- DropIndex
DROP INDEX `uniq_projeto_usuario` ON `projeto_membros`;

-- DropIndex
DROP INDEX `idx_prazo` ON `tarefas`;

-- DropIndex
DROP INDEX `idx_prazo_prioridade` ON `tarefas`;

-- AlterTable
ALTER TABLE `documentos` ADD COLUMN `status` ENUM('draft', 'published', 'private') NOT NULL DEFAULT 'draft';

-- AlterTable
ALTER TABLE `projeto_membros` ADD COLUMN `source` VARCHAR(50) NULL DEFAULT 'direct';

-- AlterTable
ALTER TABLE `projetos` DROP COLUMN `cor`,
    ADD COLUMN `acesso` BOOLEAN NULL DEFAULT true,
    ADD COLUMN `backgroundUrl` VARCHAR(255) NULL,
    ADD COLUMN `icone` VARCHAR(50) NULL,
    ADD COLUMN `id_empresa` INTEGER NOT NULL,
    ADD COLUMN `prioridade` ENUM('urgent', 'high', 'medium', 'low', 'none') NULL DEFAULT 'none',
    ADD COLUMN `projectId` VARCHAR(10) NULL,
    MODIFY `status` ENUM('draft', 'planning', 'execution', 'monitoring', 'completed', 'cancelled') NULL DEFAULT 'draft';

-- AlterTable
ALTER TABLE `tarefas` DROP COLUMN `prazo`,
    ADD COLUMN `data_fim` DATE NULL,
    ADD COLUMN `data_inicio` DATE NULL,
    ADD COLUMN `status` ENUM('backlog', 'todo', 'in_progress', 'done', 'cancelled') NULL DEFAULT 'backlog',
    MODIFY `prioridade` ENUM('urgent', 'high', 'medium', 'low', 'none') NULL DEFAULT 'none';

-- CreateIndex
CREATE INDEX `idx_projeto` ON `documentos`(`projeto_id`, `status`);

-- CreateIndex
CREATE UNIQUE INDEX `uniq_projeto_usuario_source` ON `projeto_membros`(`projeto_id`, `usuario_id`, `source`);

-- CreateIndex
CREATE INDEX `idx_empresa` ON `projetos`(`id_empresa`, `status`);

-- AddForeignKey
ALTER TABLE `pi_objective_features` ADD CONSTRAINT `fk_piof_feature` FOREIGN KEY (`feature_id`) REFERENCES `features`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

