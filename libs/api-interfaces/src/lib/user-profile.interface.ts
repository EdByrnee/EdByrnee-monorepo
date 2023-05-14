export interface IUserProfile {
  photoUrl?: string;
  id?: number;
  uuid: string;
  name: string;
  username: string;
  website: string;
  bio: string;
  story: string;
  maker: boolean;
  email: string;
  createdAt: string;
  lastSignIn: Date;
  activeDropCount: number;
  lastSetPostcode: string;
  location: string;
  userPhotos: any[];
}
