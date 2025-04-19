
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, Upload, FileText, X } from "lucide-react";

interface StoryUploadProps {
  onUploadComplete: () => void;
  onCancel: () => void;
}

export function StoryUpload({ onUploadComplete, onCancel }: StoryUploadProps) {
  const [uploadTab, setUploadTab] = useState("audio");
  const [isRecording, setIsRecording] = useState(false);
  const [storyTitle, setStoryTitle] = useState("");
  const [storyteller, setStoryteller] = useState("");
  const [culture, setCulture] = useState("");
  const [storyText, setStoryText] = useState("");
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate upload delay
    setTimeout(() => {
      setIsSubmitting(false);
      onUploadComplete();
    }, 1500);
  };

  const handleRecordToggle = () => {
    setIsRecording(!isRecording);
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
                  <Button type="button" variant="secondary" size="sm">
                    Browse files
                  </Button>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Supports audio (MP3, WAV), text (PDF, DOC) up to 50MB
                  </p>
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
                  value={storyteller}
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

            <div className="space-y-3">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                placeholder="e.g. Food, Tradition, Music, Migration"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" /> Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || (!storyText && uploadTab === "text") || !storyTitle}>
            {isSubmitting ? "Submitting..." : "Submit Story"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
