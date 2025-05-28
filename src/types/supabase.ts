export interface AIAnalysisResult {
  EntryId: number;
  Type: string;
  ResultJson: string;
  UserId: string;
}

export interface Achievement {
  Id: number;
  Name: string;
  Description: string;
  CriteriaKey: string;
  BadgeIconUrl?: string;
  CreateAt?: string;
  CreatedBy?: string;
  LastModified?: string;
  LastModifiedBy?: string;
  IsActive: boolean;
}

export interface Entry {
  Id: number;
  UserId: string;
  Title?: string;
  Content: Uint8Array; // Assuming bytea maps to Uint8Array or a similar type for binary data
  EntryDate: string;
  IsPasswordProtected: boolean;
  EntryPasswordHash?: string;
  SentimentScore?: number;
  DominantMoodLabel?: string;
  CreateAt?: string;
  CreatedBy?: string;
  LastModified?: string;
  LastModifiedBy?: string;
  IsActive: boolean;
}

export interface EntryTag {
  EntryId: number;
  TagId: number;
  AssignedAt: string;
}

export interface GoalUpdate {
  Id: number;
  GoalId: number;
  UserId: string;
  EntryId?: number;
  UpdateText?: string;
  ProgressMetric?: string;
  CreateAt?: string;
  CreatedBy?: string;
  LastModified?: string;
  LastModifiedBy?: string;
  IsActive: boolean;
}

export interface Goal {
  Id: number;
  UserId: string;
  Title: string;
  Description?: string;
  Status: string;
  TargetDate?: string;
  CreateAt?: string;
  CreatedBy?: string;
  LastModified?: string;
  LastModifiedBy?: string;
  IsActive: boolean;
}

export interface HabitLog {
  Id: number;
  HabitId: number;
  UserId: string;
  Status: string;
  Notes?: string;
  CreateAt?: string;
  CreatedBy?: string;
  LastModified?: string;
  LastModifiedBy?: string;
  IsActive: boolean;
}

export interface Habit {
  Id: number;
  UserId: string;
  Name: string;
  Description?: string;
  Frequency?: string;
  ColorCode?: string;
  Icon?: string;
  CreateAt?: string;
  CreatedBy?: string;
  LastModified?: string;
  LastModifiedBy?: string;
  IsActive: boolean;
}

export interface Integration {
  Id: number;
  UserId: string;
  ServiceName: string;
  AccessTokenEncrypted: Uint8Array; // Assuming bytea maps to Uint8Array
  RefreshTokenEncrypted?: Uint8Array; // Assuming bytea maps to Uint8Array
  ExternalUserId?: string;
  Scopes?: string;
  Status: string;
  CreateAt?: string;
  CreatedBy?: string;
  LastModified?: string;
  LastModifiedBy?: string;
  IsActive: boolean;
}

export interface Mood {
  EntryId: number;
  UserId: string;
  Label: string;
  Score?: number;
  Source: string;
  Notes?: string;
}

export interface Multimedia {
  Id: number;
  EntryId: number;
  UserId: string;
  StorageUrl: string;
  FileType: string;
  MimeType?: string;
  FileName?: string;
  SizeBytes?: number;
  CreateAt?: string;
  CreatedBy?: string;
  LastModified?: string;
  LastModifiedBy?: string;
  IsActive: boolean;
}

export interface Streak {
  Id: number;
  UserId: string;
  Type: string;
  RelatedHabitId?: number;
  CurrentLength: number;
  LongestLength: number;
  CreateAt?: string;
  CreatedBy?: string;
  LastModified?: string;
  LastModifiedBy?: string;
  IsActive: boolean;
}

export interface SubscriptionPlan {
  Id: number;
  PlanCode: string;
  Name: string;
  Description?: string;
  PriceMonthly?: number;
  PriceYearly?: number;
  BillingCycle?: string;
  FeatureFlags?: string;
  StripePriceId?: string;
  StripeProductId?: string;
  CreateAt?: string;
  CreatedBy?: string;
  LastModified?: string;
  LastModifiedBy?: string;
  IsActive: boolean;
}

export interface Tag {
  Id: number;
  UserId: string;
  Name: string;
  CreateAt?: string;
  CreatedBy?: string;
  LastModified?: string;
  LastModifiedBy?: string;
  IsActive: boolean;
}

export interface Template {
  Id: number;
  UserId?: string;
  Name: string;
  Content: string;
  IsPredefined: boolean;
  CreateAt?: string;
  CreatedBy?: string;
  LastModified?: string;
  LastModifiedBy?: string;
  IsActive: boolean;
}

export interface Theme {
  Id: number;
  Name: string;
  Description?: string;
  StylePropertiesJson: string;
  IsPremium: boolean;
  IsPredefined: boolean;
  CreateAt?: string;
  CreatedBy?: string;
  LastModified?: string;
  LastModifiedBy?: string;
  IsActive: boolean;
}

export interface Todo {
  Id: number;
  UserId: string;
  EntryId?: number;
  Description: string;
  IsCompleted: boolean;
  DueDate?: string;
  CompletedAt?: string;
  CreateAt?: string;
  CreatedBy?: string;
  LastModified?: string;
  LastModifiedBy?: string;
  IsActive: boolean;
}

export interface UserAchievement {
  UserId: string;
  AchievementId: number;
  EarnedAt: string;
}

export interface UserSetting {
  UserId: string;
  ThemeId?: number;
  FontPreference?: string;
  LayoutPreference?: string;
  ReminderEnabled: boolean;
  ReminderTime?: string;
  OtherSettingsJson?: string;
  UpdatedAt: string;
}

export interface UserSubscription {
  Id: number;
  UserId: string;
  PlanId: number;
  Status: string;
  StartDate: string;
  EndDate?: string;
  PaymentGatewayRef?: string;
  StripeCustomerId?: string;
  StripeSubscriptionId?: string;
  CreateAt?: string;
  CreatedBy?: string;
  LastModified?: string;
  LastModifiedBy?: string;
  IsActive: boolean;
}

export interface User {
  Id: string;
  ClerkUserId: string;
  Username?: string;
  FirstName?: string;
  LastName?: string;
  ProfileImageUrl?: string;
  StripeCustomerId?: string;
  EncryptionMasterKey?: Uint8Array; // Assuming bytea maps to Uint8Array
  IsActive: boolean;
} 