# Friction Log — Dev Daily (Amazon Developer Hackathon 2026)

## Entry 1: AWS Bedrock Inference Profile Confusion

**Task attempted:** Invoke Claude Haiku 4.5 via `InvokeModelCommand` in AWS SDK v3

**Steps taken:**
1. Listed available models using `aws bedrock list-foundation-models`
2. Used the returned model ID `anthropic.claude-haiku-4-5-20251001-v1:0` directly as the `modelId` parameter in `InvokeModelCommand`
3. Deployed to Vercel and called the API route

**Expected result:** Model invocation succeeds and returns a response

**Actual result:**
```
Error: Invocation of model ID anthropic.claude-haiku-4-5-20251001-v1:0 with on-demand throughput isn't supported. Retry your request with the ID or ARN of an inference profile that contains this model.
```

**Severity:** Medium — blocked the live deployment until resolved; not obvious from documentation

**Workaround used:** Ran `aws bedrock list-inference-profiles` to find the correct cross-region inference profile ID: `us.anthropic.claude-haiku-4-5-20251001-v1:0` (note the `us.` prefix). Switched to this ID and deployment worked immediately.

**Actionable suggestion:** The `ListFoundationModels` API response should include a flag (e.g. `requiresInferenceProfile: true`) for models that cannot be called with on-demand throughput. Alternatively, the runtime error message should include the correct inference profile ID rather than asking the developer to discover it separately. A cross-reference in the Bedrock console model detail page would also help.
