export interface Plan {
  code: string;
  name: string;
  maxDictionaries: number;
  maxWordsPerDict: number;
  priceCents: number;
  isActive: boolean;
}

export interface Product {
  courseId: number;
  title: string;
  priceCents: number | null;
  currency: string;
  isFree: boolean;
  isActive: boolean;
}

export interface UserSubscription {
  userId: string;
  planCode: string;
  status: string;
  startedAt: string;
  expiresAt: string | null;
}

export interface CoursePurchase {
  id: number;
  userId: string;
  courseId: number;
  priceCents: number;
  purchasedAt: string;
}

export interface Access {
  courseId: number;
  hasAccess: boolean;
}

export interface UpsertPlanDto {
  code: string;
  name: string;
  maxDictionaries: number;
  maxWordsPerDict: number;
  priceCents: number;
  isActive?: boolean;
}

export interface UpdatePlanDto {
  name: string;
  maxDictionaries: number;
  maxWordsPerDict: number;
  priceCents: number;
  isActive?: boolean;
}

export interface SetProductPriceDto {
  priceCents: number;
  currency?: string;
  isActive?: boolean;
}
