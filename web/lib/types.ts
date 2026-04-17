export type PersonGroup = "executive" | "academic";

export interface SocialLinks {
  email?: string;
  instagram?: string;
  linkedin?: string;
}

export interface Person {
  id: string;
  group: PersonGroup;
  name: string;
  role: string;
  bio: string;
  photoUrl?: string;
  social: SocialLinks;
}

export interface Experience {
  id: string;
  title: string;
  summary: string;
  imageUrl?: string;
}

export interface Sponsor {
  id: string;
  name: string;
  logoUrl?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  contactName: string;
  contactEmail: string;
  tags: string[];
  challengeType: string;
  engagementLevel: string;
  imageUrl?: string;
}

export interface ChallengeCategory {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface OpenDataEntry {
  id: string;
  title: string;
  body: string;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  categoryName: string;
  label: string;
  supervisor: string;
  typeLabel: string;
  icon: "forest" | "tree" | "plant" | "germination";
}

export interface PaginatedProjects {
  projects: Project[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
