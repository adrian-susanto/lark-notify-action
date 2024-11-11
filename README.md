# Lark(feishu) Notify - Github Action

[![Project Status: Active – The project has reached a stable, usable state and is being actively developed.](https://www.repostatus.org/badges/latest/active.svg)](https://www.repostatus.org/#active)

**Screenshot**
<img alt="action-slack-notify-rtcamp" src="https://github.com/user-attachments/assets/d7a9b77f-4d87-4630-b73a-3b65f615e46c">

## Usage

You can see the action block with all variables as below:

```yml
- name: Lark Notification
  uses: maximus-1024/lark-notify-action
  with:
    hookToken: ${{ secrets.LARK_HOOK }}
    status: ${{ job.status }}
```

## Inputs

| Variable   | Default                                | Purpose                                                                                     |
| ---------- | -------------------------------------- | ------------------------------------------------------------------------------------------- |
| hookToken  | "" （必填）                            | 创建自定义机器人时候的webhook,例如：4ac55366-c9d3-4538-a549-8078f0c64d02a                   |
| secret     | ""                                     | 创建自定义机器人时候的webhook的密钥                                                         |
| status     | success                                | job的运行状态                                                                               |
| platform   | lark                                   | 机器人的运行平台，lark,feishu,默认为lark                                                    |
| title      | 项目部署通知                           | 消息通知的标题                                                                              |
| titleColor | green                                  | 卡片消息通知的颜色，不过不传值会根据status的状态来判断status为success为绿色，其它状态为红色 |
| message    | ${context.payload.head_commit.message} | 卡片消息的通知内容                                                                          |
| buttonLink | ${context.payload.head_commit.url}     | 卡片消息的跳转链接                                                                          |
