import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, Upload, FileText, X, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface StoryUploadProps {
  onUploadComplete: () => void;
  onCancel: () => void;
}

export function StoryUpload({ onUploadComplete, onCancel }: StoryUploadProps) {
  const [uploadTab, setUploadTab] = useState("audio");
  const [isRecording, setIsRecording] = useState(false);
  const [storyTitle, setStoryTitle] = useState("");
  const [name, setStoryteller] = useState("");
  const [culture, setCulture] = useState("");
  const [storyText, setStoryText] = useState("");
  const [tags, setTags] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [color, setColor] = useState("terra"); // Default color
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isGeocodingInProgress, setIsGeocodingInProgress] = useState(false);

  // Convert tags string to array
  const parseTagsToArray = (tagString: string): string[] => {
    return tagString.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
  };

  // Geocode the city and country to get coordinates
  const geocodeLocation = async (cityName: string, countryName: string) => {
    if (!cityName) return;
    
    setIsGeocodingInProgress(true);
    try {
      // Using OpenStreetMap's Nominatim API for geocoding (free and doesn't require API key)
      const query = encodeURIComponent(`${cityName}${countryName ? ', ' + countryName : ''}`);
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        setLatitude(parseFloat(data[0].lat));
        setLongitude(parseFloat(data[0].lon));
      } else {
        console.warn("Location not found");
        setLatitude(null);
        setLongitude(null);
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      setLatitude(null);
      setLongitude(null);
    } finally {
      setIsGeocodingInProgress(false);
    }
  };

  // Watch for changes in city or country to update coordinates
  useEffect(() => {
    if (city) {
      // Add a small delay to avoid too many API calls while user is typing
      const timer = setTimeout(() => {
        geocodeLocation(city, country);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      // Clear coordinates if city is empty
      setLatitude(null);
      setLongitude(null);
    }
  }, [city, country]);

  // Get current location if user allows
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          
          // Reverse geocoding to get city and country from coordinates
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
            );
            const data = await response.json();
            
            if (data && data.address) {
              setCity(data.address.city || data.address.town || data.address.village || data.address.hamlet || '');
              setCountry(data.address.country || '');
            }
          } catch (error) {
            console.error("Reverse geocoding error:", error);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'audio' | 'document') => {
    const files = event.target.files;
    if (files && files.length > 0) {
      if (type === 'image') {
        setImageFile(files[0]);
      } else if (type === 'audio') {
        setAudioFile(files[0]);
      } else {
        setUploadFile(files[0]);
      }
    }
  };

  const handleRecordToggle = () => {
    setIsRecording(!isRecording);
    // Here you would implement actual audio recording functionality
    // This is just a placeholder for the UI interaction
  };

  // Upload file to Supabase Storage
  const uploadFileToStorage = async (file: File, bucket: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error(`Error uploading to ${bucket}:`, error);
        return null;
      }

      // Get public URL
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
      return urlData.publicUrl;
    } catch (error) {
      console.error(`Error uploading ${bucket} file:`, error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setUploadProgress(10);
    
    try {
      // Handle file uploads first if there are any
      let imageUrl = null;
      let audioUrl = null;
      let documentUrl = null;
      
      if (imageFile) {
        setUploadProgress(20);
        imageUrl = await uploadFileToStorage(imageFile, 'story_images');
        if (!imageUrl) {
          console.warn("Image upload failed but continuing with submission");
        }
      }
      
      if (audioFile) {
        setUploadProgress(40);
        audioUrl = await uploadFileToStorage(audioFile, 'story_audio');
        if (!audioUrl) {
          console.warn("Audio upload failed but continuing with submission");
        }
      }
      
      if (uploadFile && uploadTab === 'file') {
        setUploadProgress(60);
        documentUrl = await uploadFileToStorage(uploadFile, 'story_documents');
        if (!documentUrl) {
          console.warn("Document upload failed but continuing with submission");
        }
      }
      
      setUploadProgress(80);
      
      // Create excerpt based on content type
      let excerpt = "";
      if (uploadTab === 'text' && storyText) {
        excerpt = storyText.length > 150 ? storyText.substring(0, 147) + '...' : storyText;
      } else if (storyTitle) {
        excerpt = `A ${uploadTab} story about ${storyTitle}`;
      }
      
      // If location hasn't been geocoded yet, try one more time
      if (city && !latitude && !longitude) {
        await geocodeLocation(city, country);
      }
      
      // Prepare data for database insertion
      const storyData = {
        id: crypto.randomUUID(),
        title: storyTitle,
        culture: culture || null,
        hometown: city || null,
        tags: tags ? parseTagsToArray(tags) : [],
        type: uploadTab,
        color: color || "terra",
        latitude: latitude || null,
        longitude: longitude || null,
        name: name || null,
        image_url: imageUrl,
        audio_url: audioUrl,
        country: country || null,
        excerpt: excerpt || null
      };
      
      // Insert data into Supabase
      const { error } = await supabase
        .from('stories')
        .insert([storyData]);
      
      if (error) {
        console.error("Supabase insert error:", error);
        throw new Error(`Failed to save story: ${error.message || error}`);
      }
      
      setUploadProgress(100);
      setTimeout(() => {
        setIsSubmitting(false);
        onUploadComplete();
      }, 500);
      
    } catch (error) {
      console.error("Error submitting story:", error);
      setErrorMessage(error?.message || "Failed to upload story. Please try again.");
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto fade-in">
      <CardHeader>
        <CardTitle>Add Your Story</CardTitle>
        <CardDescription>
          Share a cultural story, tradition, or piece of knowledge to preserve it for future generations
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-6">
            <Tabs value={uploadTab} onValueChange={setUploadTab}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="audio" className="flex items-center gap-2">
                  <Mic className="w-4 h-4" /> Audio
                </TabsTrigger>
                <TabsTrigger value="text" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Text
                </TabsTrigger>
                <TabsTrigger value="file" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" /> File
                </TabsTrigger>
              </TabsList>

              <TabsContent value="audio" className="space-y-4">
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md bg-muted/50">
                  <Button
                    type="button"
                    className={`${isRecording ? "bg-red-500 hover:bg-red-600" : ""} rounded-full w-16 h-16 flex items-center justify-center mb-4`}
                    onClick={handleRecordToggle}
                  >
                    <Mic className={`w-6 h-6 ${isRecording ? "animate-pulse" : ""}`} />
                  </Button>
                  <p className="text-sm text-center text-muted-foreground">
                    {isRecording 
                      ? "Recording... Click again to stop." 
                      : "Click to start recording your story"}
                  </p>
                  <div className="mt-4 w-full">
                    <Label htmlFor="audio-upload" className="block mb-2 text-sm">Or upload audio file</Label>
                    <Input
                      id="audio-upload"
                      type="file"
                      accept="audio/*"
                      onChange={(e) => handleFileChange(e, 'audio')}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="text" className="space-y-4">
                <div className="space-y-3">
                  <Label htmlFor="story-text">Story Text</Label>
                  <Textarea
                    id="story-text"
                    placeholder="Type or paste your story here..."
                    rows={8}
                    value={storyText}
                    onChange={(e) => setStoryText(e.target.value)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="file" className="space-y-4">
                <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-md bg-muted/50">
                  <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                  <p className="mb-2 text-sm font-medium">Drag and drop a file or</p>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.mp3,.wav"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 'document')}
                  />
                  <Button 
                    type="button" 
                    variant="secondary" 
                    size="sm"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    Browse files
                  </Button>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Supports audio (MP3, WAV), text (PDF, DOC) up to 50MB
                  </p>
                  {uploadFile && (
                    <p className="mt-2 text-sm font-medium text-green-600">
                      Selected: {uploadFile.name}
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-3">
              <Label htmlFor="story-title">Story Title</Label>
              <Input
                id="story-title"
                placeholder="Give your story a title"
                value={storyTitle}
                onChange={(e) => setStoryTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="storyteller">Storyteller's Name</Label>
                <Input
                  id="storyteller"
                  placeholder="Who shared this story"
                  value={name}
                  onChange={(e) => setStoryteller(e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="culture">Cultural Origin</Label>
                <Input
                  id="culture"
                  placeholder="e.g. Yoruba, Navajo, Irish"
                  value={culture}
                  onChange={(e) => setCulture(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="city">City/Town</Label>
                <Input
                  id="city"
                  placeholder="City or town"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Location</Label>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={getCurrentLocation}
                  className="text-xs flex items-center"
                >
                  <MapPin className="w-3 h-3 mr-1" /> Use current location
                </Button>
              </div>
              
              {/* Location status feedback */}
              <div className="text-sm text-muted-foreground">
                {isGeocodingInProgress && "Finding location coordinates..."}
                {!isGeocodingInProgress && city && latitude && longitude && 
                  `Location found: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`}
                {!isGeocodingInProgress && city && !latitude && !longitude && 
                  "Location not found. Please check city name."}
                {!city && "Enter a city name to geocode location automatically."}
              </div>
              
              {/* Hidden inputs to store lat/long but not visible to user */}
              <input type="hidden" value={latitude || ''} />
              <input type="hidden" value={longitude || ''} />
            </div>

            <div className="space-y-3">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                placeholder="e.g. Food, Tradition, Music, Migration"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="image">Story Image (optional)</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'image')}
              />
            </div>
          </div>

          {errorMessage && (
            <div className="mt-4 p-3 text-sm bg-red-100 text-red-800 rounded-md">
              {errorMessage}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" /> Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || (!storyText && uploadTab === "text" && !uploadFile && !audioFile) || !storyTitle}
          >
            {isSubmitting ? `Uploading... ${uploadProgress}%` : "Submit Story"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}