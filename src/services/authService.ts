
import { userService } from './userService';
import { companyService } from './companyService';
import { authenticationService } from './authenticationService';

export const authService = {
  ...userService,
  ...companyService,
  ...authenticationService,
};

