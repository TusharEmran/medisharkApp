export type SubmoduleNode = {
  id: string;
  title: string;
  description: string;
};

export type ExamNode = {
  id: string;
  title: string;
  description: string;
  questionCount?: number;
  duration?: string;
};

export type OnlineClassNode = {
  id: string;
  title: string;
  description: string;
  duration?: string;
  status?: string;
  videoUrl?: string;
  thumbnail?: string;
  instructor?: string;
  schedule?: string;
};

export type SubmoduleTreeNode = {
  submodules: SubmoduleNode[];
  exams: ExamNode[];
  onlineClasses?: OnlineClassNode[];
};

const SAMPLE_VIDEO_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

export const SUBMODULE_TREE: Record<string, SubmoduleTreeNode> = {
  root: {
    submodules: [
      {
        id: 'sub-1',
        title: 'Chapter-wise MCQ Practice',
        description: 'Practice by chapters with detailed explanations.',
      },
      {
        id: 'sub-2',
        title: 'Full Mock Tests',
        description: 'Simulated full-length admission tests.',
      },
      {
        id: 'sub-3',
        title: 'Past Year Questions',
        description: 'Previous years question sets for revision.',
      },
    ],
    exams: [],
  },
  'sub-1': {
    submodules: [
      {
        id: 'sub-1-1',
        title: 'Biology Chapters',
        description: 'Topic-wise biology questions.',
      },
      {
        id: 'sub-1-2',
        title: 'Chemistry Chapters',
        description: 'Topic-wise chemistry questions.',
      },
    ],
    exams: [],
  },
  'sub-1-1': {
    submodules: [
      {
        id: 'sub-1-1-1',
        title: 'Cell Biology',
        description: 'MCQs on cell biology.',
      },
      {
        id: 'sub-1-1-2',
        title: 'Genetics',
        description: 'Genetics and inheritance patterns.',
      },
    ],
    exams: [],
  },
  'sub-1-1-1': {
    submodules: [
      {
        id: 'sub-1-1-1-1',
        title: 'Cell Membrane',
        description: 'Detailed questions on cell membrane structure.',
      },
    ],
    exams: [
      {
        id: 'exam-1-1',
        title: 'Cell Biology Exam',
        description: 'Focused exam on cell biology topics.',
        questionCount: 35,
        duration: '25 min',
      },
    ],
  },
  'sub-1-1-1-1': {
    submodules: [],
    exams: [
      {
        id: 'exam-1-1-1',
        title: 'Cell Membrane Quiz',
        description: 'Short quiz on membrane transport and structure.',
        questionCount: 20,
        duration: '15 min',
      },
    ],
    onlineClasses: [
      {
        id: 'class-1-1-1',
        title: 'Cell Membrane Live Class',
        description: 'Interactive session on membrane transport.',
        duration: '40m 9s',
        status: 'Completed',
        videoUrl: SAMPLE_VIDEO_URL,
        instructor: 'Dr. A. Rahman',
        schedule: 'Fri, 6:00 PM',
      },
    ],
  },
  'sub-1-1-2': {
    submodules: [],
    exams: [
      {
        id: 'exam-gen-1',
        title: 'Genetics Practice Exam',
        description: 'Practice questions on Mendelian genetics.',
        questionCount: 45,
        duration: '35 min',
      },
    ],
    onlineClasses: [
      {
        id: 'class-gen-1',
        title: 'Genetics Problem Solving',
        description: 'Workshop on Punnett squares and probabilities.',
        duration: '40m 9s',
        status: 'Not completed',
        videoUrl: SAMPLE_VIDEO_URL,
        instructor: 'Prof. S. Nahar',
        schedule: 'Sun, 11:00 AM',
      },
    ],
  },
  'sub-2': {
    submodules: [],
    exams: [
      {
        id: 'mock-exam-1',
        title: 'Full Mock Test 1',
        description: 'Timed full-length mock test.',
        questionCount: 100,
        duration: '90 min',
      },
      {
        id: 'mock-exam-2',
        title: 'Full Mock Test 2',
        description: 'Another full-length mock exam.',
        questionCount: 100,
        duration: '90 min',
      },
    ],
    onlineClasses: [
      {
        id: 'class-mock-1',
        title: 'Mock Test Strategy',
        description: 'How to pace yourself in full-length mocks.',
        duration: '40m 9s',
        status: 'Completed',
        videoUrl: SAMPLE_VIDEO_URL,
        instructor: 'Coach Imran',
        schedule: 'Wed, 8:00 PM',
      },
    ],
  },
  'sub-3': {
    submodules: [],
    exams: [
      {
        id: 'past-exam-1',
        title: '2022 Past Question Set',
        description: 'Complete past year paper with solutions.',
        questionCount: 80,
        duration: '60 min',
      },
    ],
    onlineClasses: [
      {
        id: 'class-past-1',
        title: 'Past Paper Walkthrough',
        description: 'Solve past questions with an instructor.',
        duration: '40m 9s',
        status: 'Not completed',
        videoUrl: SAMPLE_VIDEO_URL,
        instructor: 'Ms. L. Karim',
        schedule: 'Sat, 5:00 PM',
      },
    ],
  },
  'sub-1-2': {
    submodules: [
      {
        id: 'sub-1-2-1',
        title: 'Organic Chemistry',
        description: 'Reactions, mechanisms, and synthesis.',
      },
    ],
    exams: [],
  },
  'sub-1-2-1': {
    submodules: [],
    exams: [
      {
        id: 'chem-oc-1',
        title: 'Organic Chemistry Drill',
        description: 'Mechanisms and reaction pathways.',
        questionCount: 50,
        duration: '40 min',
      },
    ],
    onlineClasses: [
      {
        id: 'class-oc-1',
        title: 'Organic Chemistry Live Lab',
        description: 'Interactive session on reaction mechanisms.',
        duration: '40m 9s',
        status: 'Completed',
        videoUrl: SAMPLE_VIDEO_URL,
        instructor: 'Dr. P. Bose',
        schedule: 'Tue, 7:30 PM',
      },
    ],
  },
};

export const ROOT_COURSES = SUBMODULE_TREE.root?.submodules ?? [];
