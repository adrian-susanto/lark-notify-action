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

    const bodyString = {
      timestamp,
      sign,
      msg_type: 'interactive',
      card: {
        config: {
          wide_screen_mode: true
        },
        header: {
          template: core.getInput('title_color'),
          title: {
            tag: 'plain_text',
            content: core.getInput('title')
          }
        },
        elements: [
          {
            tag: 'markdown',
            content: `${core.getInput('message') || ''} <at id=all></at>`
          },
          {
            tag: 'div',
            fields: [
              {
                is_short: true,
                text: {
                  tag: 'lark_md',
                  content: '**Ref：**\n报事报修'
                }
              },
              {
                is_short: true,
                text: {
                  tag: 'lark_md',
                  content: '**Event：**\n客服工单'
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
                  content: '**Author:**\naaaa'
                }
              },
              {
                is_short: true,
                text: {
                  tag: 'lark_md',
                  content: '**Time：**\n2024/1/16'
                }
              }
            ]
          },
          {
            tag: 'div',
            text: {
              content: '这是一段普通文本😄',
              tag: 'lark_md'
            }
          },
          {
            tag: 'action',
            actions: [
              {
                tag: 'button',
                text: {
                  tag: 'plain_text',
                  content: '查看详情'
                },
                type: 'primary',
                multi_url: {
                  url: 'https://open.larksuite.com/document',
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

    const resp = await axios.post(url, bodyString)

    core.debug(`resp: ${JSON.stringify(resp)}`)

    if (resp.errcode > 0) {
      core.info(`✅ [DONE] ${resp.errmsg}`)
    } else {
      core.setFailed(`❌ [FAILED] ${resp.errmsg}`)
    }
  } catch (error) {
    core.notice(`error ${error.message}`)
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
