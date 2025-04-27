import React, { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { IColor, IOverviewCard } from "@/types";
import { cn } from "@/lib/utils";

const OverviewCard: FC<IOverviewCard> = ({ color = "green", ...props }) => {
  const colors: Record<IColor, Record<string, string>> = {
    cyan: {
      bg: "bg-cyan-200",
      color: "text-cyan-600",
    },
    green: {
      bg: "bg-green-200",
      color: "text-green-600",
    },
    purple: {
      bg: "bg-purple-200",
      color: " text-purple-600",
    },
    red: {
      bg: "bg-red-200",
      color: "text-red-600",
    },
  };

  return (
    <Card className="bg-accent-foreground rounded-sm py-4 text-accent gap-3">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="font-medium text-xl">{props.title}</CardTitle>
        <div
          className={cn(
            "p-2 rounded-md",
            colors[color]["bg"],
            colors[color]["color"]
          )}
        >
          <props.icon size={18} />
        </div>
      </CardHeader>
      <CardContent
        className={cn("pt-1 font-extrabold text-3xl", colors[color]["color"])}
      >
        {props.value}
      </CardContent>
      <CardFooter className="py-0">
        <CardDescription className="flex items-center gap-1">
          <h2>{props.completed}</h2>
          Completed
        </CardDescription>
      </CardFooter>
    </Card>
  );
};

export default OverviewCard;
