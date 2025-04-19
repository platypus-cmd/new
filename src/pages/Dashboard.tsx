
import React, { useState, useEffect } from 'react';
import { getUserData } from '@/utils/localStorage';
import SidebarNav from '@/components/SidebarNav';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { ChartContainer, ChartTooltipContent, ChartTooltip } from '@/components/ui/chart';

const Dashboard = () => {
  const [userData, setUserData] = useState(getUserData());
  
  // Calculate completion statistics
  const completedTasks = userData.tasks.filter(task => task.completed).length;
  const totalTasks = userData.tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  // Load fresh data on component mount
  useEffect(() => {
    setUserData(getUserData());
  }, []);

  // Prepare data for charts
  const subjectProgressData = userData.subjects.map(subject => ({
    name: subject.name,
    progress: subject.progress,
    color: subject.color
  }));

  const taskCompletionData = [
    { name: 'Completed', value: completedTasks, color: '#10B981' },
    { name: 'Pending', value: totalTasks - completedTasks, color: '#F87171' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl p-6">
        <div className="rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-sidebar flex flex-col items-center p-6 border-r border-gray-100">
              <div className="mb-8 relative">
                <Avatar className="w-24 h-24 border-2 border-gray-200">
                  <AvatarImage src={userData.profilePhoto} alt="User Avatar" />
                  <AvatarFallback>
                    <User className="h-12 w-12 text-gray-400" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <SidebarNav />
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
              <h1 className="text-4xl font-bold text-primary mb-8">Your Progress Dashboard</h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Stats Overview */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                  <h2 className="text-2xl font-bold mb-4">Task Completion</h2>
                  <div className="flex flex-col space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Completion Rate:</span>
                      <span className="font-bold text-primary">{completionRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Tasks Completed:</span>
                      <span>{completedTasks} of {totalTasks}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-primary h-4 rounded-full" 
                        style={{ width: `${completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Pie Chart */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                  <h2 className="text-2xl font-bold mb-4">Task Distribution</h2>
                  <ChartContainer className="h-64" config={{
                    primary: { color: "#10B981" },
                    secondary: { color: "#F87171" }
                  }}>
                    <PieChart>
                      <Pie
                        data={taskCompletionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                      >
                        {taskCompletionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                    </PieChart>
                  </ChartContainer>
                </div>
              </div>

              {/* Subject Progress Chart */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">Subject Progress</h2>
                <ChartContainer 
                  className="h-72" 
                  config={subjectProgressData.reduce((acc, subject) => {
                    acc[subject.name] = { color: subject.color };
                    return acc;
                  }, {} as Record<string, { color: string }>)}
                >
                  <BarChart data={subjectProgressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Progress %', angle: -90, position: 'insideLeft' }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    {subjectProgressData.map((subject) => (
                      <Bar 
                        key={subject.name}
                        dataKey="progress" 
                        name={subject.name} 
                        fill={subject.color} 
                      />
                    ))}
                  </BarChart>
                </ChartContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
