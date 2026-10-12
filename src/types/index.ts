export type UserRole = 'trainee' | 'trainer' | 'admin';
export type UserStatus = 'active' | 'pending' | 'inactive' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  designation: string;
  status: UserStatus;
  avatar?: string;
  joinedDate: string;
  phone?: string;
  bio?: string;
  qualifications?: string[];
  skills?: string[];
}

export type CourseDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type CourseStatus = 'published' | 'draft' | 'archived';

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  durationMinutes: number;
  type: 'video' | 'pdf' | 'reading' | 'quiz';
  videoUrl?: string;
  contentSummary: string;
  resourceUrl?: string;
  pdfNotes?: string;
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  code: string;
  category: string;
  trainerId: string;
  trainerName: string;
  duration: string;
  difficulty: CourseDifficulty;
  description: string;
  learningObjectives: string[];
  prerequisites: string[];
  thumbnail: string;
  status: CourseStatus;
  enrolledCount: number;
  completionRate: number;
  rating: number;
  ratingCount: number;
  modules: CourseModule[];
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledDate: string;
  progressPercentage: number;
  completedLessonIds: string[];
  status: 'in-progress' | 'completed';
  lastAccessedAt: string;
  certificateId?: string;
}

export interface AssessmentQuestion {
  id: string;
  assessmentId: string;
  questionText: string;
  topic: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface Assessment {
  id: string;
  title: string;
  courseId: string;
  courseTitle: string;
  subject: string;
  durationMinutes: number;
  passingScorePercent: number;
  totalQuestions: number;
  deadline: string;
  createdBy: string;
  questions: AssessmentQuestion[];
  status: 'active' | 'upcoming' | 'closed';
}

export interface AssessmentAttempt {
  id: string;
  assessmentId: string;
  userId: string;
  userName: string;
  userEmail: string;
  startedAt: string;
  submittedAt: string;
  answers: Record<string, number>; // questionId -> selectedOptionIndex
  markedForReview: string[];
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  topicBreakdown: {
    topic: string;
    total: number;
    correct: number;
  }[];
}

export type ResourceType = 'lecture' | 'pdf' | 'presentation' | 'document' | 'questionnaire';

export interface LearningResource {
  id: string;
  title: string;
  type: ResourceType;
  subject: string;
  courseId: string;
  courseTitle: string;
  trainerName: string;
  uploadDate: string;
  fileSize: string;
  description: string;
  downloadUrl?: string;
  viewCount: number;
  isSimulated?: boolean;
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  userId: string;
  userName: string;
  userDesignation: string;
  department: string;
  courseId: string;
  courseTitle: string;
  trainerName: string;
  issueDate: string;
  grade: string;
  scorePercentage: number;
  verificationCode: string;
}

export type AnnouncementCategory = 
  | 'New Courses'
  | 'Training Schedules'
  | 'Assessment Deadlines'
  | 'Learning Resources'
  | 'Achievements'
  | 'General Announcements';

export type AnnouncementPriority = 'Normal' | 'High' | 'Urgent';

export interface Announcement {
  id: string;
  title: string;
  category: AnnouncementCategory;
  priority: AnnouncementPriority;
  content: string;
  publishDate: string;
  author: string;
  authorRole: string;
  readBy: string[]; // user IDs
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'deadline' | 'course' | 'announcement' | 'system';
  timestamp: string;
  isRead: boolean;
  link?: string;
}

export interface Feedback {
  id: string;
  courseId: string;
  courseTitle: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  rating: number;
  aspects: {
    contentQuality: number;
    instructorDelivery: number;
    practicalRelevance: number;
  };
  comment: string;
  submittedAt: string;
}

export interface TrainerCompetency {
  trainerId: string;
  trainerName: string;
  email: string;
  department: string;
  designation: string;
  qualifications: string[];
  experienceYears: number;
  domains: string[];
  skills: string[];
  competencyLevels: {
    domain: string;
    level: 'Expert' | 'Advanced' | 'Proficient';
    score: number; // 0-100
  }[];
  certifications: string[];
  rating: number;
  assignedCoursesCount: number;
  avatar: string;
  bio: string;
}

export interface PlatformActivity {
  id: string;
  type: 'enrollment' | 'completion' | 'assessment' | 'course_created' | 'announcement';
  description: string;
  timestamp: string;
  user: string;
  avatar?: string;
  meta?: string;
}
