import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <main className="h-fit w-full md:max-w-[95%] px-3 md:px-0 py-5 pb-14 lg:py-7 mx-auto no-scrollbar">
      {/* Header with back button and status */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
        <div className="space-y-2 flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" /> {/* Back button */}
          <div>
            <Skeleton className="h-8 w-64" /> {/* Wedding name */}
            <Skeleton className="h-5 w-80" /> {/* Description */}
          </div>
        </div>
        <Skeleton className="h-9 w-28 rounded-md" /> {/* Status button */}
      </div>

      <section className="w-full h-fit items-start justify-start flex flex-col gap-y-5 lg:gap-y-7">
        {/* Top 3 cards */}
        <div className="w-full h-fit grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* KnoottCardCash */}
          <div className="border p-5 space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="pt-2">
              <Skeleton className="h-8 w-full rounded-md" />
            </div>
          </div>

          {/* TotalContributionCard */}
          <div className="border p-5 space-y-3 w-full">
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="pt-2">
              <Skeleton className="h-4 w-full" />
            </div>
          </div>

          {/* TotalGuestsCard */}
          <div className="border p-5 space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="pt-2">
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>

        {/* Transaction Chart */}
        <Card>
          <CardHeader className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent className="h-[300px] w-full">
            <Skeleton className="h-full w-full rounded-md" />
          </CardContent>
        </Card>

        {/* Contribution Table */}
        <Card>
          <CardHeader className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent>
            {/* Table header */}
            <div className="border-t px-4 py-3 grid grid-cols-5 gap-4">
              <Skeleton className="h-5 w-32" /> {/* Guest */}
              <Skeleton className="h-5 w-28" /> {/* Date */}
              <Skeleton className="h-5 w-24" /> {/* Amount */}
              <Skeleton className="h-5 w-32" /> {/* Message */}
              <Skeleton className="h-5 w-24" /> {/* Status */}
            </div>

            {/* Table rows */}
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="border-t px-4 py-4 grid grid-cols-5 gap-4 items-center"
              >
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-7 w-20 rounded-full" />
              </div>
            ))}

            {/* Pagination */}
            <div className="border-t p-4 flex justify-between items-center">
              <Skeleton className="h-5 w-48" />
              <div className="flex gap-2 items-center">
                <Skeleton className="h-8 w-24" />
                <div className="flex gap-1">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Card */}
        <Card>
          <CardHeader className="space-y-2">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-80" />
          </CardHeader>
          <CardContent className="bg-sidebar">
            <div className="w-full h-fit grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white overflow-hidden border"
                >
                  <Skeleton className="h-40 w-full" /> {/* Product image */}
                  <div className="p-3 space-y-2">
                    <Skeleton className="h-4 w-16" /> {/* Brand */}
                    <Skeleton className="h-5 w-full" /> {/* Product name */}
                    <Skeleton className="h-5 w-24" /> {/* Price */}
                    <Skeleton className="h-8 w-full rounded-md" />{" "}
                    {/* Button */}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Gift Cards Card */}
        <Card>
          <CardHeader className="space-y-2">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-80" />
          </CardHeader>
          <CardContent className="bg-sidebar">
            <div className="w-full h-fit grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white overflow-hidden border"
                >
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-6 w-32" /> {/* Gift card name */}
                      <Skeleton className="h-6 w-6 rounded-full" /> {/* Icon */}
                    </div>
                    <Skeleton className="h-5 w-full" /> {/* Description */}
                    <Skeleton className="h-8 w-24" /> {/* Amount */}
                    <div className="flex justify-between items-center pt-2">
                      <Skeleton className="h-4 w-24" /> {/* Created by */}
                      <Skeleton className="h-8 w-8 rounded-full" />{" "}
                      {/* Avatar */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
