export default {
    extends: ['@commitlint/config-conventional'],
    rules: {
      'type-enum': [
        2,
        'always',
        [
          'feat',     // Nova funcionalidade
          'fix',      // Correção de bug
          'docs',     // Documentação
          'style',    // Formatação
          'refactor', // Refatoração
          'perf',     // Performance
          'test',     // Testes
          'build',    // Build
          'ci',       // CI/CD
          'chore',    // Outras alterações
          'revert',   // Reverter commit
        ],
      ],
      'subject-case': [0], // Permite qualquer case no subject
    },
}
