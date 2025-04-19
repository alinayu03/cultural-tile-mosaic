
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Book, Headphones } from "lucide-react";

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
          {typeIcon()}
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
