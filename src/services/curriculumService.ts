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
    const prompt = `You are an expert curriculum developer specializing in cultural education. Your task is to create a comprehensive educational curriculum about a specific story from a given culture. The curriculum will be used by educators to teach students about the historical and cultural significance of the story.

Here are the details of the story you'll be working with:

Story Content: <story_content>${storyContent}</story_content>

Story Title: <story_title>${storyTitle}</story_title>

Story Region: <story_region>${culture}</story_region>

Before creating the curriculum, please conduct thorough research on the story and its cultural context. Conduct your analysis inside <story_analysis> tags, following these steps:

1. Summarize the story in 2-3 sentences.
2. Identify and list key historical events or periods relevant to the story.
3. Note any cultural practices, beliefs, or values represented in the story.
4. List the main themes and lessons present in the story.
5. Brainstorm at least 8 potential discussion questions.
6. Draft at least 6 possible learning objectives.

This will help ensure a well-informed and high-quality curriculum.

Your curriculum should include the following components:

1. Historical context
2. Cultural significance
3. Key themes and values
4. Discussion questions
5. Learning objectives
6. Relevant information / links

When creating the curriculum, please adhere to these guidelines:
- Provide detailed and comprehensive information for each section.
- Ensure all content is accurate and culturally sensitive.
- If you're uncertain about any aspect, state "I don't know" rather than speculating.
- Use Claude Search to find additional relevant links and information for section 6.
- Format the curriculum clearly and structurally for easy use by educators.

Here's an example of how your output should be structured (note that this is a generic example and your actual content should be much more detailed):

<example_output>
Curriculum for [Story Title]

1. Historical Context:
   [Detailed explanation of the historical background]

2. Cultural Significance:
   [In-depth analysis of the story's importance in its culture]

3. Key Themes and Values:
   - Theme 1: [Explanation]
   - Theme 2: [Explanation]
   - Value 1: [Explanation]
   - Value 2: [Explanation]

4. Discussion Questions:
   1. [Question 1]
   2. [Question 2]
   3. [Question 3]

5. Learning Objectives:
   By the end of this lesson, students will be able to:
   - [Objective 1]
   - [Objective 2]
   - [Objective 3]

6. Relevant Information / Links:
   - [Link 1]: [Brief description]
   - [Link 2]: [Brief description]
   - [Link 3]: [Brief description]
</example_output>

Please begin by conducting your research and analysis in <story_analysis> tags. Once you've gathered sufficient information, proceed to create the curriculum following the structure provided. Remember to only include information you're confident about, and don't hesitate to indicate if there are aspects you're unsure of.`;

    const message = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 3000,
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