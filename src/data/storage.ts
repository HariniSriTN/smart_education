import { 
  User, Course, Enrollment, Assessment, AssessmentAttempt, 
  LearningResource, Certificate, Announcement, Feedback, TrainerCompetency, 
  PlatformActivity, Notification
} from '../types';
import { 
  INITIAL_USERS, INITIAL_COURSES, INITIAL_ENROLLMENTS, 
  INITIAL_ASSESSMENTS, INITIAL_RESOURCES, INITIAL_CERTIFICATES, 
  INITIAL_ANNOUNCEMENTS, INITIAL_FEEDBACK, INITIAL_TRAINER_COMPETENCIES, 
  INITIAL_ACTIVITIES 
} from './mockData';

const STORAGE_KEYS = {
  USERS: 'capacity_connect_users_v1',
  COURSES: 'capacity_connect_courses_v1',
  ENROLLMENTS: 'capacity_connect_enrollments_v1',
  ASSESSMENTS: 'capacity_connect_assessments_v1',
  ATTEMPTS: 'capacity_connect_attempts_v1',
  RESOURCES: 'capacity_connect_resources_v1',
  CERTIFICATES: 'capacity_connect_certificates_v1',
  ANNOUNCEMENTS: 'capacity_connect_announcements_v1',
  FEEDBACK: 'capacity_connect_feedback_v1',
  COMPETENCIES: 'capacity_connect_competencies_v1',
  ACTIVITIES: 'capacity_connect_activities_v1',
  NOTIFICATIONS: 'capacity_connect_notifications_v1',
  CURRENT_USER: 'capacity_connect_current_user_v1'
};

// Safe JSON loader
function getItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error loading from localStorage key: ${key}`, e);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving to localStorage key: ${key}`, e);
  }
}

