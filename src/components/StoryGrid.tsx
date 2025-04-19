
import { useState } from "react";
import { StoryTile } from "./StoryTile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

// Sample story data
const SAMPLE_STORIES = [
  {
    id: "1",
    title: "The Baobab Tree's Secret",
    excerpt: "For generations, our people have gathered around the baobab tree during important ceremonies. This tree has witnessed the history of our village for over 500 years...",
    culture: "West African",
    tags: ["Tradition", "Nature", "Wisdom"],
    type: "audio" as const,
    color: "terra"
  },
  {
    id: "2",
    title: "Grandmother's Recipe",
    excerpt: "Every Sunday morning, my grandmother would wake up before sunrise to prepare her special tamales. The recipe has been in our family for generations...",
    culture: "Mexican",
    tags: ["Food", "Family", "Heritage"],
    type: "text" as const,
    color: "amber"
  },
  {
    id: "3",
    title: "The Northern Lights Legend",
    excerpt: "The elders tell us that the dancing lights in the sky are the spirits of our ancestors. When they appear, it is a time for reflection and gratitude...",
    culture: "Inuit",
    tags: ["Nature", "Spirituality", "Ancestors"],
    type: "storybook" as const,
    color: "ocean"
  },
  {
    id: "4",
    title: "Songs of the Monsoon",
    excerpt: "When the rains come, our village celebrates with music. These songs have been passed down through generations, each with their own meaning and purpose...",
    culture: "Indian",
    tags: ["Music", "Seasons", "Celebration"],
    type: "audio" as const,
    color: "forest"
  },
  {
    id: "5",
    title: "The Weaver's Pattern",
    excerpt: "My mother taught me to weave when I was just seven years old. Each pattern in our textiles tells a story about our history and beliefs...",
    culture: "Navajo",
    tags: ["Craft", "Symbolism", "Art"],
    type: "text" as const,
    color: "ruby"
  },
  {
    id: "6",
    title: "The Journey Across the Sea",
    excerpt: "My grandfather often told me about how our family arrived on these shores. The voyage was difficult, but their hope for a better future kept them going...",
    culture: "Caribbean",
    tags: ["Migration", "Courage", "History"],
    type: "storybook" as const,
    color: "ocean"
  }
];

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
