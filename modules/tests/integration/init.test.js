const path = require('path')
const spawnSync = require('cross-spawn').sync
const { setupEnvironment } = require('./helpers')

describe('init command', () => {
  const { run, readFile, rootDir } = setupEnvironment('init')
  run('init')

  it('should create config file', () => {
    const config = JSON.parse(readFile('e2e-tests/e2e-tools.json'))
    expect(config).toEqual({})
  })

  it('should create .gitignore', () => {
    expect(readFile('e2e-tests/.gitignore')).toMatchInlineSnapshot(`
      "node_modules/
      .env
      *.log
      package-lock.json
      "
    `)
  })

  it('should create package.json', async () => {
    const packageJson = JSON.parse(readFile('e2e-tests/package.json'))
    expect(packageJson).toEqual({
      devDependencies: {
        '@csssr/e2e-tools': '*',
      },
      prettier: '@csssr/e2e-tools/prettier',
      private: true,
    })
  })

  it('should create eslint files', async () => {
    const eslintFile = readFile('e2e-tests/.eslintrc.js')
    expect(eslintFile).toMatchInlineSnapshot(`
      "module.exports = {
        extends: ['@csssr/e2e-tools/eslint'],
      }
      "
    `)

    const eslintIgnoreFile = readFile('e2e-tests/.eslintignore')
    expect(eslintIgnoreFile).toMatchInlineSnapshot(`
      "!.eslintrc.js
      "
    `)
  })

  it('should create .env file', async () => {
    const envFile = readFile('e2e-tests/.env')
    expect(envFile).toMatchInlineSnapshot(`
      "LAUNCH_URL=
      "
    `)
  })

  it('should be prettified', () => {
    const { stderr } = spawnSync('yarn', ['prettier', '--check', '**/*.{js,json}'], {
      cwd: path.join(rootDir, 'e2e-tests'),
    })

    const err = stderr && stderr.toString()
    expect(err).toBe('')
  })
})