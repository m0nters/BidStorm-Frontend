export interface RevieweeProfileResponse {
  id: number;
  fullName: string;
  avatarUrl?: string;
  positiveRating: number;
  negativeRating: number;
  ratingPercentage: number;
  totalRatings: number;
}
