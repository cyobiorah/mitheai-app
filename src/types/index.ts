export interface Organization {
  id: string;  // Firestore document ID
  name: string;
  description?: string;
  type: 'enterprise' | 'business' | 'startup';
  settings: {
    permissions: string[];
    maxTeams: number;
    maxUsers: number;
    features: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: string;  // Firestore document ID
  name: string;
  description?: string;
  organizationId: string;
  memberIds: string[];
  settings: {
    permissions: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface User {
  uid: string;  // Firebase Auth UID
  email: string;
  firstName: string;
  lastName: string;
  organizationId: string;
  role: 'super_admin' | 'org_owner' | 'team_manager' | 'user';
  teamIds: string[];
  status: 'pending' | 'active' | 'inactive';
  invitationToken?: string;
  settings: {
    permissions: string[];
    theme: 'light' | 'dark';
    notifications: any[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  organization: Organization | null;
  teams: Team[];
  loading: boolean;
}

export interface ContentItem {
  id: string;
  title: string;
  description?: string;
  type: 'article' | 'social_post' | 'video' | 'image' | 'document';
  url?: string;
  content: string;
  metadata: {
    source: string;
    language: string;
    tags: string[];
    customFields: Record<string, any>;
  };
  analysis: {
    sentiment?: number;
    keywords?: string[];
    categories?: string[];
    entities?: Array<{
      name: string;
      type: string;
      sentiment?: number;
    }>;
    customAnalytics?: Record<string, any>;
  };
  status: 'pending' | 'analyzed' | 'archived';
  teamId: string;
  organizationId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  analyzedAt?: string;
}

export interface ContentCollection {
  id: string;
  name: string;
  description?: string;
  teamId: string;
  organizationId: string;
  contentIds: string[];
  metadata: {
    tags: string[];
    customFields: Record<string, any>;
  };
  settings: {
    permissions: string[];
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnalysisTemplate {
  id: string;
  name: string;
  description?: string;
  type: 'sentiment' | 'classification' | 'extraction' | 'custom';
  config: {
    models: string[];
    parameters: Record<string, any>;
    preprocessors?: string[];
    postprocessors?: string[];
  };
  teamId: string;
  organizationId: string;
  settings: {
    permissions: string[];
    autoApply: boolean;
    contentTypes: ContentItem['type'][];
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
