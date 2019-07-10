const { run } = require('./run')

describe('init command', () => {
  it('should create e2e-tests/ directory', async () => {
    const { fs } = await run('init')

    expect(fs.existsSync('/e2e-tests')).toBe(true)
  })

  it('should create .gitignore', async () => {
    const { fs } = await run('init')

    expect(fs.readFileSync('/e2e-tests/.gitignore', { encoding: 'utf8' })).toMatchInlineSnapshot(`
      "node_modules/
      .env

      # Autogenerated files
      tests_output/
      mochawesome-report/
      *.log
      package-lock.json
      "
    `)
  })

  it('should create package.json', async () => {
    const { fs } = await run('init')

    const packageJsonFile = fs.readFileSync('/e2e-tests/package.json', { encoding: 'utf8' })
    expect(JSON.parse(packageJsonFile)).toMatchInlineSnapshot(`
      Object {
        "devDependencies": Object {
          "@csssr/e2e-tools": "~0.1.0",
          "husky": "^3.0.0",
        },
        "husky": Object {},
        "prettier": "@csssr/e2e-tools/prettier",
        "private": true,
      }
  `)
  })
})
