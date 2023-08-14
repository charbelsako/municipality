import { ROLES } from '../models/User';
import AccessControl from './access-control';

const ac = new AccessControl();

ac.grant(ROLES.CITIZEN)
  .createOwn('document')
  .deleteOwn('document')
  .createAny('payment');

ac.grant(ROLES.ADMIN)
  .extend(ROLES.CITIZEN)
  .updateAny('document')
  .readAny('document')
  .createAny('citizen');

ac.grant(ROLES.SUPER_ADMIN).createAny('admin');

export default ac;
