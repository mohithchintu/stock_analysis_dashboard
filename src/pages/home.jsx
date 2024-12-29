import React, { useState, useEffect } from "react";
import { DataTable } from "../components/datatable";
import { Link } from "react-router-dom";

function Home() {
  const [companies, setCompanies] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_PUBLIC_BACKEND_URL}/data`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setCompanies(data.companies || []);
        setTransactions(data.transactions || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center mb-12">
          Stock Analysis Dashboard
        </h1>

        <div className="flex justify-between items-center gap-x-4">
          <Link
            to="/analysis"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Analysis
          </Link>
          <div className="flex gap-x-4">
            <Link
              to="/add-company"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Company
            </Link>
            <Link
              to="/add-transaction"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Transaction
            </Link>
          </div>
        </div>

        <DataTable companies={companies} transactions={transactions} />
      </div>
    </div>
  );
}

export default Home;
