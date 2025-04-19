
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Book, Play, Headphones, Download, Share2 } from "lucide-react";

interface StoryViewProps {
  id: string;
  onBack: () => void;
}

// Define the story interface
interface StoryData {
  title: string;
  content: string;
  storyteller: string;
  culture: string;
  tags: string[];
  type: string;
  color: string;
  audioUrl?: string;
  imageUrl?: string;
}

// This is sample data - in a real app this would come from a database or API
const SAMPLE_STORIES: Record<string, StoryData> = {
  "1": {
    title: "The Baobab Tree's Secret",
    content: `For generations, our people have gathered around the baobab tree during important ceremonies. This tree has witnessed the history of our village for over 500 years.

The elders say that the first baobab was planted by our ancestors who came from the north seeking water. When they found this valley with its stream, they planted the seed they had carried with them all that way.

As a child, my grandmother would take me to sit under the great baobab. "Listen," she would say, "if you are very quiet, you can hear the tree whisper the stories of our people."

I learned that each ring inside the trunk recorded a year of drought or plenty. The tree remembers what people forget. It holds our history in its body just as we hold our stories in our hearts.

Now, as an elder myself, I bring the children to the baobab. I tell them to press their ears against its massive trunk and listen for the whispers of their ancestors. The tree connects us to those who came before and those who will follow.`,
    storyteller: "Aissatou Diallo",
    culture: "West African",
    tags: ["Tradition", "Nature", "Wisdom", "Ancestors", "Community"],
    type: "audio",
    color: "terra",
    audioUrl: "#",
    imageUrl: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=772&auto=format&fit=crop"
  },
  "2": {
    title: "Grandmother's Recipe",
    content: `Every Sunday morning, my grandmother would wake up before sunrise to prepare her special tamales. The recipe has been in our family for generations.

"You must always soak the corn husks the night before," she would tell me. "And when you mix the masa, you must do it with love or the tamales will not taste right."

I would watch her hands, wrinkled with age but still so strong, as they expertly spread the masa on the corn husks. She would tell me stories of her childhood in the small village where she grew up, where making tamales was a community event.

"Your great-grandmother could make two hundred tamales in a day," she would say with pride. "And each one perfect."

The secret ingredient, she always said, wasn't in the spices or the preparation. It was in the stories told while making them, the laughter shared, and the love passed from generation to generation.

Now I make tamales with my own children, telling them about their great-grandmother as we work. The recipe lives on, along with the stories and traditions that make it special.`,
    storyteller: "Elena Rodriguez",
    culture: "Mexican",
    tags: ["Food", "Family", "Heritage", "Tradition"],
    type: "text",
    color: "amber"
  },
  // Additional stories would be listed here
};

export function StoryView({ id, onBack }: StoryViewProps) {
  const story = SAMPLE_STORIES[id as keyof typeof SAMPLE_STORIES];
  
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

  const bgColors = {
    terra: 'bg-mosaic-terra/20',
    ocean: 'bg-mosaic-ocean/20',
    forest: 'bg-mosaic-forest/20',
    amber: 'bg-mosaic-amber/20',
    ruby: 'bg-mosaic-ruby/20',
  };
  
  const borderColors = {
    terra: 'border-mosaic-terra',
    ocean: 'border-mosaic-ocean',
    forest: 'border-mosaic-forest',
    amber: 'border-mosaic-amber',
    ruby: 'border-mosaic-ruby',
  };
  
  const bgClass = bgColors[story.color as keyof typeof bgColors] || bgColors.terra;
  const borderClass = borderColors[story.color as keyof typeof borderColors] || borderColors.terra;

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
          <span>Shared by {story.storyteller}</span>
          <span>•</span>
          <span>{story.culture} tradition</span>
        </div>
      </CardHeader>
      
      {story.imageUrl && (
        <div className="px-6 pt-4">
          <div className="w-full h-64 overflow-hidden rounded-lg">
            <img 
              src={story.imageUrl} 
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
        
        <div className="prose max-w-none">
          {story.content.split('\n\n').map((paragraph, i) => (
            <p key={i} className="mb-4">{paragraph}</p>
          ))}
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
