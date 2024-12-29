import React from "react";
import { Link } from "react-router-dom";
import { CompanyForm } from "../components/company";

const AddCompany = () => {
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Back
        </Link>
        <h1 className="text-3xl font-bold text-center mb-12">
          Company Details
        </h1>
        <div className="flex justify-center">
          <CompanyForm />
        </div>
      </div>
    </div>
  );
};

export default AddCompany;
