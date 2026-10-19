import { NextRequest, NextResponse } from 'next/server';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

export async function POST(request: NextRequest) {
  const { githubData, query, conversationHistory } = await request.json();

  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION || 'us-east-1';
  const sessionToken = process.env.AWS_SESSION_TOKEN;
  const modelId = process.env.BEDROCK_MODEL_ID || 'us.anthropic.claude-3-5-haiku-20241022-v1:0';

  if (!accessKeyId || !secretAccessKey) {
    return NextResponse.json(
      { error: 'AWS credentials not configured. Add them to .env.local' },
      { status: 503 }
    );
  }

  const client = new BedrockRuntimeClient({
    region,
    credentials: { accessKeyId, secretAccessKey, sessionToken },
  });

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const system = `You are Dev Daily, a friendly developer assistant that simulates an Alexa+ experience.
You give developers concise, helpful briefings about their GitHub activity.
Keep responses conversational and punchy — like a smart voice assistant. Avoid markdown formatting.
Today is ${today}.`;

  const dataContext = githubData
    ? `GitHub data for ${githubData.username}:
- Open PRs: ${githubData.openPRs.length}${githubData.openPRs.length ? ' — ' + githubData.openPRs.slice(0, 3).map((p: any) => `"${p.title}" (${p.repo})`).join(', ') : ''}
- Open Issues assigned: ${githubData.openIssues.length}
- This week: ${githubData.weeklyStats.commits} commits, ${githubData.weeklyStats.prsOpened} PRs opened, ${githubData.weeklyStats.issuesClosed} issues closed
- Active repos: ${githubData.weeklyStats.repos.join(', ') || 'none'}
- Recent commits: ${githubData.recentCommits.slice(0, 3).map((c: any) => `"${c.message}" in ${c.repo}`).join('; ')}

`
    : '';

  const messages = [
    ...(conversationHistory || []),
    { role: 'user', content: dataContext + query },
  ];

  try {
    const command = new InvokeModelCommand({
      modelId,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 512,
        system,
        messages,
      }),
    });

    const res = await client.send(command);
    const body = JSON.parse(new TextDecoder().decode(res.body));
    return NextResponse.json({ response: body.content[0].text });
  } catch (error: any) {
    console.error('Bedrock error:', error);
    return NextResponse.json({ error: error.message || 'Bedrock request failed' }, { status: 500 });
  }
}
