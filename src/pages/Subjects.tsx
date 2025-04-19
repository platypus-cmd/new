
import React, { useState, useEffect } from 'react';
import SidebarNav from '@/components/SidebarNav';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Camera, User, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getUserData, updateProfilePhoto, updateSubjectProgress } from '@/utils/localStorage';
import { useToast } from "@/hooks/use-toast";

const Subjects = () => {
  const [userData, setUserData] = useState(getUserData());
  const [profilePhoto, setProfilePhoto] = useState(userData.profilePhoto);
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);
  const { toast } = useToast();
  
  // Get fresh data from localStorage on mount
  useEffect(() => {
    setUserData(getUserData());
  }, []);
  
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePhoto(imageUrl);
      updateProfilePhoto(imageUrl);
    }
  };

  const handleProgressChange = (subjectId: string, progress: number) => {
    // Ensure progress is between 0 and 100
    progress = Math.min(100, Math.max(0, progress));
    
    // Update subject progress in localStorage
    updateSubjectProgress(subjectId, progress);
    
    // Update local state
    setUserData(prev => ({
      ...prev,
      subjects: prev.subjects.map(subject => 
        subject.id === subjectId ? { ...subject, progress } : subject
      )
    }));
    
    toast({
      title: "Progress Updated",
      description: "Subject progress has been updated successfully.",
    });
  };
  
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl p-6">
        <div className="rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-sidebar flex flex-col items-center p-6 border-r border-gray-100">
              <div className="mb-8 relative">
                <div
                  className="relative w-24 h-24 mx-auto"
                  onMouseEnter={() => setIsHoveringAvatar(true)}
                  onMouseLeave={() => setIsHoveringAvatar(false)}
                >
                  <Avatar className="w-24 h-24 border-2 border-gray-200">
                    <AvatarImage src={profilePhoto} alt="User Avatar" />
                    <AvatarFallback>
                      <User className="h-12 w-12 text-gray-400" />
                    </AvatarFallback>
                  </Avatar>

                  <label 
                    htmlFor="profile-upload" 
                    className={`absolute inset-0 flex items-center justify-center rounded-full transition-opacity cursor-pointer
                    ${isHoveringAvatar ? 'bg-black/50 opacity-100' : 'opacity-0'}`}
                  >
                    <Camera className="h-8 w-8 text-white" />
                    <Input 
                      type="file" 
                      id="profile-upload" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handlePhotoChange}
                    />
                  </label>
                </div>
              </div>
              <SidebarNav />
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
              <h1 className="text-4xl font-bold text-primary mb-8">Your Subjects</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userData.subjects.map((subject) => (
                  <Card key={subject.id} className="overflow-hidden border border-gray-100">
                    <CardHeader className="p-6" style={{ backgroundColor: `${subject.color}20` }}>
                      <CardTitle className="text-xl flex items-center">
                        <span className="h-4 w-4 rounded-full mr-2" style={{ backgroundColor: subject.color }}></span>
                        {subject.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600">Progress</span>
                          <span className="text-sm font-medium">{subject.progress}%</span>
                        </div>
                        <Progress value={subject.progress} className="h-2" />
                      </div>
                      <div className="mt-4 flex justify-between gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleProgressChange(subject.id, subject.progress - 5)}
                          disabled={subject.progress <= 0}
                        >
                          -5%
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleProgressChange(subject.id, subject.progress + 5)}
                          disabled={subject.progress >= 100}
                        >
                          +5%
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleProgressChange(subject.id, subject.progress + 10)}
                          disabled={subject.progress >= 100}
                        >
                          +10%
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subjects;
