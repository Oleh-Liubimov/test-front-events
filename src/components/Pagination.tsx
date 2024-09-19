import React from "react";
import {
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  Pagination,
} from "./ui/pagination";
import { EventsResponse } from "@/types";

type Props = {
  handlePageChange: (page: number) => void;
  page: number;
  data?: EventsResponse;
};

export default function PaginationComponent({
  data,
  handlePageChange,
  page,
}: Props) {
  return (
    <Pagination className="my-5">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-disabled={page <= 1}
            tabIndex={page <= 1 ? -1 : undefined}
            className={page <= 1 ? "pointer-events-none opacity-50" : undefined}
            onClick={() => handlePageChange(page - 1)}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            href="#"
            aria-disabled={data?.hasMore === false}
            tabIndex={page <= 1 ? -1 : undefined}
            className={
              data?.hasMore === false
                ? "pointer-events-none opacity-50"
                : undefined
            }
            onClick={() => handlePageChange(page + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
