module.exports = {
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  arrowParens: 'always',
  tabWidth: 4,
  printWidth: 100,
  endOfLine: 'auto',
  bracketSpacing: true,
  useTabs: false,

  plugins: ['@trivago/prettier-plugin-sort-imports'],

  importOrder: ['^react', '<THIRD_PARTY_MODULES>', '^shared$', '^@/', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,

  overrides: [
    {
      files: ['*.yaml', '*.yml'],
      options: {
        parser: 'yaml',
        tabWidth: 2,
      },
    },
    {
      files: ['*.md', '*.js', '*.json'],
      options: {
        tabWidth: 2,
      },
    },
  ],
};
