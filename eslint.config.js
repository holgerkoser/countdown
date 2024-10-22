import neostandard from 'neostandard'
import pluginVue from 'eslint-plugin-vue'

export default [
  ...neostandard({
    ignores: [
      '.pnp.cjs',
      '.pnp.loader.mjs',
      '.yarn/sdks',
      '**/dist/**',
    ],
  }),
  {
    rules: {
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
    },
  },
  ...pluginVue.configs['flat/recommended'],
]
