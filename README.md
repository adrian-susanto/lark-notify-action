# Lark/ Feishu Notify - Github Action

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
| hookToken  | "" （required）                         | Webhook URL to Lark groups, but only need the unique value, for example: 4ac55366-c9d3-4538-a549-8078f0c64d02a |
| secret     | ""                                     | The key for the Webhook URL (if enabled) |
| status     | success                                | Running status of the job |
| platform   | lark                                   | Platform that you're using，acceptable value is lark or feishu. |
| title      | ${github.repository}                   | Title of message notification |
| titleColor | green                                  | Color of card message notification, but if no value is passed, it will be set according to the status of status. If the status is success, it will be green, and other statuses will be red |
| message    | ${context.payload.head_commit.message} | Notification content of card message |
| buttonLink | ${context.payload.head_commit.url}     | Destionation of buttonLink in the card message |
