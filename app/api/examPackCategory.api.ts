// src/api/courses.api.ts
import { apiClient } from "./apiClient";

export type Course = {
  id: string;
  title: string;
  description: string;
  thumbnail: string; // e.g. 'medisharkcourse.webp'
  progress: number; // percentage
  totalLessons: number;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  duration: string;
  questionsCount: number;
};

// Multi-level mock types for hierarchical view (module -> submodule -> exams)
export type CourseExam = {
  id: string;
  title: string;
  description: string;
};

export type CourseSubmodule = {
  id: string;
  title: string;
  description: string;
};

export type CourseSubmoduleNode = {
  submodules: CourseSubmodule[];
  exams: CourseExam[];
};

export async function getAllCourses(): Promise<Course[]> {
  // For now, return dummy data so Docs screen can render study packs
  return [
    {
      id: 'medical-mbbs',
      title: 'Undergraduate Courses',
      description: 'Complete MBBS admission preparation set covering biology, chemistry and physics.',
      thumbnail: 'ug.webp',
      progress: 40,
      totalLessons: 28,
      category: 'Medical',
      level: 'Intermediate',
      rating: 4.9,
      duration: '6h 30min',
      questionsCount: 28,
    },
    {
      id: 'dental-bds',
      title: 'FCPS & MRCP',
      description: 'Focused BDS admission bank with foundational subjects for new aspirants.',
      thumbnail: 'pg.webp',
      progress: 25,
      totalLessons: 24,
      category: 'Dental',
      level: 'Beginner',
      rating: 4.8,
      duration: '3h 42min',
      questionsCount: 24,
    },
    {
      id: 'engineering-buet',
      title: 'GP Courses',
      description: 'Advanced level question sets for BUET and public engineering universities.',
      thumbnail: 'gp.webp',
      progress: 60,
      totalLessons: 46,
      category: 'Engineering',
      level: 'Advanced',
      rating: 4.6,
      duration: '8h 28min',
      questionsCount: 46,
    },
  ];
}

// Multi-level mock tree per-course for UI exploration
// Shape is compatible with SubmodulePacks-style navigation: a map of id -> node
export async function getCourseSubmoduleTree(
  courseId: string,
): Promise<Record<string, CourseSubmoduleNode>> {
  // For now, return the same tree regardless of courseId so UI can test
  const tree: Record<string, CourseSubmoduleNode> = {
    root: {
      submodules: [
        {
          id: 'mod-1',
          title: 'Module 1: Chapter-wise MCQ Practice',
          description: 'Practice modules by topics with explanations.',
        },
        {
          id: 'mod-2',
          title: 'Module 2: Full Mock Tests',
          description: 'Simulated full-length tests.',
        },
        {
          id: 'mod-3',
          title: 'Module 3: Past Year Questions',
          description: 'Previous years question sets.',
        },
      ],
      exams: [],
    },
    'mod-1': {
      submodules: [
        {
          id: 'mod-1-1',
          title: 'Biology Chapters',
          description: 'Biology chapter-wise practice.',
        },
        {
          id: 'mod-1-2',
          title: 'Chemistry Chapters',
          description: 'Chemistry chapter-wise practice.',
        },
      ],
      exams: [
        {
          id: 'mod-1-exam-mixed',
          title: 'Mixed Chapter Exam',
          description: 'Mixed chapters for quick revision.',
        },
      ],
    },
    'mod-1-1': {
      submodules: [
        {
          id: 'mod-1-1-1',
          title: 'Cell Biology',
          description: 'MCQs on cell biology.',
        },
        {
          id: 'mod-1-1-2',
          title: 'Genetics',
          description: 'Genetics and inheritance.',
        },
      ],
      exams: [],
    },
    'mod-1-1-1': {
      submodules: [
        {
          id: 'mod-1-1-1-1',
          title: 'Cell Membrane',
          description: 'Transport and membrane structure.',
        },
      ],
      exams: [
        {
          id: 'mod-1-1-1-exam',
          title: 'Cell Biology Exam',
          description: 'Focused exam on cell biology topics.',
        },
      ],
    },
    'mod-1-1-1-1': {
      submodules: [],
      exams: [
        {
          id: 'mod-1-1-1-1-quiz',
          title: 'Cell Membrane Quiz',
          description: 'Short quiz on membrane transport.',
        },
      ],
    },
    'mod-1-1-2': {
      submodules: [],
      exams: [
        {
          id: 'gen-exam-1',
          title: 'Genetics Practice Exam',
          description: 'Mendelian and non-Mendelian genetics.',
        },
      ],
    },
    'mod-2': {
      submodules: [],
      exams: [
        {
          id: 'mock-1',
          title: 'Full Mock Test 1',
          description: 'Timed full-length mock test.',
        },
        {
          id: 'mock-2',
          title: 'Full Mock Test 2',
          description: 'Another full-length practice exam.',
        },
      ],
    },
    'mod-3': {
      submodules: [],
      exams: [
        {
          id: 'past-2022',
          title: '2022 Question Set',
          description: 'Past year exam questions.',
        },
      ],
    },
  };

  return tree;
}

export async function getCourseById(id: string): Promise<Course> {
  const res = await apiClient.get(`/courses/${id}`);

  return res.data;
}

export async function getCourseLessons(courseId: string) {
  const res = await apiClient.get(`/courses/${courseId}/lessons`);
  return res.data;
}

export async function enrollIntoCourse(courseId: string) {
  const res = await apiClient.post(`/courses/${courseId}/enroll`);
  return res.data;
}

export type ExamStats = {
  examsCount: number;
  categoriesCount: number;
  lessonsCount: number;
};

export async function getExamStats(): Promise<ExamStats> {
  return {
    examsCount: 120,
    categoriesCount: 12,
    lessonsCount: 240,
  };
}

export type ExamPackSection = {
  id: string;
  key: string; // e.g. "popular", "undergraduate", "fcps_mrcp", "gp_courses"
  title: string;
  enabled: boolean;
};

export async function getExamPackSections(): Promise<ExamPackSection[]> {
  // Later: fetch from backend so admin can add/remove sections
  return [
    {
      id: "popular",
      key: "popular",
      title: "Popular exam packs",
      enabled: true,
    },
    {
      id: "undergraduate",
      key: "undergraduate",
      title: "Undergraduate exam packs",
      enabled: true,
    },
    {
      id: "fcps_mrcp",
      key: "fcps_mrcp",
      title: "FCPS & MRCP exam packs",
      enabled: true,
    },
    {
      id: "gp_courses",
      key: "gp_courses",
      title: "GP courses",
      enabled: true,
    },
  ];
}
