"use client";

import ClassCell from "@/components/class-cell";
import { useEffect, useState } from "react";
import LoadingCircle from "@/components/loading-circle";
import { useSession } from "next-auth/react";
import DashboardHeader from "@/components/dashboard-header";
import useTrackedSectionsStore, {
  LoadingState,
} from "@/stores/useTrackedSectionsStore";
import { CURRENT_TERM } from "@/lib/utils";
import { getLimits as getUserInfo } from "@/actions/user";
import { Role, User } from "@prisma/client";

interface UserData extends User {
  role: Role;
}

export default function Dashboard() {
  const { trackedSections, loadState, fetchSections } =
    useTrackedSectionsStore();
  const { status } = useSession();
  const [userInfo, setUserInfo] = useState<UserData | undefined>(undefined);
  const smsLimitReached =
    userInfo?.role.smsMaximum ===
    trackedSections.filter((section) => section.smsEnabled).length;

  useEffect(() => {
    if (status === "authenticated") {
      fetchSections(CURRENT_TERM ?? "202531");
      getUserInfo().then((data) => {
        if (data) {
          setUserInfo(data);
        }
      });
    }
  }, [status]);

  return (
    <>
      <DashboardHeader />

      <div className="flex flex-col lg:flex-row justify-between items-start lg:flex-wrap gap-y-4">
        {loadState !== LoadingState.FETCHING ? (
          trackedSections.length > 0 ? (
            trackedSections.map((section) => (
              <ClassCell
                key={section.crn}
                section={section.section}
                sms={section.smsEnabled}
                smsLimitReached={smsLimitReached}
              />
            ))
          ) : (
            <div className="w-full text-center font-medium">
              You aren&apos;t tracking any sections at the moment.{" "}
            </div>
          )
        ) : (
          <div className="flex justify-center items-center w-full space-y-2">
            <LoadingCircle />
          </div>
        )}
      </div>
    </>
  );
}
