import { User } from "@/types";
import React from "react";
import { Card, CardContent, CardDescription, CardHeader } from "./ui/card";

type Props = {
  registrant: User;
};

export default function RegistrantCard({ registrant }: Props) {
  return (
    <div className="w-80">
      <Card className="w-full h-full flex flex-col bg-card">
        <CardHeader className="flex-grow-0">
          <CardDescription>{registrant.name}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p>{registrant.email}</p>
        </CardContent>
      </Card>
    </div>
  );
}
