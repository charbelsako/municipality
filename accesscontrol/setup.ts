import { ROLES } from '../models/User';
import AccessControl from './access-control';

const ac = new AccessControl();

ac.grant(ROLES.CITIZEN)
  .createOwn('document')
  .deleteOwn('document')
  .updateOwn('document')
  .readOwn('document')
  .updateOwn('citizen')
  .createAny('payment');

ac.grant(ROLES.ADMIN)
  .extend(ROLES.CITIZEN)
  .updateAny('document')
  .readAny('document')
  .createAny('citizen')
  // .updateAny('citizen')
  .readAny('citizen');

ac.grant(ROLES.SUPER_ADMIN)
  .extend(ROLES.ADMIN)
  .createAny('admin')
  .updateAny('citizen');

export default ac;
