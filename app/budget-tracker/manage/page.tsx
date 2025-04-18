"use client";

import CurrencyComboBox from "@/components/CurrencyComboBox";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TransactionType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import {
  EditIcon,
  PlusSquare,
  TrashIcon,
  TrendingDown,
  TrendingUp,
  UsersIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import CreateCategoryDialog from "../_components/CreateCategoryDialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { category, user_settings } from "@prisma/client";
import DeleteCategoryDialog from "../_components/DeleteCategoryDialog";
import RemoveMemberDialog from "../_components/RemoveMemberDialog";
import { useUser } from "@clerk/nextjs";
import EditGroup from "../_components/EditGroup";
import { getUserDetails } from "../_actions/usersDetail";

const page = () => {
  return (
    <>
      <div className="border-b mx-auto bg-card px-4 sm:px-6">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 py-6 sm:py-8">
          <div className="text-center sm:text-left">
            <p className="text-2xl sm:text-3xl font-bold">
              Manage your account
            </p>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage your account settings and categories
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto flex flex-col gap-3 p-3 sm:gap-4 sm:p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Currency</CardTitle>
            <CardDescription className="text-sm">
              Set your default currency for transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CurrencyComboBox />
          </CardContent>
        </Card>

        <GroupDetails />
        <CategoryList type="income" />
        <CategoryList type="expense" />
      </div>
    </>
  );
};

export default page;

const CategoryList = ({ type }: { type: TransactionType }) => {
  const categoryQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });

  const dataAvailable = categoryQuery.data?.length > 0;

  return (
    <SkeletonWrapper isLoading={categoryQuery.isLoading}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {type === "expense" ? (
                <TrendingDown className="h-12 w-12 items-center rounded-lg p-2 text-rose-500 bg-rose-400/10 p-2" />
              ) : (
                <TrendingUp className="h-12 w-12 items-center rounded-lg p-2 text-emerald-500 bg-emerald-400/10" />
              )}
              <div>
                <p className="text-base sm:text-lg">
                  {type === "expense" ? "Expenses" : "Incomes"} categories
                </p>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Sorted by name
                </div>
              </div>
            </div>

            <CreateCategoryDialog
              type={type}
              successCallback={() => {
                categoryQuery.refetch();
              }}
              trigger={
                <Button className="gap-2 text-sm">
                  <PlusSquare className="h-4 w-4" />
                  Create Category
                </Button>
              }
            />
          </CardTitle>
        </CardHeader>
        <Separator />
        {!dataAvailable && (
          <div className="flex h-40 w-full flex-col items-center justify-center">
            <p>
              No{" "}
              <span
                className={cn(
                  "m-1",
                  type === "expense" ? "text-rose-500" : "text-emerald-500"
                )}
              >
                {type === "expense" ? "Expenses" : "Incomes"}
              </span>{" "}
              categories yet
            </p>
          </div>
        )}
        {dataAvailable && (
          <div className="grid grid-flow-row gap-2 p-2 sm:grid-flow-row sm-grid-cols-2 md: grid-cols-3 lg:grid-cols-4">
            {categoryQuery.data?.map((category: category) => (
              <CategoryCard
                key={category.name}
                category={category}
                type={type}
              />
            ))}
          </div>
        )}
      </Card>
    </SkeletonWrapper>
  );
};

export const CategoryCard = ({
  category,
  type,
}: {
  category: category;
  type: TransactionType;
}) => {
  return (
    <div className="flex border-separate flex-col justify-between rounded-md border shadow-md shadow-black/[0.1] dark:shadow-white/[0.1]">
      <div className="flex flex-col items-center gap-2 p-4">
        <span className="text-3xl" role="img">
          {category.icon}
        </span>
        <span>{category.name}</span>
      </div>
      <DeleteCategoryDialog
        category={category}
        trigger={
          <Button
            className="flex w-full border-separate items-center gap-2 rounded-t-none text-muted-foreground hover:bg-red-500/20"
            variant={"secondary"}
            disabled={category.group_id === 1}
          >
            <TrashIcon className="h-4 w-4" />
            Remove
          </Button>
        }
      />
    </div>
  );
};

const GroupDetails = () => {
  const groupQuery = useQuery({
    queryKey: ["groupMembers"],
    queryFn: () => fetch("/api/group-members").then((res) => res.json()),
  });

  const dataAvailable = groupQuery.data?.groupMembers?.length > 0;

  return (
    <SkeletonWrapper isLoading={groupQuery.isLoading}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <UsersIcon className="h-12 w-12 items-center rounded-lg p-2 text-blue-500 bg-blue-400/10" />
              <div>
                <p className="text-base sm:text-lg">Group Members</p>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Manage members in your group
                </div>
              </div>
            </div>
            <EditGroup
              successCallback={() => {
                groupQuery.refetch();
              }}
              trigger={
                <Button className="gap-2 text-sm">
                  <EditIcon className="h-4 w-4" />
                  Edit group
                </Button>
              }
            />
          </CardTitle>
        </CardHeader>
        <Separator />
        {!dataAvailable && (
          <div className="flex h-40 w-full flex-col items-center justify-center">
            <p>No group members found</p>
          </div>
        )}
        {dataAvailable && (
          <div className="grid grid-flow-row gap-2 p-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {groupQuery.data?.groupMembers?.map((member: user_settings) => (
              <MemberCard
                key={member.clerk_user_id}
                clerkUserId={member.clerk_user_id}
                isAdmin={groupQuery.data?.isAdmin ?? false}
              />
            ))}
          </div>
        )}
      </Card>
    </SkeletonWrapper>
  );
};

const MemberCard = ({
  clerkUserId,
  isAdmin,
}: {
  clerkUserId: string;
  isAdmin: boolean;
}) => {
  const [user, setUser] = useState<{
    imageUrl?: string;
    firstName?: string | null;
  } | null>(null);

  useEffect(() => {
    getUserDetails(clerkUserId).then((userDetails) => {
      setUser({
        imageUrl: userDetails?.imageUrl,
        firstName: userDetails?.firstName ?? null,
      });
    });
  }, [clerkUserId]);

  return (
    <div className="flex flex-col justify-between rounded-md border shadow-md shadow-black/[0.1] dark:shadow-white/[0.1]">
      <div className="flex flex-col items-center gap-2 p-4">
        <img
          src={user?.imageUrl || "/default-avatar.png"}
          alt={user?.firstName || "User"}
          className="h-12 w-12 rounded-full"
        />
        <span>{user?.firstName || "Unknown User"}</span>
      </div>
      <RemoveMemberDialog
        memberId={clerkUserId}
        trigger={
          <Button
            className="flex w-full items-center gap-2 rounded-t-none text-muted-foreground hover:bg-red-500/20"
            disabled={isAdmin}
          >
            <TrashIcon className="h-4 w-4" />
            Remove
          </Button>
        }
      />
    </div>
  );
};
