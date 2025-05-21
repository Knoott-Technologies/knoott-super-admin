import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Contribution } from "../page";
import { formatInTimeZone } from "date-fns-tz";
import { es } from "date-fns/locale";

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const WeddingDetails = ({
  contribution,
}: {
  contribution: Contribution;
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Detalles de la boda</CardTitle>
        <CardDescription>
          Aqui puedes ver los detalles de la boda que recibió la contribución.
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-sidebar flex flex-col gap-y-2">
        {contribution.wedding && (
          <>
            <div className="w-full h-fit grid grid-cols-2 gap-4 text-muted-foreground">
              <span className="w-full flex items-center justify-start">
                <p className="text-sm">Boda:</p>
              </span>
              <span className="w-full flex items-center justify-end text-foreground font-medium">
                <p className="text-sm">{contribution.wedding.name}</p>
              </span>
            </div>
            <div className="w-full h-fit grid grid-cols-2 gap-4 text-muted-foreground">
              <span className="w-full flex items-center justify-start">
                <p className="text-sm">Lugar de la boda:</p>
              </span>
              <span className="w-full flex items-center justify-end text-foreground font-medium">
                <p className="text-sm">
                  {contribution.wedding.city +
                    ", " +
                    contribution.wedding.state}
                </p>
              </span>
            </div>
            <div className="w-full h-fit grid grid-cols-2 gap-4 text-muted-foreground">
              <span className="w-full flex items-center justify-start">
                <p className="text-sm">Total:</p>
              </span>
              <span className="w-full flex items-center justify-end text-foreground font-medium">
                <p className="text-sm">
                  {formatInTimeZone(
                    contribution.wedding.wedding_date,
                    timeZone,
                    "PPP",
                    { locale: es }
                  )}
                </p>
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
