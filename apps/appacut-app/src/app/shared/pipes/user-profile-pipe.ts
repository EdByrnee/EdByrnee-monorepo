import { Pipe, PipeTransform } from '@angular/core';
import { AuthService } from '../../../core/auth';

@Pipe({
  name: 'userProfile',
  pure: true,
})
export class UserProfilePipe implements PipeTransform {
  constructor(private authService: AuthService) {}

  transform(uuid: any, args?: any): any {
    let user;
    if (uuid) {
      console.log('Searching for user with uuid: ', uuid);
      const allUsers = this.authService.allDrivers$.value;
      console.log(
        `Here are the user uuids we have: ${allUsers.map((user) => user.uuid)}`
      );

      user = allUsers.find((user) => user.uuid === uuid);
    }
    return user;
  }
}
