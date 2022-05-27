export interface IUsersService {
  filterExistingUsers(usersToFilter: number[]): Promise<number[]>;
}