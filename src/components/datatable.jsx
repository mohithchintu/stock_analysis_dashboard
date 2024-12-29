// import React, { useState, useMemo } from "react";
// import {
//   Table,
//   TableHeader,
//   TableBody,
//   TableRow,
//   TableCell,
//   Button,
//   TableColumn,
// } from "@nextui-org/react";
// import { Download, ArrowUp, ArrowDown } from "lucide-react";
// import * as XLSX from "xlsx";
// import { FilterModal } from "./filter";

// export function DataTable({ companies, transactions }) {
//   const defaultFilters = {
//     symbols: [],
//     type: "any",
//     dateRange: { from: undefined, to: undefined },
//   };

//   const [filters, setFilters] = useState(defaultFilters);

//   const filteredTransactions = useMemo(() => {
//     return transactions.filter((transaction) => {
//       const symbolMatch =
//         filters.symbols.length === 0 ||
//         filters.symbols.includes(transaction.symbol);
//       const typeMatch =
//         filters.type === "any" || transaction.type === filters.type;
//       const dateMatch =
//         (!filters.dateRange.from ||
//           new Date(transaction.date) >= filters.dateRange.from) &&
//         (!filters.dateRange.to ||
//           new Date(transaction.date) <= filters.dateRange.to);

//       return symbolMatch && typeMatch && dateMatch;
//     });
//   }, [filters, transactions]);

//   const invest = (company) => {
//     const investedAmount = transactions
//       .filter(
//         (transaction) =>
//           transaction.symbol === company.symbol && transaction.type === "buy"
//       )
//       .reduce(
//         (acc, transaction) => acc + transaction.quantity * transaction.price,
//         0
//       );
//     return `Rs ${investedAmount.toFixed(2)}`;
//   };

//   const pol = (company) => {
//     const totalBought = transactions
//       .filter(
//         (transaction) =>
//           transaction.symbol === company.symbol && transaction.type === "buy"
//       )
//       .reduce(
//         (acc, transaction) => acc + transaction.quantity * transaction.price,
//         0
//       );

//     const totalSold = transactions
//       .filter(
//         (transaction) =>
//           transaction.symbol === company.symbol && transaction.type === "sell"
//       )
//       .reduce(
//         (acc, transaction) => acc + transaction.quantity * transaction.price,
//         0
//       );

//     const profitLoss = totalSold - totalBought;
//     return profitLoss;
//   };

//   const exportToExcel = () => {
//     const workbook = XLSX.utils.book_new();

//     // Companies worksheet
//     const companiesWS = XLSX.utils.json_to_sheet(companies);
//     XLSX.utils.book_append_sheet(workbook, companiesWS, "Companies");

//     // Transactions worksheet
//     const transactionsWS = XLSX.utils.json_to_sheet(filteredTransactions);
//     XLSX.utils.book_append_sheet(workbook, transactionsWS, "Transactions");

//     // Save the file
//     XLSX.writeFile(workbook, "stock-analysis.xlsx");
//   };

//   const clearFilters = () => {
//     setFilters(defaultFilters);
//   };

//   return (
//     <div className="space-y-8">
//       <div className="flex justify-between items-center">
//         <h2 className="text-xl font-bold">Portfolio Overview</h2>
//         <Button variant="solid" onPress={exportToExcel} className="ml-auto">
//           <Download className="mr-2 h-4 w-4" />
//           Export to Excel
//         </Button>
//       </div>

