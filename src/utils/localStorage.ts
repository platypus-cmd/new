
// Define types for our data structure
export interface UserData {
  name: string;
  profilePhoto: string;
  tasks: {
    id: string;
    text: string;
    completed: boolean;
    date: string;
  }[];
  events: {
    id: string;
    date: string;
    title: string;
  }[];
  subjects: {
    id: string;
    name: string;
    progress: number;
    color: string;
  }[];
}

// Initial data structure
const initialUserData: UserData = {
  name: "Neil",
  profilePhoto: "/lovable-uploads/bc631808-f0d1-4dc0-91b9-2243fb81468d.png",
  tasks: [
    { id: "1", text: "Complete Java Assignment", completed: false, date: "2025-04-11" },
    { id: "2", text: "Study for Math Exam", completed: false, date: "2025-04-12" },
    { id: "3", text: "Work on Front-End Development", completed: false, date: "2025-04-13" }
  ],
  events: [
    { id: "1", date: "2025-04-23", title: "BCA Exams" },
    { id: "2", date: "2025-04-25", title: "BCA Coursework" }
  ],
  subjects: [
    { id: "1", name: "Java", progress: 75, color: "#4C9AFF" },
    { id: "2", name: "Web Development", progress: 60, color: "#F87171" },
    { id: "3", name: "Database", progress: 45, color: "#10B981" },
    { id: "4", name: "Mathematics", progress: 90, color: "#8B5CF6" }
  ]
};

// Get user data from localStorage or use initial data
export const getUserData = (): UserData => {
  const storedData = localStorage.getItem('userData');
  if (storedData) {
    return JSON.parse(storedData);
  }
  return initialUserData;
};

// Save user data to localStorage
export const saveUserData = (data: UserData): void => {
  localStorage.setItem('userData', JSON.stringify(data));
};

// Utility functions for specific data updates
export const updateTasks = (tasks: UserData['tasks']): void => {
  const userData = getUserData();
  userData.tasks = tasks;
  saveUserData(userData);
};

export const updateEvents = (events: UserData['events']): void => {
  const userData = getUserData();
  userData.events = events;
  saveUserData(userData);
};

export const updateProfilePhoto = (photoUrl: string): void => {
  const userData = getUserData();
  userData.profilePhoto = photoUrl;
  saveUserData(userData);
};

export const updateSubjectProgress = (subjectId: string, progress: number): void => {
  const userData = getUserData();
  const subject = userData.subjects.find(s => s.id === subjectId);
  if (subject) {
    subject.progress = progress;
    saveUserData(userData);
  }
};
