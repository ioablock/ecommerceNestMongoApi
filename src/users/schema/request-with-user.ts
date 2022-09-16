import { User } from './user.schema';

export type RequestWithUser = Request & { user: User };
