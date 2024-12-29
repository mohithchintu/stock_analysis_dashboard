import { useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

const data = {
  companies: [
    {
      name: "Apple Inc.",
      symbol: "AAPL",
    },
    {
      name: "Microsoft Corporation",
      symbol: "MSFT",
    },
    {
      name: "Tesla, Inc.",
      symbol: "TSLA",
    },
    {
      name: "Amazon.com, Inc.",
      symbol: "AMZN",
    },
    {
      name: "Alphabet Inc.",
      symbol: "GOOGL",
    },
    {
      name: "Meta Platforms, Inc.",
      symbol: "META",
    },
    {
      name: "NVIDIA Corporation",
      symbol: "NVDA",
    },
    {
      name: "Berkshire Hathaway Inc.",
      symbol: "BRK.A",
    },
    {
      name: "Johnson & Johnson",
      symbol: "JNJ",
    },
    {
      name: "Walmart Inc.",
      symbol: "WMT",
    },
  ],
  transactions: [
    {
      date: "2024-03-01",
      symbol: "AAPL",
      type: "buy",
      quantity: 150,
      price: 40,
    },
    {
      date: "2024-03-15",
      symbol: "AAPL",
      type: "sell",
      quantity: 150,
      price: 42,
    },
    {
      date: "2024-12-28",
      symbol: "MSFT",
      type: "buy",
      quantity: 4,
      price: 200,
    },
    {
      date: "2024-12-28",
      symbol: "TSLA",
      type: "sell",
      quantity: 40,
      price: 30,
    },
    {
      date: "2024-12-28",
      symbol: "GOOGL",
      type: "sell",
      quantity: 44,
      price: 56,
    },
    {
      date: "2024-12-28",
      symbol: "META",
      type: "buy",
      quantity: 100,
      price: 150,
    },
    {
      date: "2024-12-28",
      symbol: "NVDA",
      type: "sell",
      quantity: 50,
      price: 200,
    },
    {
      date: "2024-12-28",
      symbol: "BRK.A",
      type: "buy",
      quantity: 5,
      price: 500000,
    },
    {
      date: "2024-12-28",
      symbol: "JNJ",
      type: "sell",
      quantity: 20,
      price: 160,
    },
    {
      date: "2024-12-28",
      symbol: "WMT",
      type: "buy",
      quantity: 10,
      price: 140,
    },
    {
      date: "2024-12-29",
      symbol: "AMZN",
      type: "buy",
      quantity: 60,
      price: 180,
    },
    {
      date: "2024-12-29",
      symbol: "TSLA",
      type: "buy",
      quantity: 10,
      price: 230,
    },
    {
      date: "2024-12-29",
      symbol: "GOOGL",
      type: "buy",
      quantity: 15,
      price: 2500,
    },
    {
      date: "2024-12-29",
      symbol: "AAPL",
      type: "sell",
      quantity: 50,
      price: 145,
    },
    {
      date: "2024-12-29",
      symbol: "META",
      type: "sell",
      quantity: 30,
      price: 155,
    },
  ],
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend
);

export default function Analysis() {
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [transactionType, setTransactionType] = useState("all");

  // Filter transactions based on selections
  const filteredTransactions = useMemo(() => {
    return data.transactions.filter((transaction) => {
      const companyMatch =
        selectedCompany === "all" || transaction.symbol === selectedCompany;
      const typeMatch =
        transactionType === "all" || transaction.type === transactionType;
      return companyMatch && typeMatch;
    });
  }, [data.transactions, selectedCompany, transactionType]);

  // Calculate totals for filtered transactions
  const calculateTotals = () => {
    let investedValue = 0;
    let totalReturns = 0;

    filteredTransactions.forEach((transaction) => {
      const amount = transaction.quantity * transaction.price;
      if (transaction.type === "buy") {
        investedValue += amount;
      } else {
        totalReturns += amount;
      }
    });

    return { investedValue, totalReturns };
  };

  const { investedValue, totalReturns } = calculateTotals();
  const returnPercentage = (
    ((totalReturns - investedValue) / investedValue) *
    100
  ).toFixed(2);

  // Company performance metrics
  const companyMetrics = useMemo(() => {
    const metrics = {};
    data.companies.forEach((company) => {
      const companyTransactions = data.transactions.filter(
        (t) => t.symbol === company.symbol
      );
      let buyTotal = 0;
      let sellTotal = 0;

      companyTransactions.forEach((t) => {
        const amount = t.quantity * t.price;
        if (t.type === "buy") buyTotal += amount;
        else sellTotal += amount;
      });

      metrics[company.symbol] = {
        invested: buyTotal,
        returns: sellTotal,
        profit: sellTotal - buyTotal,
        profitPercentage: buyTotal
          ? (((sellTotal - buyTotal) / buyTotal) * 100).toFixed(2)
          : 0,
      };
    });
    return metrics;
  }, [data]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full border rounded-md p-2 bg-white"
            >
              <option value="all">All Companies</option>
              {data.companies.map((company) => (
                <option key={company.symbol} value={company.symbol}>
                  {company.name} ({company.symbol})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction Type
            </label>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              className="w-full border rounded-md p-2 bg-white"
            >
              <option value="all">All Types</option>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Range
            </label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full border rounded-md p-2 bg-white"
            >
              <option value="7d">Last 7 days</option>
              <option value="1m">Last month</option>
              <option value="3m">Last 3 months</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-gray-600 text-sm">Invested Value</p>
          <p className="text-2xl font-bold">
            ${investedValue.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-gray-600 text-sm">Total Returns</p>
          <p className="text-2xl font-bold">${totalReturns.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-gray-600 text-sm">Net Profit/Loss</p>
          <p
            className={`text-2xl font-bold ${
              totalReturns - investedValue >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            ${(totalReturns - investedValue).toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-gray-600 text-sm">Return Rate</p>
          <p
            className={`text-2xl font-bold ${
              returnPercentage >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {returnPercentage}%
          </p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Symbol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.symbol}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.type === "buy"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${transaction.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    $
                    {(
                      transaction.quantity * transaction.price
                    ).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Company Performance Cards */}
      {selectedCompany === "all" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.companies.map((company) => {
            const metrics = companyMetrics[company.symbol];
            return (
              <div
                key={company.symbol}
                className="bg-white p-4 rounded-lg shadow-sm"
              >
                <h3 className="font-semibold text-lg mb-2">
                  {company.name} ({company.symbol})
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Invested</p>
                    <p className="font-bold">
                      ${metrics.invested.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Returns</p>
                    <p className="font-bold">
                      ${metrics.returns.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Profit/Loss</p>
                    <p
                      className={`font-bold ${
                        metrics.profit >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      ${metrics.profit.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Return Rate</p>
                    <p
                      className={`font-bold ${
                        metrics.profitPercentage >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {metrics.profitPercentage}%
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
