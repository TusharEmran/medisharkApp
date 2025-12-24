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
