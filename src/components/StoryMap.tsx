import { useState } from "react";
import { APIProvider, Map, Marker, InfoWindow } from "@vis.gl/react-google-maps";
import mapstyle from "./mapstyle";
import { SAMPLE_STORIES } from "./SampleStories";

interface StoryMapProps {
  colorScheme: "terra" | "ocean" | "forest" | "amber" | "ruby";
}


export const StoryMap = ({ colorScheme }: StoryMapProps) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);

  const colorToMarker = {
    terra: "http://maps.google.com/mapfiles/ms/icons/orange-dot.png",
    ocean: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    forest: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
    amber: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
    ruby: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
  };

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
            {SAMPLE_STORIES.map((story) => (
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
              const story = SAMPLE_STORIES.find(s => s.id === selectedStoryId);
              return story ? (
                <InfoWindow
                  position={{ lat: story.latitude, lng: story.longitude }}
                  onCloseClick={() => setSelectedStoryId(null)}
                >
                  <div className="min-w-[180px] space-y-1">
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
