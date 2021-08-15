import { Document } from 'mongoose';

export interface ForgotPassword extends Document {
    email: string;
    verification: string;
    firstUsed: boolean;
    finalUsed: boolean;
    expires: Date;
    ipRequest: string;
}
