import { DataTable } from "@/components/common/table/data-table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { columns, Transaction } from "./contribution-columns";

export const ContributionTable = ({ data }: { data: Transaction[] | null }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Contribuciones recientes</CardTitle>
        <CardDescription>
          Aquí puedes ver las contribuciones mas recientes de tu mesa de
          regalos.
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-sidebar">
        <DataTable data={data || []} columns={columns} />
      </CardContent>
    </Card>
  );
};
