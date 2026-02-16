import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/app/(auth)/auth";
import { StatsBarChart } from "@/components/admin/stats-chart";
import { UserManagement } from "@/components/admin/user-management";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isAdminUserRole } from "@/lib/admin";
import { getChatsCount, getMessagesCount, getUsers } from "@/lib/db/queries";

export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard" });

  // Check if user is authenticated and is an admin
  const session = await auth();

  if (!session || !isAdminUserRole(session.user.role)) {
    redirect("/"); // Redirect non-admin users
  }

  // Fetch statistics
  const allUsers = await getUsers();
  const mainUsers = await getUsers(false); // Non-guest users
  const guestUsers = await getUsers(true); // Guest users
  const chatsCount = await getChatsCount();
  const messagesCount = await getMessagesCount();

  // Prepare data for charts
  const statsData = [
    { name: t("users"), value: allUsers.length },
    { name: t("chats"), value: Number(chatsCount) },
    { name: t("messages"), value: Number(messagesCount) },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <Link href={`/${locale}`}>
          <Button>{t("goToChat")}</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("totalUsers")}
            </CardTitle>
            <svg
              className="h-6 w-6 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allUsers.length}</div>
            <p className="text-xs text-muted-foreground">{t("growthUsers")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("totalChats")}
            </CardTitle>
            <svg
              className="h-6 w-6 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Number(chatsCount)}</div>
            <p className="text-xs text-muted-foreground">{t("growthChats")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("totalMessages")}
            </CardTitle>
            <svg
              className="h-6 w-6 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Number(messagesCount)}</div>
            <p className="text-xs text-muted-foreground">
              {t("growthMessages")}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>{t("platformStats")}</CardTitle>
          </CardHeader>
          <CardContent>
            <StatsBarChart data={statsData} />
          </CardContent>
        </Card>

        <UserManagement
          guestUsers={guestUsers.map((u) => ({
            id: u.id,
            email: u.email,
            role: u.role,
          }))}
          mainUsers={mainUsers.map((u) => ({
            id: u.id,
            email: u.email,
            role: u.role,
          }))}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("systemInfo")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">{t("environment")}</h3>
                <ul className="text-sm space-y-1">
                  <li>
                    <span className="font-medium">{t("mode")}:</span>{" "}
                    {process.env.NODE_ENV || "development"}
                  </li>
                  <li>
                    <span className="font-medium">{t("database")}:</span>{" "}
                    PostgreSQL
                  </li>
                  <li>
                    <span className="font-medium">{t("authentication")}:</span>{" "}
                    NextAuth.js
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">{t("applicationInfo")}</h3>
                <ul className="text-sm space-y-1">
                  <li>
                    <span className="font-medium">{t("version")}:</span> 3.1.0
                  </li>
                  <li>
                    <span className="font-medium">{t("framework")}:</span>{" "}
                    Next.js 16
                  </li>
                  <li>
                    <span className="font-medium">{t("uiLibrary")}:</span>{" "}
                    shadcn/ui
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("recentActivity")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{t("newUserRegistered")}</p>
                  <p className="text-sm text-muted-foreground">
                    john@example.com
                  </p>
                </div>
                <Badge variant="secondary">{t("twoHoursAgo")}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{t("newChatCreated")}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("projectDiscussion")}
                  </p>
                </div>
                <Badge variant="secondary">{t("fiveHoursAgo")}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{t("systemUpdate")}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("aiModelUpdated")}
                  </p>
                </div>
                <Badge variant="secondary">{t("oneDayAgo")}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
