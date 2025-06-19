"use client";

import { authClient } from "@/lib/auth-client";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { OrganizationWithMemberRole } from "@/lib/prisma/organization/select";
import { Badge } from "@/components/ui/badge";

type OrgCardProps = {
  org: OrganizationWithMemberRole;
};

export default function OrgCard({ org }: OrgCardProps) {
  const router = useRouter();

  const handleClick = async (orgId: string) => {
    await authClient.organization.setActive({
      organizationId: orgId,
    });

    router.push("/application");
  };

  return (
    <Card
      className="cursor-pointer h-20 hover:shadow-md transition-shadow group"
      onClick={() => handleClick(org.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg truncate">
                {org.name} <Badge>{org.members[0].role}</Badge>
              </CardTitle>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </div>
      </CardHeader>
    </Card>
  );
}
