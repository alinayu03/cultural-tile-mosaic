
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type UserType = 'student' | 'teacher' | 'community' | 'contributor';
type ColorScheme = 'terra' | 'ocean' | 'forest' | 'amber' | 'ruby';

interface OnboardingProps {
  onComplete: (userData: {
    userType: UserType;
    colorScheme: ColorScheme;
    language: string;
  }) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState<number>(1);
  const [userType, setUserType] = useState<UserType>('student');
  const [colorScheme, setColorScheme] = useState<ColorScheme>('terra');
  const [language, setLanguage] = useState<string>('english');
  
  const handleContinue = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete({
        userType,
        colorScheme,
        language
      });
    }
  };

  const renderIdentityStep = () => (
    <div className="space-y-4 fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Welcome to Mosaic</CardTitle>
        <CardDescription>Where every story is a tile in our shared history.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">I am a...</h3>
          <RadioGroup 
            value={userType} 
            onValueChange={(value) => setUserType(value as UserType)}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="student" id="student" />
              <Label htmlFor="student">Student</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="teacher" id="teacher" />
              <Label htmlFor="teacher">Teacher</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="community" id="community" />
              <Label htmlFor="community">Community Member</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="contributor" id="contributor" />
              <Label htmlFor="contributor">Contributor</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </div>
  );

  const renderColorStep = () => (
    <div className="space-y-4 fade-in">
      <CardHeader>
        <CardTitle>Choose Your Colors</CardTitle>
        <CardDescription>Select colors that represent your culture or mood</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button 
            variant="outline" 
            className={`w-16 h-16 rounded-full bg-mosaic-terra ${colorScheme === 'terra' ? 'ring-2 ring-black' : ''}`}
            onClick={() => setColorScheme('terra')}
            aria-label="Terra color scheme"
          />
          <Button 
            variant="outline" 
            className={`w-16 h-16 rounded-full bg-mosaic-ocean ${colorScheme === 'ocean' ? 'ring-2 ring-black' : ''}`}
            onClick={() => setColorScheme('ocean')}
            aria-label="Ocean color scheme"
          />
          <Button 
            variant="outline" 
            className={`w-16 h-16 rounded-full bg-mosaic-forest ${colorScheme === 'forest' ? 'ring-2 ring-black' : ''}`}
            onClick={() => setColorScheme('forest')}
            aria-label="Forest color scheme"
          />
          <Button 
            variant="outline" 
            className={`w-16 h-16 rounded-full bg-mosaic-amber ${colorScheme === 'amber' ? 'ring-2 ring-black' : ''}`}
            onClick={() => setColorScheme('amber')}
            aria-label="Amber color scheme"
          />
          <Button 
            variant="outline" 
            className={`w-16 h-16 rounded-full bg-mosaic-ruby ${colorScheme === 'ruby' ? 'ring-2 ring-black' : ''}`}
            onClick={() => setColorScheme('ruby')}
            aria-label="Ruby color scheme"
          />
        </div>
      </CardContent>
    </div>
  );

  const renderLanguageStep = () => (
    <div className="space-y-4 fade-in">
      <CardHeader>
        <CardTitle>Language Preference</CardTitle>
        <CardDescription>Select your preferred language</CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="spanish">Spanish</SelectItem>
            <SelectItem value="french">French</SelectItem>
            <SelectItem value="swahili">Swahili</SelectItem>
            <SelectItem value="arabic">Arabic</SelectItem>
            <SelectItem value="mandarin">Mandarin</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </div>
  );

  return (
    <Card className="w-full max-w-md mx-auto">
      {step === 1 && renderIdentityStep()}
      {step === 2 && renderColorStep()}
      {step === 3 && renderLanguageStep()}
      
      <CardFooter className="flex justify-between">
        {step > 1 && (
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        )}
        <Button onClick={handleContinue}>
          {step < 3 ? 'Continue' : 'Start Exploring'}
        </Button>
      </CardFooter>
    </Card>
  );
}
