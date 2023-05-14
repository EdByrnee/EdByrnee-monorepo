import { IMessage } from "./message.interface";
import { IUserProfile } from "./user-profile.interface";

export interface IMessageThread{
    id?: number;
    uuid: string;
    participant1UserUuid: string;
    participant2UserUuid: string;
    participant?: IUserProfile;
    threadLatestRead: boolean;
    threadLatestMessageAt: string;
    createdAt?: string;
    updatedAt?: string;
    messages: IMessage[];
}