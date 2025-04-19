import { useState, useEffect } from "react";
import { StoryTile } from "./StoryTile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface Story {
  id: string;
  name:string;
  title: string;
  excerpt: string;
  culture: string;
  tags: string[];
  type: "audio" | "text" | "storybook";
  color: "terra" | "ocean" | "forest" | "amber" | "ruby";
}

interface StoryGridProps {
  colorScheme?: string;
  onStorySelect: (id: string) => void;
}

export function StoryGrid({ colorScheme = "terra", onStorySelect }: StoryGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStories() {
      const { data, error } = await supabase
      .from("stories")
      .select("*")
      .order("id", { ascending: true });    
      if (error) console.error("Supabase fetch error:", error);
      else setStories(data as Story[]);
      setLoading(false);
    }
    fetchStories();
  }, []);

  const filteredStories = stories.filter((story) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      story.title.toLowerCase().includes(searchTermLower) ||
      story.culture.toLowerCase().includes(searchTermLower) ||
      story.tags.some((tag) => tag.toLowerCase().includes(searchTermLower))
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
        {loading ? (
          <p className="text-muted-foreground text-center">Loading stories...</p>
        ) : filteredStories.length === 0 ? (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">No stories found matching your search.</p>
          </div>
        ) : (
          filteredStories.map((story) => (
            <div
              key={story.id}
              className="fade-in"
            >
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
          </div>
          )
          )
        )}
      </div>
    </div>
  );
}
