import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { RestApiServiceService } from '../services/rest-api.service.service';
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(RestApiServiceService);
  return auth.isLoggedIn();
};
