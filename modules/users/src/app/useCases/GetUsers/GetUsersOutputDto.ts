export type GetUsersOutputDto = {
  users: User[];
};

type User = {
  id: number;
  email: string;
};
