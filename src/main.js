const core = require('@actions/core')
const github = require('@actions/github')
const axios = require('axios')

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
  try {
    const hookToken = core.getInput('hookToken', { required: true })
    const secret = core.getInput('secret')
    const platform = core.getInput('platform') || 'lark'

    core.debug(`hookToken: ${hookToken}`)
    core.debug(`secret: ${secret}`)
    core.debug(`platform: ${platform}`)
    core.debug(`github.context: ${JSON.stringify(github.context)}`)

    let url = ''
    if (platform === 'feishu') {
      url = 'https://open.feishu.cn/open-apis/bot/v2/hook/'
    } else {
      url = 'https://open.larksuite.com/open-apis/bot/v2/hook/'
    }
    url = `${url}${hookToken}`
    core.debug(`url: ${url}`)
    const timestamp = Date.now()
    let sign = '' // 初始化 sign 变量
    // 签名
    if (secret.length > 0) {
      sign = genSign(timestamp, secret)
      core.debug(`sign ${sign}`)
    }
    const context = github.context
    const env = process.env

    const success = core.getInput('status') === 'success'

    const requestPayload = {
      timestamp,
      sign,
      msg_type: 'interactive',
      card: {
        config: {
          wide_screen_mode: true
        },
        header: {
          template: core.getInput('titleColor') || success ? 'green' : 'red',
          title: {
            tag: 'plain_text',
            content: `${success ? '✅ [SUCCESS]' : '❌ [FAILED]'} ${core.getInput('title')}`
          }
        },
        elements: [
          {
            tag: 'markdown',
            content: `${core.getInput('message') || context.payload.head_commit.message}\n <at id=xxx></at>`
          },
          {
            tag: 'div',
            fields: [
              {
                is_short: true,
                text: {
                  tag: 'lark_md',
                  content: `**Ref：**\n${env.GITHUB_REPOSITORY}/${context.payload.ref}`
                }
              },
              {
                is_short: true,
                text: {
                  tag: 'lark_md',
                  content: `**Event：**\n${context.eventName}`
                }
              }
            ]
          },
          {
            tag: 'div',
            fields: [
              {
                is_short: true,
                text: {
                  tag: 'lark_md',
                  content: `**Author:**\n${context.payload.head_commit.author.name}`
                }
              },
              {
                is_short: true,
                text: {
                  tag: 'lark_md',
                  content: `**Time：**\n${context.payload.head_commit.timestamp}`
                }
              }
            ]
          },
          {
            tag: 'action',
            actions: [
              {
                tag: 'button',
                text: {
                  tag: 'plain_text',
                  content: 'ClickHere'
                },
                type: 'primary',
                multi_url: {
                  url:
                    core.getInput('buttonLink') ||
                    context.payload.head_commit.url,
                  android_url: '',
                  ios_url: '',
                  pc_url: ''
                }
              }
            ]
          }
        ]
      }
    }

    const resp = await axios.post(url, requestPayload)

    core.debug(`resp: ${JSON.stringify(resp.data)}`)

    if (resp.data.code > 0) {
      core.setFailed(`❌ [FAILED] ${resp.data.msg}`)
    } else {
      core.info(`✅ [DONE] ${resp.data.msg}`)
    }
  } catch (error) {
    core.notice(`error ${error.msg}`)
    // Fail the workflow run if an error occurs
    core.setFailed(error.message)
  }
}
function genSign(timestamp, secret) {
  const stringToSign = `${timestamp}\n${secret}`

  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(stringToSign)

  return hmac.digest('base64')
}

module.exports = {
  run
}
