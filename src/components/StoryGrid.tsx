
import { useState } from "react";
import { StoryTile } from "./StoryTile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { SAMPLE_STORIES } from "./SampleStories"; 

interface StoryGridProps {
  colorScheme?: string;
  onStorySelect: (id: string) => void;
}

export function StoryGrid({ colorScheme = "terra", onStorySelect }: StoryGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [stories] = useState(SAMPLE_STORIES);
  
  const filteredStories = stories.filter((story) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      story.title.toLowerCase().includes(searchTermLower) ||
      story.culture.toLowerCase().includes(searchTermLower) ||
      story.tags.some(tag => tag.toLowerCase().includes(searchTermLower))
    );
  });
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stories by title, culture or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="tile-grid">
        {filteredStories.map((story) => (
          <StoryTile
            key={story.id}
            id={story.id}
            title={story.title}
            excerpt={story.excerpt}
            culture={story.culture}
            tags={story.tags}
            type={story.type}
            color={colorScheme || story.color}
            onClick={onStorySelect}
          />
        ))}
        
        {filteredStories.length === 0 && (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">No stories found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
