import { Gender } from '../../../schemas/user.schema';

export class ListAllAvailableMaidsDto {
  name?: string;
  gender?: Gender;
  /** Optional; accepted for clients that send a window — listing uses Maid userType only. */
  from?: string;
  to?: string;
}
