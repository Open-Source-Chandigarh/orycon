export interface LinkedInAccount {
  id: string;

  // Reference to internal user
  userId: string;

  // LinkedIn user identifier
  linkedinUserId: string;

  // OAuth tokens (to be encrypted later)
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}
