import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const CardCount = ({
  count,
  title,
}: {
  count: number;
  title: string;
}) => {
  return (
    <Card className="flex flex-1 flex-col gap-y-0 items-start justify-start w-full">
      <CardHeader className="w-full shrink-0">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-0 items-start justify-end w-full h-full bg-sidebar">
        <p className="text-3xl font-semibold">{count}</p>
      </CardContent>
    </Card>
  );
};
