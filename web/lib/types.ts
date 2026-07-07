export type PersonGroup = "executive" | "academic" | "advisor";

export interface SocialLinks {
  email?: string;
  instagram?: string;
  github?: string;
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
  body?: string;
  location?: string;
  date?: string;
  tags?: string[];
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

export type OpenDataSourceKind =
  | "electric"
  | "seismic"
  | "hydraulic"
  | "environmental"
  | "mobility"
  | "academic";

export type OpenDataStreamMode = "continuous" | "event" | "polling";

export type OpenDataQuality = "good" | "estimated" | "warning";

export interface OpenDataMeasurement {
  timestamp: string;
  value: number;
  quality: OpenDataQuality;
}

export interface OpenDataMetric {
  label: string;
  value: string;
  detail?: string;
}

export interface OpenDataSource {
  id: string;
  kind: OpenDataSourceKind;
  label: string;
  location: string;
  magnitude: string;
  unit: string;
  expectedFrequency: string;
  instrument: string;
}

export interface OpenDataStream {
  mode: OpenDataStreamMode;
  status: "active" | "paused" | "degraded";
  cadence: string;
  timezone: string;
  lastUpdate: string;
}

export interface OpenDataDataset {
  id: string;
  title: string;
  summary: string;
  description: string;
  tags: string[];
  source: OpenDataSource;
  stream: OpenDataStream;
  metrics: OpenDataMetric[];
  measurements: OpenDataMeasurement[];
  downloads: string[];
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  categoryName: string;
  label: string;
  supervisor: string;
}

export interface PaginatedProjects {
  projects: Project[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
