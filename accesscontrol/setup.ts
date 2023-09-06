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
  .updateAny('document')
  .readAny('document')
  .updateAny('user')
  .readAny('user');

ac.grant(ROLES.SUPER_ADMIN)
  .extend(ROLES.ADMIN)
  .createAny('admin')
  .createAny('super admin')
  .updateAny('citizen')
  .updateAny('user')
  .readAny('user');

export default ac;