//       <div className="flex justify-between items-start w-full gap-x-4">
//         <div className="flex flex-col w-3/5 border p-4 rounded-lg bg-white">
//           <div className="flex justify-between items-center mb-2 border shadow-sm rounded-lg p-2">
//             <h3 className="text-lg font-semibold">Transactions</h3>
//             <div className="flex space-x-2">
//               <FilterModal
//                 symbols={[...new Set(transactions.map((t) => t.symbol))]}
//                 onFilterChange={setFilters}
//               />
//               <Button variant="bordered" onPress={clearFilters}>
//                 Clear Filters
//               </Button>
//             </div>
//           </div>
//           {filteredTransactions.length > 0 ? (
//             <Table>
//               <TableHeader>
//                 <TableColumn>DATE</TableColumn>
//                 <TableColumn>SYMBOL</TableColumn>
//                 <TableColumn>TYPE</TableColumn>
//                 <TableColumn>QUANTITY</TableColumn>
//                 <TableColumn>PRICE</TableColumn>
//                 <TableColumn>TOTAL</TableColumn>
//               </TableHeader>
//               <TableBody>
//                 {filteredTransactions.map((transaction) => (
//                   <TableRow key={transaction.id}>
//                     <TableCell>
//                       {new Date(transaction.date).toLocaleDateString()}
//                     </TableCell>
//                     <TableCell>{transaction.symbol}</TableCell>
//                     <TableCell
//                       className={
//                         transaction.type === "buy"
//                           ? "text-green-500"
//                           : "text-red-500"
//                       }
//                     >
//                       {transaction.type.toUpperCase()}
//                     </TableCell>
//                     <TableCell>{transaction.quantity}</TableCell>
//                     <TableCell>Rs {transaction.price.toFixed(2)}</TableCell>
//                     <TableCell>
//                       Rs {(transaction.quantity * transaction.price).toFixed(2)}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           ) : (
//             <p>No transactions found matching the selected filters.</p>
//           )}
//         </div>
//         <div className="flex flex-col w-2/5 p-4 border rounded-lg bg-white">
//           <h3 className="text-lg font-semibold mb-2">Companies</h3>
//           {companies.length > 0 ? (
//             <Table>
//               <TableHeader>
//                 <TableColumn>NAME</TableColumn>
//                 <TableColumn>SYMBOL</TableColumn>
//                 <TableColumn>Total Invested</TableColumn>
//                 <TableColumn>Profit/Loss</TableColumn>
//               </TableHeader>
//               <TableBody>
//                 {companies.map((company) => {
//                   const profitLoss = pol(company);
//                   return (
//                     <TableRow key={company.symbol}>
//                       <TableCell>{company.name}</TableCell>
//                       <TableCell>{company.symbol}</TableCell>
//                       <TableCell>{invest(company)}</TableCell>
//                       <TableCell
//                         className={`${
//                           profitLoss > 0 ? "text-green-500" : "text-red-500"
//                         }`}
//                       >
//                         <div className="flex items-center">
//                           {profitLoss !== 0 && (
//                             <span className="mr-2">
//                               {profitLoss > 0 ? (
//                                 <ArrowUp className="w-5 h-5" />
//                               ) : (
//                                 <ArrowDown className="w-5 h-5" />
//                               )}
//                             </span>
//                           )}
//                           <span>
//                             {profitLoss === 0
//                               ? "Rs 0.00"
//                               : profitLoss > 0
//                               ? `Rs ${profitLoss.toFixed(2)}`
//                               : `Rs ${Math.abs(profitLoss).toFixed(2)}`}
//                           </span>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           ) : (
//             <p>No company data available.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableColumn,
  Button,
  Card,
  CardBody,
  CardHeader,
  Tooltip,
} from "@nextui-org/react";
import { Download, ArrowUp, ArrowDown, Filter } from "lucide-react";
import * as XLSX from "xlsx";
import { FilterModal } from "./filter";
import { TransactionList } from "./transactiontable";
import { CompanyList } from "./companytable";

export function DataTable({ companies, transactions }) {
  const defaultFilters = {
    symbols: [],
    type: "any",
    dateRange: { from: null, to: null },
  };

  const [filters, setFilters] = useState(defaultFilters);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const symbolMatch =
        filters.symbols.length === 0 ||
        filters.symbols.includes(transaction.symbol);
      const typeMatch =
        filters.type === "any" || transaction.type === filters.type;
      const dateMatch =
        (!filters.dateRange.from ||
          new Date(transaction.date) >= new Date(filters.dateRange.from)) &&
        (!filters.dateRange.to ||
          new Date(transaction.date) <= new Date(filters.dateRange.to));

      return symbolMatch && typeMatch && dateMatch;
    });
  }, [filters, transactions]);

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const companiesWS = XLSX.utils.json_to_sheet(companies);
    XLSX.utils.book_append_sheet(workbook, companiesWS, "Companies");
    const transactionsWS = XLSX.utils.json_to_sheet(filteredTransactions);
    XLSX.utils.book_append_sheet(workbook, transactionsWS, "Transactions");
    XLSX.writeFile(workbook, "stock-analysis.xlsx");
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <div className="space-y-8 p-4 max-w-7xl mx-auto">
      <Card>
        <CardHeader className="flex justify-between items-center px-6 py-4">
          <h1 className="text-2xl font-bold text-primary">
            Portfolio Overview
          </h1>
          <Tooltip content="Export data to Excel">
            <Button
              variant="solid"
              color="primary"
              onPress={exportToExcel}
              startContent={<Download className="h-4 w-4" />}
            >
              Export
            </Button>
          </Tooltip>
        </CardHeader>
        <CardBody className="px-6 py-4">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader className="flex justify-between items-center px-6 py-4">
                <h2 className="text-xl font-semibold">Transactions</h2>
                <div className="flex space-x-2">
                  <FilterModal
                    symbols={[...new Set(transactions.map((t) => t.symbol))]}
                    onFilterChange={setFilters}
                  />
                  <Tooltip content="Clear all filters">
                    <Button
                      variant="bordered"
                      onPress={clearFilters}
                      aria-label="Clear filters"
                    >
                      clear
                    </Button>
                  </Tooltip>
                </div>
              </CardHeader>
              <CardBody className="px-6 py-4">
                <TransactionList transactions={filteredTransactions} />
              </CardBody>
            </Card>
            <Card>
              <CardHeader className="px-6 py-4">
                <h2 className="text-xl font-semibold">Companies</h2>
              </CardHeader>
              <CardBody className="px-6 py-4">
                <CompanyList
                  companies={companies}
                  transactions={transactions}
                />
              </CardBody>
            </Card>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
