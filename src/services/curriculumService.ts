import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true
});

export class CurriculumGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CurriculumGenerationError';
  }
}

export async function generateCurriculum(
  storyTitle: string,
  storyContent: string,
  culture: string
): Promise<string> {
  if (!import.meta.env.VITE_ANTHROPIC_API_KEY) {
    throw new CurriculumGenerationError('Anthropic API key is not configured');
  }

  try {
    const prompt = `Create an educational curriculum about the history and cultural significance of the following story from ${culture} culture. The curriculum should include:
1. Historical context
2. Cultural significance
3. Key themes and values
4. Discussion questions
5. Learning objectives

Story Title: ${storyTitle}
Story Content: ${storyContent}

Please format the response in a clear, structured way that would be useful for educators.`;

    const message = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    if (!message.content[0]?.type || message.content[0].type !== 'text') {
      throw new CurriculumGenerationError('No curriculum content generated');
    }

    return message.content[0].text;
  } catch (error) {
    console.error('Error generating curriculum:', error);
    throw new CurriculumGenerationError(
      error instanceof Error ? error.message : 'Failed to generate curriculum'
    );
  }
} 