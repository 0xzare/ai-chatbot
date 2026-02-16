import { UserManagementClient } from './user-management-client';

interface User {
  id: string;
  email: string;
  role: string;
}

export function UserManagement({ mainUsers, guestUsers }: { mainUsers: User[], guestUsers: User[] }) {
  return (
    <UserManagementClient mainUsers={mainUsers} guestUsers={guestUsers} />
  );
}