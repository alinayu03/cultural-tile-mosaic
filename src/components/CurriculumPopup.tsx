import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface CurriculumPopupProps {
  storyId: string;
  onClose: () => void;
}

export function CurriculumPopup({ storyId, onClose }: CurriculumPopupProps) {
  const [loading, setLoading] = useState(true);
  const [story, setStory] = useState<{
    id: string;
    title: string;
    excerpt: string;
    culture: string;
    tags: string[];
    curriculum: string;
    color?: string;
  } | null>(null);

  useEffect(() => {
    const fetchStory = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('stories')
          .select('id, title, excerpt, culture, tags, curriculum, color')
          .eq('id', storyId)
          .single();

        if (error) throw error;
        setStory(data);
      } catch (error) {
        console.error('Error fetching story:', error);
      } finally {
        setLoading(false);
      }
    };

    if (storyId) fetchStory();
  }, [storyId]);

  const borderColors = {
    terra: 'border-mosaic-terra',
    ocean: 'border-mosaic-ocean',
    forest: 'border-mosaic-forest',
    amber: 'border-mosaic-amber',
    ruby: 'border-mosaic-ruby',
  };

  const borderClass = story?.color 
    ? borderColors[story.color as keyof typeof borderColors] 
    : borderColors.terra;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <CardHeader className="pb-2">
            <div className="animate-pulse h-6 bg-gray-200 rounded w-1/3"></div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!story) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className={`w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border-2 ${borderClass}`}>
        <CardHeader className="pb-2 flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-xl font-bold">{story.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{story.culture}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-auto">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Story Overview</h3>
            <p className="text-sm">{story.excerpt}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Generated Curriculum</h3>
            <div className="prose max-w-none">
              {story.curriculum.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-3">{paragraph}</p>
              ))}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="border-t pt-3">
          <div className="flex flex-wrap gap-1">
            {story.tags?.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}