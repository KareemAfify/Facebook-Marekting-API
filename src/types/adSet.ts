export interface AdSetToCreate {
  name: string;
  dateAndTime: string;
  location: string[];
  genders: number[];
  minAge: number;
  maxAge: number;
  interests: { id: string }[];
  platforms: string[];
  facebookPositions: string[];
  instagramPositions: string[];
  campaignId: string;
}

export interface AdSetForm {
  name: string;
  dateAndTime: string;
  location: string | string[];
  genders: string | string[];
  minAge: string;
  maxAge: string;
  interests: string | string[];
  positions: string | string[];
  platforms: string | string[];
  campaignId: string;
}
