import { useState, useEffect } from "react";
import { APIProvider, Map, Marker, InfoWindow } from "@vis.gl/react-google-maps";
import mapstyle from "./mapstyle";
import { supabase } from "@/lib/supabaseClient";
import { StoryView } from "./StoryView"; // Import StoryView component

interface StoryMapProps {
  colorScheme: "terra" | "ocean" | "forest" | "amber" | "ruby";
  onViewStory?: (storyId: string) => void; // Optional callback for parent component
}

interface Story {
  id: string;
  title: string;
  culture: string;
  latitude: number;
  longitude: number;
  tags: string[];
}

export const StoryMap = ({ colorScheme, onViewStory }: StoryMapProps) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewingStoryId, setViewingStoryId] = useState<string | null>(null);

  const colorToMarker = {
    terra: "http://maps.google.com/mapfiles/ms/icons/orange-dot.png",
    ocean: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    forest: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
    amber: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
    ruby: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
  };

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setIsLoading(true);
        
        // Replace 'stories' with your actual table name
        const { data, error } = await supabase
          .from('stories')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setStories(data as Story[]);
        }
      } catch (err) {
        console.error('Error fetching stories:', err);
        setError('Failed to load stories');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStories();
  }, []);

  const handleViewStory = (storyId: string) => {
    // If parent provided a callback, use it
    if (onViewStory) {
      onViewStory(storyId);
    } else {
      // Otherwise handle navigation internally
      setViewingStoryId(storyId);
    }
    
    // Close the info window
    setSelectedStoryId(null);
  };

  const handleBackToMap = () => {
    setViewingStoryId(null);
  };

  // If viewing a story, show the StoryView component
  if (viewingStoryId) {
    return <StoryView id={viewingStoryId} onBack={handleBackToMap} />;
  }

  if (isLoading) {
    return <div className="w-full h-[500px] flex items-center justify-center">Loading stories...</div>;
  }

  if (error) {
    return <div className="w-full h-[500px] flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div className="w-full space-y-4">
        <div className="rounded-lg overflow-hidden border">
          <Map
            style={{ height: "500px", width: "100%" }}
            defaultCenter={{ lat: 22.54992, lng: 0 }}
            defaultZoom={3}
            gestureHandling="greedy"
            disableDefaultUI={true}
            mapTypeId="roadmap"
            styles={mapstyle}
          >
            {stories.map((story) => (
              <Marker
                key={story.id}
                position={{ lat: story.latitude, lng: story.longitude }}
                icon={{
                  url: colorToMarker[colorScheme] || colorToMarker["terra"]
                }}
                onClick={() => setSelectedStoryId(story.id)}
              />
            ))}

            {selectedStoryId && (() => {
              const story = stories.find(s => s.id === selectedStoryId);
              return story ? (
                <InfoWindow
                  position={{ lat: story.latitude, lng: story.longitude }}
                  onCloseClick={() => setSelectedStoryId(null)}
                >
                  <div 
                    className="min-w-[180px] space-y-1 cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors"
                    onClick={() => handleViewStory(story.id)}
                  >
                    <h3 className="text-sm font-semibold text-foreground">{story.title}</h3>
                    <p className="text-xs text-muted-foreground">{story.culture}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {story.tags?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="bg-muted text-xs px-2 py-0.5 rounded-full text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-blue-500 mt-2 font-medium">
                      Click to view full story →
                    </p>
                  </div>
                </InfoWindow>
              ) : null;
            })()}
          </Map>
        </div>
      </div>
    </APIProvider>
  );
};