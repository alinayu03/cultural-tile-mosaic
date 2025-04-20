import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, Send } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface LearningResourcesProps {
  storyId: string | null;
}

export function LearningResources({ storyId }: LearningResourcesProps) {
  const [curriculum, setCurriculum] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [storyTitle, setStoryTitle] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>('');

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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This is just a dummy function since we're making it non-functional
    // In a real implementation, you would process the input here
    setInputValue('');
  };

  if (!storyId) {
    return (
      <Card className="w-full h-full flex flex-col">
        <CardHeader>
          <CardTitle>Learning Resources</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-muted-foreground">Select a story to view its learning resources</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="w-full h-full flex flex-col">
        <CardHeader>
          <CardTitle>Learning Resources</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full h-full flex flex-col">
        <CardHeader>
          <CardTitle>Learning Resources</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle>{storyTitle}: Learning Resources</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto pb-4">
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
      <CardFooter className="pt-4 border-t">
        <form onSubmit={handleSubmit} className="w-full flex gap-2">
          <div className="relative flex-grow">
            <textarea
              className="w-full p-3 pr-10 border rounded-lg resize-none min-h-12 max-h-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ask about this story..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              rows={1}
              style={{ overflow: 'auto' }}
            />
          </div>
          <button 
            title="Send"
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg flex-shrink-0 flex items-center justify-center"
            disabled={!inputValue.trim()}
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </CardFooter>
    </Card>
  );
}