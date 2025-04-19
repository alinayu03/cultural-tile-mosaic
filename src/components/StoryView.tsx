
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Book, Play, Headphones, Download, Share2 } from "lucide-react";

interface StoryViewProps {
  id: string;
  onBack: () => void;
}

interface StoryData {
  id: string;
  title: string;
  excerpt: string;
  name?: string;
  culture: string;
  tags: string[];
  type: "audio" | "text" | "storybook";
  color: "terra" | "ocean" | "forest" | "amber" | "ruby";
  audio_url?: string;
  image_url?: string;
}

const bgColors = {
  terra: "bg-mosaic-terra/20",
  ocean: "bg-mosaic-ocean/20",
  forest: "bg-mosaic-forest/20",
  amber: "bg-mosaic-amber/20",
  ruby: "bg-mosaic-ruby/20"
};

const borderColors = {
  terra: "border-mosaic-terra",
  ocean: "border-mosaic-ocean",
  forest: "border-mosaic-forest",
  amber: "border-mosaic-amber",
  ruby: "border-mosaic-ruby"
};

export function StoryView({ id, onBack }: StoryViewProps) {
  const [story, setStory] = useState<StoryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStory() {
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching story:", error);
      } else {
        setStory(data as StoryData);
      }
      setLoading(false);
    }

    fetchStory();
  }, [id]);

  if (loading) {
    return <p className="text-center text-muted-foreground">Loading story...</p>;
  }

  if (!story) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>Story not found</p>
          <Button onClick={onBack} variant="link">
            Go back
          </Button>
        </CardContent>
      </Card>
    );
  }

  const bgClass = bgColors[story.color] || bgColors.terra;
  const borderClass = borderColors[story.color] || borderColors.terra;

  return (
    <Card className={`w-full fade-in border-2 ${borderClass}`}>
      <CardHeader className={`${bgClass}`}>
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="w-fit flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to stories
        </Button>
        <CardTitle className="text-2xl mt-2">{story.title}</CardTitle>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          {story.name && <span>Shared by {story.name}</span>}
          {story.name && <span>•</span>}
          <span>{story.culture} tradition</span>
        </div>
      </CardHeader>

      {story.image_url && (
        <div className="px-6 pt-4">
          <div className="w-full h-64 overflow-hidden rounded-lg">
            <img
              src={story.image_url}
              alt={story.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      <CardContent className="pt-6">
        {story.type === "audio" && (
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-4 py-4 px-4 bg-muted rounded-md">
              <Button variant="outline" size="icon" className="rounded-full">
                <Play className="h-4 w-4" />
              </Button>
              <div className="w-full h-2 bg-primary/20 rounded-full">
                <div className="w-1/3 h-full bg-primary rounded-full"></div>
              </div>
              <span className="text-xs text-muted-foreground">2:34</span>
            </div>
          </div>
        )}

        <div className="prose max-w-none whitespace-pre-line">
          {story.excerpt}
        </div>

        <Separator className="my-6" />

        <div className="flex flex-wrap gap-2">
          {story.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" /> Download
        </Button>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>

          <Button size="sm">
            {story.type === "audio" ? (
              <>
                <Headphones className="mr-2 h-4 w-4" /> Listen
              </>
            ) : (
              <>
                <Book className="mr-2 h-4 w-4" /> Create Storybook
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}