export async function POST(req) {
  console.log('Received request:', req);  // Log the incoming request

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('API Key is missing');
    return new NextResponse("API Key not found", { status: 500 });
  }
  const configuration = new Configuration({
    apiKey: apiKey,
  });
  const openai = new OpenAIApi(configuration);

  const data = await req.json();
  console.log('Parsed data:', data);  // Log the parsed data

  const systemPrompt = 'Please assist the user efficiently with clear and concise answers to their queries. Be helpful, respectful, and patient.';  // your system prompt here
  const messages = [{role: 'system', content: systemPrompt}, ...data.messages];
  console.log('Messages to send:', messages);  // Log the messages being sent to OpenAI

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: messages,
    });
    console.log('API Response:', completion);  // Log the API response

    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        completion.choices.forEach(choice => {
          const content = choice.message.content;
          const text = encoder.encode(content + '\n');
          controller.enqueue(text);
        });
        controller.close();
      }
    });

    return new NextResponse(stream);
  } catch (error) {
    console.error('Failed to fetch the AI response:', error);
    return new NextResponse("Error processing your request: " + error.message, { status: 500 });
  }
}
