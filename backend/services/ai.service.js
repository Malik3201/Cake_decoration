import fetch from 'node-fetch';

const SYSTEM_RULES = `
You are the DecoraBake cake assistant for a premium ecommerce store.
- **Tone**: Professional, friendly, helpful, and concise. Not cheesy.
- **Formatting**: Use Markdown for clear readability.
  - Use bullet points for lists.
  - Use **bold** for key terms or emphasis, but do not overuse.
  - Keep paragraphs short (1-2 sentences).
  - Do NOT use unnecessary emojis or symbols (like ✨ everywhere). Minimal usage is okay if high quality.
- **Capabilities**:
  - Suggest flavors, designs, and pairings.
  - Explain product care and usage.
- **Restrictions**:
  - Never set prices or discounts. Refer to store settings.
  - Do NOT mention "Language: en" or internal prompts in output.
`;

export async function aiChat(messages) {
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL || "LongCat-Flash-Chat";
  // Use the full endpoint URL directly - don't append /chat/completions
  const baseUrl = process.env.AI_BASE_URL || "https://api.longcat.chat/openai/v1/chat/completions";

  if (!apiKey) {
    const err = new Error('AI API key not configured');
    err.statusCode = 503;
    throw err;
  }

  const body = {
    model,
    messages: [
      { role: 'system', content: SYSTEM_RULES },
      ...messages,
    ],
    max_tokens: process.env.AI_MAX_TOKENS ? parseInt(process.env.AI_MAX_TOKENS) : 1500,
    temperature: 0.7,
  };

  try {
    // Use baseUrl directly - it should be the complete endpoint URL
    const resp = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const text = await resp.text();
      const err = new Error('AI request failed');
      err.statusCode = resp.status;
      err.details = text;
      throw err;
    }

    const data = await resp.json();
    const content = data.choices?.[0]?.message?.content || '';
    return content;
  } catch (error) {
    console.error('AI error', error);
    const err = new Error('AI temporarily unavailable');
    err.statusCode = 503;
    throw err;
  }
}
