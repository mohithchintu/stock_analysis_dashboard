import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Pagination,
  Spinner,
} from "@nextui-org/react";
import { LineChart, Edit, Trash2, Search } from "lucide-react";

export function TransactionForm() {
  const [formData, setFormData] = useState({
    symbol: "",
    type: "",
    quantity: 0,
    price: 0,
    date: new Date().toISOString().split("T")[0],
  });

  const [companies, setCompanies] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [companiesRes, transactionsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_PUBLIC_BACKEND_URL}/companies`),
        fetch(`${import.meta.env.VITE_PUBLIC_BACKEND_URL}/transactions`),
      ]);

      if (!companiesRes.ok || !transactionsRes.ok) {
        throw new Error("Failed to fetch data");
      }

      setCompanies(await companiesRes.json());
      setTransactions(await transactionsRes.json());
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_BACKEND_URL}/add-transaction`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to save transaction");

      resetForm();
      await fetchData();
    } catch (err) {
      setError(err.message || "An error occurred while saving");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index) => {
    const g_index = (page - 1) * rowsPerPage + index;
    const transaction = transactions[g_index];
    setFormData({
      symbol: transaction.symbol,
      type: transaction.type,
      quantity: transaction.quantity,
      price: transaction.price,
      date: transaction.date,
    });
    setEditingIndex(g_index);
  };

  const handleDelete = async (index) => {
    const g_index = (page - 1) * rowsPerPage + index;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_BACKEND_URL}/delete-transaction`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ g_index }),
        }
      );

      if (!response.ok) throw new Error("Failed to delete transaction");

      await fetchData();
    } catch (err) {
      setError(err.message || "An error occurred while deleting");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      symbol: "",
      type: "",
      quantity: 0,
      price: 0,
      date: new Date().toISOString().split("T")[0],
    });
  };

  const paginatedTransactions = transactions.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto space-y-6">
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <LineChart className="w-6 h-6" />
          <h2 className="text-xl font-bold">
            {editingIndex !== null ? "Edit Transaction" : "Add Transaction"}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between items-center gap-x-4">
            <Select
              label="Stock Company"
              value={formData.symbol}
              onChange={(e) =>
                setFormData({ ...formData, symbol: e.target.value })
              }
              required
            >
              {companies.map((company) => (
                <SelectItem key={company.symbol} value={company.symbol}>
                  {`${company.symbol} - ${company.name}`}
                </SelectItem>
              ))}
            </Select>
            <Select
              label="Transaction Type"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              required
            >
              <SelectItem key="buy" value="buy">
                Buy
              </SelectItem>
              <SelectItem key="sell" value="sell">
                Sell
              </SelectItem>
            </Select>
          </div>
          <div className="flex justify-between items-center gap-x-4">
            <Input
              label="Quantity"
              type="tel"
              value={formData.quantity || ""}
              onChange={(e) =>
                setFormData({ ...formData, quantity: Number(e.target.value) })
              }
              required
            />
            <Input
              label="Price per Share"
              type="tel"
              value={formData.price || ""}
              onChange={(e) =>
                setFormData({ ...formData, price: Number(e.target.value) })
              }
              required
            />
          </div>
          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
          <Button
            color="primary"
            type="submit"
            isLoading={loading}
            className="w-full"
          >
            {editingIndex !== null ? "Update Transaction" : "Add Transaction"}
          </Button>
        </form>
      </Card>
      <Card className="p-6">
        <CardHeader className="flex justify-between items-center">
          <p className="text-xl font-bold">Transactions</p>
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startContent={<Search className="text-default-400" />}
            className="w-64"
          />
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="flex justify-center">
              <Spinner size="lg" />
            </div>
          ) : paginatedTransactions.length === 0 ? (
            <div className="text-center text-gray-500">
              No transactions found.
            </div>
          ) : (
            <Table
              aria-label="Transaction Table"
              css={{
                height: "auto",
                minWidth: "100%",
              }}
            >
              <TableHeader>
                <TableColumn>Symbol</TableColumn>
                <TableColumn>Type</TableColumn>
                <TableColumn>Quantity</TableColumn>
                <TableColumn>Price</TableColumn>
                <TableColumn>Date</TableColumn>
                <TableColumn>Actions</TableColumn>
              </TableHeader>
              <TableBody>
                {paginatedTransactions.map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell>{transaction.symbol}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>{transaction.quantity}</TableCell>
                    <TableCell>{transaction.price}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell className="flex justify-center space-x-2">
                      <Button
                        size="sm"
                        color="primary"
                        onPress={() => handleEdit(index)}
                      >
                        <Edit size={16} className="text-white" />
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        onPress={() => handleDelete(index)}
                      >
                        <Trash2 size={16} className="text-white" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <div className="flex justify-center mt-4">
            <Pagination
              total={Math.ceil(transactions.length / rowsPerPage)}
              page={page}
              onChange={(value) => setPage(value)}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
