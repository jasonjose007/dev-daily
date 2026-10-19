# Dev Daily — Alexa+ Developer Assistant

A simulated Alexa+ experience that gives developers a daily briefing of their GitHub activity. Ask it about open PRs, issues, weekly contributions, and more — via voice or text.

Built for the **Amazon Developer Hackathon** — Alexa+ track (simulated experience).

## What it does

- **Morning briefing** — daily summary of your GitHub activity, spoken aloud
- **Open PR tracker** — instantly know what needs your attention
- **Weekly stats** — commits, PRs opened, issues closed
- **Voice input/output** — powered by Web Speech API (Chrome)
- **Conversational AI** — multi-turn context powered by AWS Bedrock

## Tech Stack

- **Next.js 16** + TypeScript + Tailwind CSS
- **GitHub REST API** — live PR, issue, and event data
- **AWS Bedrock** (Claude 3.5 Haiku) — natural language briefings
- **Web Speech API** — voice in/out

## Quick Start

```bash
# 1. Clone and install
git clone https://github.com/jasonjose007/dev-daily
cd dev-daily
npm install

# 2. Add AWS credentials
cp .env.local.example .env.local
# Edit .env.local with your AWS keys

# 3. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), enter your GitHub username, and say "Good morning briefing."

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `AWS_ACCESS_KEY_ID` | Yes | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | Yes | AWS secret key |
| `AWS_SESSION_TOKEN` | No | For temporary credentials |
| `AWS_REGION` | No | Default: `us-east-1` |
| `BEDROCK_MODEL_ID` | No | Default: `us.anthropic.claude-3-5-haiku-20241022-v1:0` |

## License

MIT
