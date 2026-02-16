'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

interface User {
  id: string;
  email: string;
  role: string;
}

export function UserManagementClient({ mainUsers: initialMainUsers, guestUsers: initialGuestUsers }: { mainUsers: User[], guestUsers: User[] }) {
  const t = useTranslations('dashboard');
  const [mainUsers, setMainUsers] = useState<User[]>(initialMainUsers);
  const [guestUsers, setGuestUsers] = useState<User[]>(initialGuestUsers);
  const [mainSearchTerm, setMainSearchTerm] = useState('');
  const [guestSearchTerm, setGuestSearchTerm] = useState('');

  // Filter main users based on search term
  const filteredMainUsers = mainUsers.filter(user =>
    user.email.toLowerCase().includes(mainSearchTerm.toLowerCase())
  );

  // Filter guest users based on search term
  const filteredGuestUsers = guestUsers.filter(user =>
    user.email.toLowerCase().includes(guestSearchTerm.toLowerCase())
  );

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      // In a real application, this would be an API call to update the user role
      const response = await fetch('/api/admin/users/update-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          role: newRole,
        }),
      });

      // Check if the response is JSON or HTML
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        if (response.ok && result.success) {
          // Update the local state - check if it's a main or guest user
          if (mainUsers.some(user => user.id === userId)) {
            setMainUsers(mainUsers.map(user =>
              user.id === userId ? { ...user, role: newRole } : user
            ));
          } else if (guestUsers.some(user => user.id === userId)) {
            setGuestUsers(guestUsers.map(user =>
              user.id === userId ? { ...user, role: newRole } : user
            ));
          }
          toast.success(`${t('roleUpdatedTo')} ${newRole} ${t('forUser')} ${(mainUsers.concat(guestUsers)).find(u => u.id === userId)?.email}`);
        } else {
          throw new Error(result.error || 'Failed to update user role');
        }
      } else {
        // If it's not JSON, it might be an HTML error page
        const textResponse = await response.text();
        console.error('Non-JSON response:', textResponse);
        throw new Error(`Server responded with non-JSON content: Status ${response.status}`);
      }
    } catch (error: any) {
      console.error('Error updating user role:', error);
      // Check if it's a specific error about parsing JSON
      if (error.message && error.message.includes('Unexpected token')) {
        toast.error(`${t('roleUpdateError')}: Server returned an unexpected response`);
      } else {
        toast.error(`${t('roleUpdateError')}: ${error.message || 'Unknown error'}`);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('userManagement')}</CardTitle>
        <CardDescription>{t('manageUserRoles')}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Main Users Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">{t('mainUsers')}</h3>
          <div className="mb-3">
            <Input
              placeholder={t('searchMainUsers')}
              value={mainSearchTerm}
              onChange={(e) => setMainSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="space-y-3">
            {filteredMainUsers.length > 0 ? (
              filteredMainUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-sm text-muted-foreground">{t('userId', { id: user.id.substring(0, 8) })}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={user.role}
                      onValueChange={(value) => updateUserRole(user.id, value)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">{t('userRole')}</SelectItem>
                        <SelectItem value="admin">{t('adminRole')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">{t('noMainUsersFound')}</p>
            )}
          </div>
        </div>

        {/* Guest Users Section */}
        <div>
          <h3 className="text-lg font-semibold mb-3">{t('guestUsers')}</h3>
          <div className="mb-3">
            <Input
              placeholder={t('searchGuestUsers')}
              value={guestSearchTerm}
              onChange={(e) => setGuestSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="space-y-3">
            {filteredGuestUsers.length > 0 ? (
              filteredGuestUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-sm text-muted-foreground">{t('userId', { id: user.id.substring(0, 8) })}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={user.role}
                      onValueChange={(value) => updateUserRole(user.id, value)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">{t('userRole')}</SelectItem>
                        <SelectItem value="admin">{t('adminRole')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">{t('noGuestUsersFound')}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}