// Initialize seed data if not present
export function initializeStorage(): void {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    setItem(STORAGE_KEYS.USERS, INITIAL_USERS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.COURSES)) {
    setItem(STORAGE_KEYS.COURSES, INITIAL_COURSES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ENROLLMENTS)) {
    setItem(STORAGE_KEYS.ENROLLMENTS, INITIAL_ENROLLMENTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ASSESSMENTS)) {
    setItem(STORAGE_KEYS.ASSESSMENTS, INITIAL_ASSESSMENTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.RESOURCES)) {
    setItem(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CERTIFICATES)) {
    setItem(STORAGE_KEYS.CERTIFICATES, INITIAL_CERTIFICATES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS)) {
    setItem(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.FEEDBACK)) {
    setItem(STORAGE_KEYS.FEEDBACK, INITIAL_FEEDBACK);
  }
  if (!localStorage.getItem(STORAGE_KEYS.COMPETENCIES)) {
    setItem(STORAGE_KEYS.COMPETENCIES, INITIAL_TRAINER_COMPETENCIES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ACTIVITIES)) {
    setItem(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    const defaultNotifs: Notification[] = [
      {
        id: 'notif-1',
        userId: 'user-trainee-1',
        title: 'Upcoming Assessment Deadline',
        message: 'Doppler Weather Radar Assessment 1 submission closes May 15, 2026.',
        type: 'deadline',
        timestamp: '1 hour ago',
        isRead: false,
        link: '/assessments'
      },
      {
        id: 'notif-2',
        userId: 'user-trainee-1',
        title: 'New Course Announcement',
        message: 'High-Resolution Earth System Modeling course has been scheduled.',
        type: 'course',
        timestamp: '3 hours ago',
        isRead: false,
        link: '/courses'
      },
      {
        id: 'notif-3',
        userId: 'user-trainee-1',
        title: 'Certificate Verified',
        message: 'Your certificate for Doppler Weather Radar Operations is verified and downloadable.',
        type: 'system',
        timestamp: '2 days ago',
        isRead: true,
        link: '/certifications'
      }
    ];
    setItem(STORAGE_KEYS.NOTIFICATIONS, defaultNotifs);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    // Default to Trainee Priya Sharma for rich interactive trainee view
    setItem(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
  }
}

// Reset Demo Data
export function resetDemoData(): void {
  localStorage.clear();
  initializeStorage();
  window.location.reload();
}

// USERS
export function getUsers(): User[] {
  return getItem<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
}
export function saveUsers(users: User[]): void {
  setItem(STORAGE_KEYS.USERS, users);
}
export function updateUser(updated: User): void {
  const users = getUsers().map(u => u.id === updated.id ? updated : u);
  saveUsers(users);
  const current = getCurrentUser();
  if (current && current.id === updated.id) {
    saveCurrentUser(updated);
  }
}
export function addUser(user: User): void {
  const users = [user, ...getUsers()];
  saveUsers(users);
}
export function approveUser(userId: string): void {
  const users = getUsers().map(u => u.id === userId ? { ...u, status: 'active' as const } : u);
  saveUsers(users);
}
export function rejectUser(userId: string): void {
  const users = getUsers().map(u => u.id === userId ? { ...u, status: 'rejected' as const } : u);
  saveUsers(users);
}

// CURRENT AUTHENTICATED USER
export function getCurrentUser(): User | null {
  return getItem<User | null>(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
}
export function saveCurrentUser(user: User | null): void {
  setItem(STORAGE_KEYS.CURRENT_USER, user);
}

// COURSES
export function getCourses(): Course[] {
  return getItem<Course[]>(STORAGE_KEYS.COURSES, INITIAL_COURSES);
}
export function saveCourses(courses: Course[]): void {
  setItem(STORAGE_KEYS.COURSES, courses);
}
export function getCourseById(id: string): Course | undefined {
  return getCourses().find(c => c.id === id);
}
export function addCourse(course: Course): void {
  const courses = [course, ...getCourses()];
  saveCourses(courses);
  addActivity({
    id: 'act-' + Date.now(),
    type: 'course_created',
    description: `New course created: "${course.title}" (${course.code})`,
    timestamp: 'Just now',
    user: course.trainerName,
    meta: course.category
  });
}
export function updateCourse(updated: Course): void {
  const courses = getCourses().map(c => c.id === updated.id ? updated : c);
  saveCourses(courses);
}

// ENROLLMENTS
export function getEnrollments(): Enrollment[] {
  return getItem<Enrollment[]>(STORAGE_KEYS.ENROLLMENTS, INITIAL_ENROLLMENTS);
}
export function saveEnrollments(enrollments: Enrollment[]): void {
  setItem(STORAGE_KEYS.ENROLLMENTS, enrollments);
}
export function getUserEnrollments(userId: string): Enrollment[] {
  return getEnrollments().filter(e => e.userId === userId);
}
export function enrollInCourse(userId: string, courseId: string): Enrollment {
  const existing = getEnrollments().find(e => e.userId === userId && e.courseId === courseId);
  if (existing) return existing;

  const newEnrollment: Enrollment = {
    id: 'enr-' + Date.now(),
    userId,
    courseId,
    enrolledDate: new Date().toISOString().split('T')[0],
    progressPercentage: 0,
    completedLessonIds: [],
    status: 'in-progress',
    lastAccessedAt: new Date().toISOString()
  };

  const enrollments = [newEnrollment, ...getEnrollments()];
  saveEnrollments(enrollments);

  // Update course enrolled count
  const course = getCourseById(courseId);
  if (course) {
    updateCourse({ ...course, enrolledCount: course.enrolledCount + 1 });
  }

  addActivity({
    id: 'act-' + Date.now(),
    type: 'enrollment',
    description: `User enrolled in "${course?.title || 'Course'}"`,
    timestamp: 'Just now',
    user: 'Trainee'
  });

  return newEnrollment;
}

export function updateLessonProgress(userId: string, courseId: string, lessonId: string): Enrollment | undefined {
  const enrollments = getEnrollments();
  const index = enrollments.findIndex(e => e.userId === userId && e.courseId === courseId);
  if (index === -1) return undefined;

  const enr = enrollments[index];
  const course = getCourseById(courseId);
  if (!course) return enr;

  // Total lessons in course
  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completed = enr.completedLessonIds.includes(lessonId)
    ? enr.completedLessonIds
    : [...enr.completedLessonIds, lessonId];

  const progress = totalLessons > 0 ? Math.round((completed.length / totalLessons) * 100) : 100;
  const isCompleted = progress >= 100;

  const updated: Enrollment = {
    ...enr,
    completedLessonIds: completed,
    progressPercentage: Math.min(100, progress),
    status: isCompleted ? 'completed' : 'in-progress',
    lastAccessedAt: new Date().toISOString()
  };

  enrollments[index] = updated;
  saveEnrollments(enrollments);

  // If completed, automatically generate a certificate if not already issued!
  if (isCompleted && !updated.certificateId) {
    const user = getUsers().find(u => u.id === userId);
    if (user) {
      const certId = 'cert-' + Date.now();
      const newCert: Certificate = {
        id: certId,
        certificateNumber: `MOES-CC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
        userId,
        userName: user.name,
        userDesignation: user.designation,
        department: user.department,
        courseId,
        courseTitle: course.title,
        trainerName: course.trainerName,
        issueDate: new Date().toISOString().split('T')[0],
        grade: 'A+ (Exemplary)',
        scorePercentage: 96,
        verificationCode: `VRF-${Math.floor(1000 + Math.random() * 9000)}-MOES-IMD`
      };
      addCertificate(newCert);
      updated.certificateId = certId;
      enrollments[index] = updated;
      saveEnrollments(enrollments);
    }
  }

  return updated;
}

// ASSESSMENTS & ATTEMPTS
export function getAssessments(): Assessment[] {
  return getItem<Assessment[]>(STORAGE_KEYS.ASSESSMENTS, INITIAL_ASSESSMENTS);
}
export function saveAssessments(assessments: Assessment[]): void {
  setItem(STORAGE_KEYS.ASSESSMENTS, assessments);
}
export function addAssessment(assessment: Assessment): void {
  const assessments = [assessment, ...getAssessments()];
  saveAssessments(assessments);
}

export function getAttempts(): AssessmentAttempt[] {
  return getItem<AssessmentAttempt[]>(STORAGE_KEYS.ATTEMPTS, []);
}
export function saveAttempts(attempts: AssessmentAttempt[]): void {
  setItem(STORAGE_KEYS.ATTEMPTS, attempts);
}
export function saveAttempt(attempt: AssessmentAttempt): void {
  const attempts = [attempt, ...getAttempts()];
  saveAttempts(attempts);
  addActivity({
    id: 'act-' + Date.now(),
    type: 'assessment',
    description: `${attempt.userName} completed assessment: score ${attempt.percentage}% (${attempt.passed ? 'PASSED' : 'FAILED'})`,
    timestamp: 'Just now',
    user: attempt.userName,
    meta: `${attempt.score}/${attempt.totalQuestions}`
  });
}

// RESOURCES
export function getResources(): LearningResource[] {
  return getItem<LearningResource[]>(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
}
export function saveResources(resources: LearningResource[]): void {
  setItem(STORAGE_KEYS.RESOURCES, resources);
}
export function addResource(res: LearningResource): void {
  const resources = [res, ...getResources()];
  saveResources(resources);
}

// CERTIFICATES
export function getCertificates(): Certificate[] {
  return getItem<Certificate[]>(STORAGE_KEYS.CERTIFICATES, INITIAL_CERTIFICATES);
}
export function saveCertificates(certs: Certificate[]): void {
  setItem(STORAGE_KEYS.CERTIFICATES, certs);
}
export function addCertificate(cert: Certificate): void {
  const certs = [cert, ...getCertificates()];
  saveCertificates(certs);
  addActivity({
    id: 'act-' + Date.now(),
    type: 'completion',
    description: `Certificate awarded to ${cert.userName} for "${cert.courseTitle}"`,
    timestamp: 'Just now',
    user: cert.userName,
    meta: cert.grade
  });
}

// ANNOUNCEMENTS
export function getAnnouncements(): Announcement[] {
  return getItem<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
}
export function saveAnnouncements(announcements: Announcement[]): void {
  setItem(STORAGE_KEYS.ANNOUNCEMENTS, announcements);
}
export function addAnnouncement(ann: Announcement): void {
  const anns = [ann, ...getAnnouncements()];
  saveAnnouncements(anns);
  // Also push a notification
  const notifs = getNotifications();
  const newNotif: Notification = {
    id: 'notif-' + Date.now(),
    userId: 'all',
    title: ann.title,
    message: ann.content.slice(0, 80) + '...',
    type: 'announcement',
    timestamp: 'Just now',
    isRead: false,
    link: '/announcements'
  };
  saveNotifications([newNotif, ...notifs]);
}
export function markAnnouncementRead(announcementId: string, userId: string): void {
  const anns = getAnnouncements().map(a => {
    if (a.id === announcementId && !a.readBy.includes(userId)) {
      return { ...a, readBy: [...a.readBy, userId] };
    }
    return a;
  });
  saveAnnouncements(anns);
}

// NOTIFICATIONS
export function getNotifications(): Notification[] {
  return getItem<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
}
export function saveNotifications(notifs: Notification[]): void {
  setItem(STORAGE_KEYS.NOTIFICATIONS, notifs);
}
export function markAllNotificationsRead(): void {
  const notifs = getNotifications().map(n => ({ ...n, isRead: true }));
  saveNotifications(notifs);
}

// FEEDBACK
export function getFeedback(): Feedback[] {
  return getItem<Feedback[]>(STORAGE_KEYS.FEEDBACK, INITIAL_FEEDBACK);
}
export function saveFeedback(fb: Feedback[]): void {
  setItem(STORAGE_KEYS.FEEDBACK, fb);
}
export function addFeedback(item: Feedback): void {
  const feedbackList = [item, ...getFeedback()];
  saveFeedback(feedbackList);
}

// COMPETENCIES
export function getCompetencies(): TrainerCompetency[] {
  return getItem<TrainerCompetency[]>(STORAGE_KEYS.COMPETENCIES, INITIAL_TRAINER_COMPETENCIES);
}
export function saveCompetencies(comps: TrainerCompetency[]): void {
  setItem(STORAGE_KEYS.COMPETENCIES, comps);
}

// ACTIVITIES
export function getActivities(): PlatformActivity[] {
  return getItem<PlatformActivity[]>(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
}
export function addActivity(act: PlatformActivity): void {
  const activities = [act, ...getActivities().slice(0, 19)];
  setItem(STORAGE_KEYS.ACTIVITIES, activities);
}
