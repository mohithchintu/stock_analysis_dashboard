import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableColumn,
  Chip,
  Pagination,
} from "@nextui-org/react";

export function TransactionList({ transactions }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
      <div className="max-h-[500px] overflow-y-auto">
        {transactions.length > 0 ? (
          <Table aria-label="Transactions table">
            <TableHeader>
              <TableColumn>DATE</TableColumn>
              <TableColumn>SYMBOL</TableColumn>
              <TableColumn>TYPE</TableColumn>
              <TableColumn>QUANTITY</TableColumn>
              <TableColumn>PRICE</TableColumn>
              <TableColumn>TOTAL</TableColumn>
            </TableHeader>
            <TableBody>
              {currentTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {new Date(transaction.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{transaction.symbol}</TableCell>
                  <TableCell>
                    <Chip
                      color={transaction.type === "buy" ? "success" : "danger"}
                      variant="flat"
                    >
                      {transaction.type.toUpperCase()}
                    </Chip>
                  </TableCell>
                  <TableCell>{transaction.quantity}</TableCell>
                  <TableCell>₹ {transaction.price.toFixed(2)}</TableCell>
                  <TableCell>
                    ₹ {(transaction.quantity * transaction.price).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center py-4">
            No transactions found matching the selected filters.
          </p>
        )}
      </div>
      {transactions.length > itemsPerPage && (
        <div className="flex justify-center">
          <Pagination
            total={totalPages}
            initialPage={1}
            page={currentPage}
            onChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
