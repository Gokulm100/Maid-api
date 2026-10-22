import { Gender } from '../../../schemas/user.schema';

export class ListAllAvailableMaidsDto {
  name?: string;
  gender?: Gender;
  from?: string;
  to?: string;
}
