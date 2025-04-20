import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from '@supabase/supabase-js';
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface LearningResourcesProps {
  storyId: string | null;
}

export function LearningResources({ storyId }: LearningResourcesProps) {
  const [curriculum, setCurriculum] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [storyTitle, setStoryTitle] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCurriculum() {
      if (!storyId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('stories')
          .select('title, curriculum')
          .eq('id', storyId)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setCurriculum(data.curriculum);
          setStoryTitle(data.title);
        }
      } catch (err) {
        console.error('Error fetching curriculum:', err);
        setError('Failed to load learning resources');
      } finally {
        setLoading(false);
      }
    }
    
    fetchCurriculum();
  }, [storyId]);
  
  if (!storyId) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Learning Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Select a story to view its learning resources</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Learning Resources</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Learning Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{storyTitle}: Learning Resources</CardTitle>
      </CardHeader>
      <CardContent>
        {curriculum ? (
          <div className="curriculum-content prose max-w-none">
            {/* If you have react-markdown installed: */}
            {/* <ReactMarkdown>{curriculum}</ReactMarkdown> */}
            
            {/* Otherwise, use pre-formatted text: */}
            <pre className="whitespace-pre-wrap font-sans text-sm">{curriculum}</pre>
          </div>
        ) : (
          <p className="text-muted-foreground">No curriculum available for this story. Generate one by clicking the + button on the story card.</p>
        )}
      </CardContent>
    </Card>
  );
}