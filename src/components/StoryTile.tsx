import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Book, Headphones, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface StoryTileProps {
  id: string;
  title: string;
  excerpt: string;
  culture: string;
  tags: string[];
  type: 'audio' | 'text' | 'storybook';
  color: string;
  onClick: (id: string) => void;
}

export function StoryTile({ 
  id,
  title,
  excerpt,
  culture,
  tags,
  type,
  color = 'terra',
  onClick
}: StoryTileProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCurriculum = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    setIsGenerating(true);
    
    const requestData = {
      storyId: id,
      title,
      excerpt,
      culture,
    };
    
    try {
      console.log('Sending curriculum generation request:', requestData);
      
      const response = await fetch('/api/generate-curriculum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('Response status:', response.status);
      
      let data;
      try {
        const text = await response.text();
        console.log('Raw response length:', text.length);
        console.log('Raw response:', text);
        
        if (!text || text.trim() === '') {
          throw new Error('Empty response from server');
        }
        
        try {
          data = JSON.parse(text);
          console.log('API Response data:', data);
        } catch (parseError) {
          console.error('JSON Parse error:', parseError);
          console.error('Failed to parse text:', text);
          throw new Error('Invalid JSON response: ' + (parseError instanceof Error ? parseError.message : String(parseError)));
        }
      } catch (e) {
        console.error('Failed to process response:', e);
        throw new Error('Failed to process server response: ' + (e instanceof Error ? e.message : String(e)));
      }

      if (!response.ok) {
        console.error('API Error:', data.error);
        console.error('Error details:', data.details);
        throw new Error(data.error || 'Failed to generate curriculum');
      }

      if (!data.success || !data.curriculum) {
        console.error('Invalid response format:', data);
        throw new Error('Invalid response format from server: ' + JSON.stringify(data));
      }

      // Show success message with a preview of the curriculum
      const preview = data.curriculum.split('\n').slice(0, 2).join('\n');
      toast.success(
        <div>
          <p>{data.message || 'Curriculum generated successfully!'}</p>
          <p className="text-sm text-muted-foreground mt-1">{preview}...</p>
        </div>
      );
    } catch (error) {
      console.error('Error details:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate curriculum';
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const bgColors = {
    terra: 'bg-mosaic-terra/20 hover:bg-mosaic-terra/30',
    ocean: 'bg-mosaic-ocean/20 hover:bg-mosaic-ocean/30',
    forest: 'bg-mosaic-forest/20 hover:bg-mosaic-forest/30',
    amber: 'bg-mosaic-amber/20 hover:bg-mosaic-amber/30',
    ruby: 'bg-mosaic-ruby/20 hover:bg-mosaic-ruby/30',
  };
  
  const borderColors = {
    terra: 'border-mosaic-terra',
    ocean: 'border-mosaic-ocean',
    forest: 'border-mosaic-forest',
    amber: 'border-mosaic-amber',
    ruby: 'border-mosaic-ruby',
  };
  
  const bgClass = bgColors[color as keyof typeof bgColors] || bgColors.terra;
  const borderClass = borderColors[color as keyof typeof borderColors] || borderColors.terra;
  
  const typeIcon = () => {
    switch(type) {
      case 'audio':
        return <Headphones className="h-4 w-4" />;
      case 'storybook':
        return <Book className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };
  
  return (
    <Card 
      className={`mosaic-tile cursor-pointer border-2 ${borderClass} ${bgClass}`}
      onClick={() => onClick(id)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold">{title}</CardTitle>
          <div className="flex items-center gap-2">
            {typeIcon()}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={generateCurriculum}
              disabled={isGenerating}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{culture}</p>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm line-clamp-3">{excerpt}</p>
      </CardContent>
      
      <CardFooter>
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{tags.length - 3}
            </Badge>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
