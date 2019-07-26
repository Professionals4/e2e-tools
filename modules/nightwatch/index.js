const path = require('path')
const { getConfig, updateToolConfig, initTemplate } = require('@csssr/e2e-tools/utils')
const packageName = require('./package.json').name

const createFromTemplate = initTemplate({
  root: 'e2e-tests/nightwatch',
  templatesRoot: path.join(__dirname, 'templates'),
})

/**
 * @returns {import('yargs').CommandModule}
 */
const addNightwatchRunCommand = context => {
  const config = getConfig()
  const browsersConfig = config.tools[packageName].browsers
  const defaultBrowser = Object.entries(browsersConfig).find(([_, browser]) => browser.default)[0]
  const browsers = Object.keys(browsersConfig)

  return {
    aliases: ['nightwatch', 'nw'],
    builder: {
      browser: {
        alias: 'b',
        describe: 'Browser, defined in your e2e-tools.json file',
        default: defaultBrowser,
        choices: browsers,
      },
    },
    command: 'nightwatch:run',
    describe: 'Run nightwatch',
    handler(args) {
      context.spawnSync(
        'yarn',
        [
          'env-cmd',
          'nightwatch',
          '--env',
          args.browser,
          '--config',
          require.resolve('@csssr/e2e-tools-nightwatch/config'),
        ],
        { stdio: 'inherit' }
      )
    },
  }
}

function createToolConfig() {
  return {
    browsers: {
      local_chrome: {
        default: true,
        type: 'webdriver',
        desiredCapabilities: {
          browserName: 'chrome',
          'goog:chromeOptions': {
            args: ['--window-size=1200,800'],
          },
        },
        globals: {
          skipScreenshotAssertions: true,
        },
      },
      remote_chrome: {
        type: 'selenium',
        host: 'chromedriver.csssr.ru',
        basicAuth: {
          username_env: 'CHROMEDRIVER_BASIC_AUTH_USERNAME',
          password_env: 'CHROMEDRIVER_BASIC_AUTH_PASSWORD',
        },

        desiredCapabilities: {
          browserName: 'chrome',
          'goog:chromeOptions': {
            w3c: false,
            args: ['--headless', '--disable-gpu', '--window-size=1200,800'],
          },
        },
        globals: {
          skipScreenshotAssertions: false,
        },
      },
    },
  }
}

function getCommands(context) {
  return [addNightwatchRunCommand(context)]
}

function initScript() {
  createFromTemplate({ filePath: '.eslintrc.js' })
  createFromTemplate({ filePath: 'tests/Примеры/Переход на страницу авторизации.test.js' })
  createFromTemplate({ filePath: 'screenshots/.gitignore' })

  updateToolConfig(packageName, createToolConfig)
}

module.exports = {
  getCommands,
  initScript,
}
