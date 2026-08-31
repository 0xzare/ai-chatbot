"use client";

import { useRouter } from "next/navigation";
import { memo } from "react";
import { useWindowSize } from "usehooks-ts";
import { useTranslations, useLocale } from "next-intl";
import { SidebarToggle } from "@/components/sidebar-toggle";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "./icons";
import { useSidebar } from "./ui/sidebar";
import { LanguageSwitcher } from "./language-switcher";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { isAdminUserRole } from "@/lib/admin";

function PureChatHeader({
  chatId,
  selectedVisibilityType,
  isReadonly,
}: {
  chatId: string;
  selectedVisibilityType: string;
  isReadonly: boolean;
}) {
  const router = useRouter();
  const { open } = useSidebar();
  const t = useTranslations("chat");
  const locale = useLocale();
  const isRTL = locale === "fa";

  const { width: windowWidth } = useWindowSize();
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true); // حالا می‌دانیم در کلاینت هستیم
  }, []);
  if (!isClient) {
    return <div className="placeholder">در حال بارگذاری...</div>;
  }
  return (
    <header className="sticky top-0 flex items-center gap-2 bg-background px-2 py-1.5 md:px-2">
      <SidebarToggle />

      {(!open || windowWidth < 768) && (
        <Button
          className="order-2 ml-auto h-8 px-2 md:order-1 md:ml-0 md:h-fit md:px-2"
          onClick={() => {
            router.push("/");
            router.refresh();
          }}
          variant="outline"
        >
          <PlusIcon />
          <span className="md:sr-only">{t("newChat")}</span>
        </Button>
      )}

      <div className={isRTL ? "mr-auto flex items-center gap-2" : "ml-auto flex items-center gap-2"}>
        <LanguageSwitcher />
        {isClient && (
          <DashboardButton isRTL={isRTL} />
        )}
      </div>
    </header>
  );
}

function DashboardButton({ isRTL }: { isRTL: boolean }) {
  const { data: session } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("chat");

  if (!isAdminUserRole(session?.user?.role)) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => router.push(`/${locale}/dashboard`)}
    >
      <span>{t("dashboard")}</span>
    </Button>
  );
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  return (
    prevProps.chatId === nextProps.chatId &&
    prevProps.selectedVisibilityType === nextProps.selectedVisibilityType &&
    prevProps.isReadonly === nextProps.isReadonly
  );
});
