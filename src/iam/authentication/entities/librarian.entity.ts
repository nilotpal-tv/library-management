import { Entity} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Librarian extends User {}
