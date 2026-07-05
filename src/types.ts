export type MembershipGrade = 'UNPAID' | 'BRONZE' | 'SILVER' | 'GOLD' | 'VIP' | 'BLACK';

export type ContractStatus = 'NONE' | 'SIGNING' | 'SIGNED' | 'COMPLETED';

export interface UserState {
  isVerified: boolean;
  hasSignedPledge: boolean;
  name: string;
  phone: string;
  grade: MembershipGrade;
  timerSeconds: number;
  timerActive: boolean;
  isTimerExpired: boolean;
  meetingRequestedBrideId: string | null;
  contractStatus: ContractStatus;
  isPermanentlyBlocked: boolean;
}

export interface BrideProfile {
  id: string;
  name: string;
  age: number;
  height: number;
  weight: number;
  location: string;
  grade: 'BRONZE' | 'SILVER' | 'GOLD' | 'VIP';
  avatarUrl: string;
  bestPhotos: string[]; // 1 main best cut
  hiddenPhotos: string[]; // 10 more pictures
  zaloVideoUrl: string; // simulated zalo video
  verificationDocUrl: string; // simulated pdf download
  shortBio: string;
  isMeetingWithOther?: boolean;
  isMarried?: boolean;
  isNewFace?: boolean;
}

export interface SheetRow {
  index: number;
  name: string;
  phone: string;
  signUpTime: string;
  paymentTime: string;
  grade: MembershipGrade;
  contractStatus: ContractStatus;
  note: string;
}

export interface BlacklistRow {
  index: number;
  name: string;
  phone: string;
  bannedTime: string;
  reason: string;
}
