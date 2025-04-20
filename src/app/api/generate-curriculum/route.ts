import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

// Add error handling for missing environment variables
if (!process.env.ANTHROPIC_API_KEY) {
  console.error('ANTHROPIC_API_KEY is not set');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Supabase environment variables are not set');
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  console.log('API route hit: /api/generate-curriculum');
  
  try {
    console.log('Received curriculum generation request');
    
    let body;
    try {
      body = await request.json();
      console.log('Request body:', body);
    } catch (e) {
      console.error('Failed to parse request body:', e);
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }
    
    const { storyId, title, excerpt, culture } = body;
    console.log('Extracted data:', { storyId, title, excerpt, culture });

    if (!storyId || !title || !excerpt || !culture) {
      console.error('Missing required fields:', { storyId, title, excerpt, culture });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('Missing ANTHROPIC_API_KEY');
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      );
    }

    // Generate curriculum using Claude with updated model
    console.log('Calling Anthropic API...');
    const message = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 1000,
      system: "You are a helpful assistant that creates educational curricula. Create a well-structured curriculum with clear sections.",
      messages: [{
        role: 'user',
        content: `Generate an educational curriculum for the following story:
Title: ${title}
Culture: ${culture}
Excerpt: ${excerpt}

Please create a structured curriculum that includes these sections:
1. Learning Objectives
2. Key Concepts
3. Discussion Questions
4. Activities
5. Additional Resources

Format the response as a clear, well-structured text document with headings and bullet points.`
      }]
    });

    console.log('Anthropic API Response:', JSON.stringify(message, null, 2));
    console.log('Message content type:', typeof message.content);
    console.log('Message content length:', message.content ? message.content.length : 0);

    // Extract and process the curriculum
    let curriculum = '';
    
    try {
      // Get the content from the first message's content
      if (!message.content || message.content.length === 0) {
        console.error('Empty content array in Anthropic response');
        return NextResponse.json(
          { error: 'Empty response from Anthropic API', details: 'No content in response' },
          { status: 500 }
        );
      }
      
      const firstContent = message.content[0];
      console.log('First content item:', JSON.stringify(firstContent, null, 2));
      
      if (firstContent && 'text' in firstContent) {
        curriculum = firstContent.text.trim();
        console.log('Extracted curriculum:', curriculum);
      } else {
        console.error('Unexpected API response structure:', message);
        return NextResponse.json(
          { error: 'Failed to parse API response', details: 'Invalid response structure' },
          { status: 500 }
        );
      }
      
      if (!curriculum) {
        console.error('No curriculum generated');
        return NextResponse.json(
          { error: 'Failed to generate curriculum content', details: 'Empty curriculum' },
          { status: 500 }
        );
      }

      // Update the story in the database
      const { error } = await supabase
        .from('stories')
        .update({ curriculum })
        .eq('id', storyId);

      if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json(
          { 
            error: 'Database update failed',
            details: error.message
          },
          { status: 500 }
        );
      }

      const responseData = { 
        success: true, 
        curriculum,
        message: 'Curriculum generated successfully'
      };
      
      console.log('Sending response:', JSON.stringify(responseData, null, 2));
      
      try {
        return NextResponse.json(responseData);
      } catch (jsonError) {
        console.error('Error creating JSON response:', jsonError);
        // Fallback to a simpler response if JSON serialization fails
        return new NextResponse(
          JSON.stringify({ 
            success: true, 
            curriculum: curriculum.substring(0, 100) + '...',
            message: 'Curriculum generated (truncated)'
          }),
          { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
    } catch (error) {
      console.error('Error processing curriculum:', error);
      return NextResponse.json(
        { 
          error: 'Failed to process curriculum',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error generating curriculum:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate curriculum',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}