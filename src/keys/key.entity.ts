export interface ApiKeyRecord {
  id: string;
  hashedKey: string;
  prefix: string;
  serviceName?: string;
  createdBy: string;
  createdAt: Date;
  expiresAt?: Date;
  revoked: boolean;
}
