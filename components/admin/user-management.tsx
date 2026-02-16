import { UserManagementClient } from './user-management-client';

interface User {
  id: string;
  email: string;
  role: string;
}

export function UserManagement({ users }: { users: User[] }) {
  return (
    <UserManagementClient users={users} />
  );
}