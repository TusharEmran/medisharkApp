export type EnrolledCourse = {
  id: number;
  title: string;
  batch: string;
  enrolledOn: string;
};

export type UserProfile = {
  id: string;
  name: string;
  initials: string;
  userId: string;
  mainBatch: string;
  admissionYear: number;
  enrolledCourses: EnrolledCourse[];
  verified: boolean;
  mobile?: string;
  medicalCollege?: string;
  session?: string;
  avatarUrl?: string;
};

let mockProfile: UserProfile = {
  id: "u1",
  name: "Chirley Nelson",
  initials: "CN",
  userId: "ID: MED-2025-0182",
  mainBatch: "MBBS Admission Batch 2025",
  admissionYear: 2025,
  verified: true,
  mobile: "01700000000",
  medicalCollege: "Dhaka Medical College",
  session: "2024-2025",
  enrolledCourses: [
    {
      id: 1,
      title: "Medical Admission (MBBS)",
      batch: "Batch 2025",
      enrolledOn: "Enrolled: 12 Mar 2025",
    },
    {
      id: 2,
      title: "Engineering Admission (BUET & Public)",
      batch: "Batch 2025",
      enrolledOn: "Enrolled: 02 Feb 2025",
    },
    {
      id: 3,
      title: "University Admission (GST + Public Varsity)",
      batch: "Batch 2024",
      enrolledOn: "Enrolled: 20 Nov 2024",
    },
  ],
};

export const getUserProfile = async (): Promise<UserProfile> => {
  // Later: replace with real GET /user/profile
  return mockProfile;
};

export const createUserProfile = async (
  profile: UserProfile,
): Promise<UserProfile> => {
  // Later: replace with real POST /user/profile
  mockProfile = profile;
  return mockProfile;
};

export const updateUserProfile = async (
  updates: Partial<UserProfile>,
): Promise<UserProfile> => {
  // Later: replace with real PUT /user/profile
  mockProfile = { ...mockProfile, ...updates };
  return mockProfile;
};