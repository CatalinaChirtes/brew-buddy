// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrlUsers: 'http://127.0.0.1:5000/api/users',
  apiUrlUser: 'http://127.0.0.1:5000/api/user',
  apiUrlUpdateUser: 'http://127.0.0.1:5000/api/user/update',
  apiUrlTeas: 'http://127.0.0.1:5000/api/teas',
  apiUrlTea: 'http://127.0.0.1:5000/api/tea',
  apiUrlFavouritesTea: 'http://127.0.0.1:5000/api/tea/favourites',
  apiUrlEditFavouritesTea: 'http://127.0.0.1:5000/api/tea/favourites/edit',
  apiUrlOwnedTea: 'http://127.0.0.1:5000/api/tea/owned',
  apiUrlEditOwnedTea: 'http://127.0.0.1:5000/api/tea/owned/edit',
  apiUrlOwnedFavouritesTea: 'http://127.0.0.1:5000/api/tea/owned_favourites',
  apiUrlLogin: 'http://127.0.0.1:5000/api/login',
  apiUrlLogout: 'http://127.0.0.1:5000/api/logout',
  apiUrlSignup: 'http://127.0.0.1:5000/api/signup'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
