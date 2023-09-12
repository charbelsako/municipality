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
  .updateAny('document-status')
  .updateAny('document-process')
  .readAny('document')
  .readAny('user')
  .updateAny('user-status');

ac.grant(ROLES.SUPER_ADMIN)
  .extend(ROLES.ADMIN)
  .createAny('admin')
  .createAny('super admin')
  .updateAny('citizen')
  .updateAny('user')
  .updateAny('user-role')
  .readAny('user');

export default ac;
