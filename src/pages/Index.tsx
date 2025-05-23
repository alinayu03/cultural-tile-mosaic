import { useState } from "react";
import { Onboarding } from "@/components/Onboarding";
import { StoryGrid } from "@/components/StoryGrid";
import { StoryUpload } from "@/components/StoryUpload";
import { StoryView } from "@/components/StoryView";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Upload } from "lucide-react";
import { StoryMap } from "@/components/StoryMap";
import { LearningResources } from "@/components/LearningResources";
import { CurriculumPopup } from "@/components/CurriculumPopup";

type UserType = 'student' | 'teacher' | 'community' | 'contributor';
type ColorScheme = 'terra' | 'ocean' | 'forest' | 'amber' | 'ruby';
type AppView = 'grid' | 'upload' | 'story';

const Index = () => {
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);
  const [userData, setUserData] = useState<{
    userType: UserType;
    colorScheme: ColorScheme;
    language: string;
  }>({
    userType: 'student',
    colorScheme: 'terra',
    language: 'english'
  });
  
  const [currentView, setCurrentView] = useState<AppView>('grid');
  const [selectedStoryId, setSelectedStoryId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("explore");
  const [showCurriculumPopup, setShowCurriculumPopup] = useState<boolean>(false);
  const [curriculumStoryId, setCurriculumStoryId] = useState<string>("");
  
  const handleOnboardingComplete = (userData: {
    userType: UserType;
    colorScheme: ColorScheme;
    language: string;
  }) => {
    setUserData(userData);
    setIsOnboarded(true);
  };
  
  const handleStorySelect = (id: string) => {
    setSelectedStoryId(id);
    setCurrentView('story');
  };
  
  const handleBackToGrid = () => {
    setCurrentView('grid');
  };
  
  const handleCurriculumGenerated = (storyId: string) => {
    setCurriculumStoryId(storyId);
    setShowCurriculumPopup(true);
  };
  
  const handleCloseCurriculumPopup = () => {
    setShowCurriculumPopup(false);
    // Optionally navigate to the learning tab
    setActiveTab("learning");
    setSelectedStoryId(curriculumStoryId);
  };
  
  const getBackgroundPattern = () => {
    switch(userData.colorScheme) {
      case 'terra':
        return 'bg-mosaic-terra/5';
      case 'ocean':
        return 'bg-mosaic-ocean/5';
      case 'forest':
        return 'bg-mosaic-forest/5';
      case 'amber':
        return 'bg-mosaic-amber/5';
      case 'ruby':
        return 'bg-mosaic-ruby/5';
      default:
        return 'bg-mosaic-terra/5';
    }
  };

  if (!isOnboarded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background mosaic-pattern">
        <div className="w-full max-w-md p-4">
          <Onboarding onComplete={handleOnboardingComplete} />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${getBackgroundPattern()} mosaic-pattern`}>
      {showCurriculumPopup && (
        <CurriculumPopup 
          storyId={curriculumStoryId} 
          onClose={handleCloseCurriculumPopup} 
        />
      )}
      
      <div className="container mx-auto p-4 md:p-6">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Mosaic</h1>
            <p className="text-muted-foreground">Where every story is a tile in our shared history</p>
          </div>
          
          {currentView === 'grid' && (
            <Button onClick={() => setCurrentView('upload')} className="flex items-center gap-2">
              <Upload className="w-4 h-4" /> Add Your Story
            </Button>
          )}
        </header>
        
        {currentView === 'grid' && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="explore">Explore Stories</TabsTrigger>
              <TabsTrigger value="map">Story Map</TabsTrigger>
              <TabsTrigger value="learning">Learning Resources</TabsTrigger>
            </TabsList>
            
            <TabsContent value="explore" className="space-y-4">
              <StoryGrid
                colorScheme={userData.colorScheme}
                onStorySelect={handleStorySelect}
                onCurriculumGenerated={handleCurriculumGenerated}
              />
            </TabsContent>
            
            <TabsContent value="map">
              <StoryMap colorScheme={userData.colorScheme} />
            </TabsContent>

            <TabsContent value="learning">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-medium">Learning Resources</h2>
                  <div className="text-sm text-muted-foreground">
                    Generate curriculum by clicking the + button on any story card
                  </div>
                </div>
                
                {selectedStoryId ? (
                  <LearningResources storyId={selectedStoryId} />
                ) : (
                  <div className="min-h-[400px] flex items-center justify-center border rounded-lg bg-white/50 p-6">
                    <div className="text-center space-y-4">
                      <h3 className="text-lg font-medium">No Story Selected</h3>
                      <p className="text-muted-foreground">
                        Select a story or generate a curriculum to view learning resources
                      </p>
                      <Button 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => setActiveTab("explore")}
                      >
                        <Plus className="w-4 h-4" /> Find a Story
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
        
        {currentView === 'upload' && (
          <StoryUpload
            onUploadComplete={handleBackToGrid}
            onCancel={handleBackToGrid}
          />
        )}
        
        {currentView === 'story' && (
          <StoryView
            id={selectedStoryId}
            onBack={handleBackToGrid}
          />
        )}
      </div>
    </div>
  );
};

export default Index;