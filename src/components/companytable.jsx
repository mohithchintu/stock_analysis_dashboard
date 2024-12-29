import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableColumn,
  Tooltip,
} from "@nextui-org/react";
import { ArrowUp, ArrowDown } from "lucide-react";

export function CompanyList({ companies, transactions }) {
  const invest = (company) => {
    const investedAmount = transactions
      .filter(
        (transaction) =>
          transaction.symbol === company.symbol && transaction.type === "buy"
      )
      .reduce(
        (acc, transaction) => acc + transaction.quantity * transaction.price,
        0
      );
    return `₹ ${investedAmount.toFixed(2)}`;
  };

  const pol = (company) => {
    const totalBought = transactions
      .filter(
        (transaction) =>
          transaction.symbol === company.symbol && transaction.type === "buy"
      )
      .reduce(
        (acc, transaction) => acc + transaction.quantity * transaction.price,
        0
      );

    const totalSold = transactions
      .filter(
        (transaction) =>
          transaction.symbol === company.symbol && transaction.type === "sell"
      )
      .reduce(
        (acc, transaction) => acc + transaction.quantity * transaction.price,
        0
      );

    return totalSold - totalBought;
  };

  return (
    <div className="max-h-[600px] overflow-y-auto">
      {companies.length > 0 ? (
        <Table aria-label="Companies table">
          <TableHeader>
            <TableColumn>NAME</TableColumn>
            <TableColumn>SYMBOL</TableColumn>
            <TableColumn>TOTAL INVESTED</TableColumn>
            <TableColumn>PROFIT/LOSS</TableColumn>
          </TableHeader>
          <TableBody>
            {companies.map((company) => {
              const profitLoss = pol(company);
              return (
                <TableRow key={company.symbol}>
                  <TableCell>{company.name}</TableCell>
                  <TableCell>{company.symbol}</TableCell>
                  <TableCell>{invest(company)}</TableCell>
                  <TableCell>
                    <Tooltip
                      content={`${
                        profitLoss > 0 ? "Profit" : "Loss"
                      }: ₹ ${Math.abs(profitLoss).toFixed(2)}`}
                    >
                      <div
                        className={`flex items-center ${
                          profitLoss > 0
                            ? "text-success"
                            : profitLoss < 0
                            ? "text-danger"
                            : ""
                        }`}
                      >
                        {profitLoss !== 0 && (
                          <span className="mr-2">
                            {profitLoss > 0 ? (
                              <ArrowUp className="w-4 h-4" />
                            ) : (
                              <ArrowDown className="w-4 h-4" />
                            )}
                          </span>
                        )}
                        <span>
                          {profitLoss === 0
                            ? "₹ 0.00"
                            : `₹ ${Math.abs(profitLoss).toFixed(2)}`}
                        </span>
                      </div>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <p className="text-center py-4">No company data available.</p>
      )}
    </div>
  );
}
