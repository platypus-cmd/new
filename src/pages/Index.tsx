
import React, { useState, useEffect } from 'react';
import SidebarNav from '@/components/SidebarNav';
import TaskItem from '@/components/TaskItem';
import Calendar from '@/components/Calendar';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getUserData, updateProfilePhoto, updateTasks } from '@/utils/localStorage';

const Index = () => {
  const [userData, setUserData] = useState(getUserData());
  const [profilePhoto, setProfilePhoto] = useState(userData.profilePhoto);
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);
  
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

  const handleTaskStatusChange = (taskId: string, completed: boolean) => {
    const updatedTasks = userData.tasks.map(task => 
      task.id === taskId ? { ...task, completed } : task
    );
    
    // Update local state
    setUserData(prev => ({
      ...prev,
      tasks: updatedTasks
    }));
    
    // Save to localStorage
    updateTasks(updatedTasks);
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
              <h1 className="text-4xl font-bold text-primary mb-8">Welcome back, {userData.name}!</h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tasks Panel */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  <h2 className="text-2xl font-bold p-6 border-b border-gray-100">Today's Tasks</h2>
                  <div className="divide-y divide-gray-100">
                    {userData.tasks.map((task) => (
                      <TaskItem 
                        key={task.id} 
                        task={task} 
                        onStatusChange={handleTaskStatusChange}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Calendar Panel */}
                <Calendar className="border border-gray-100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
