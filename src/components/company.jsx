import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Card,
  CardHeader,
  CardBody,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Tooltip,
} from "@nextui-org/react";
import { Building2, Edit, Trash2, Search } from "lucide-react";

export function CompanyForm() {
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
  });
  const [companies, setCompanies] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteIndex, setDeleteIndex] = useState(null);
  const rowsPerPage = 5;

  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_BACKEND_URL}/companies`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch companies");
      }
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (index) => {
    setIsLoading(true);
    const org_index = (page - 1) * rowsPerPage + index;
    console.log(org_index);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_BACKEND_URL}/delete-company`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ index: org_index }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete company");
      }
      await fetchCompanies();
    } catch (error) {
      console.error("Error deleting company:", error);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  const handleEdit = (index) => {
    const g_index = (page - 1) * rowsPerPage + index;
    const company = companies[g_index];
    setFormData({ name: company.name, symbol: company.symbol });
    setEditIndex(g_index);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editIndex !== null) {
        const response = await fetch(
          `${import.meta.env.VITE_PUBLIC_BACKEND_URL}/update-company`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              index: editIndex,
              updatedCompany: { ...formData },
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update company");
        }
      } else {
        const response = await fetch(
          `${import.meta.env.VITE_PUBLIC_BACKEND_URL}/data`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              companies: [{ ...formData }],
              transactions: [],
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to add company");
        }
      }

      setFormData({ name: "", symbol: "" });
      setEditIndex(null);
      fetchCompanies();
    } catch (error) {
      console.error("Error submitting company:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pages = Math.ceil(filteredCompanies.length / rowsPerPage);

  const paginatedCompanies = filteredCompanies.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="flex gap-3">
          <Building2 />
          <div className="flex flex-col">
            <p className="text-md">
              {editIndex !== null ? "Edit Company" : "Add Company"}
            </p>
            <p className="text-small text-default-500">Enter company details</p>
          </div>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Company Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <Input
                label="Stock Symbol"
                value={formData.symbol}
                onChange={(e) =>
                  setFormData({ ...formData, symbol: e.target.value })
                }
                required
              />
            </div>
            <Button color="primary" type="submit" isLoading={isLoading}>
              {editIndex !== null ? "Update Company" : "Add Company"}
            </Button>
          </form>
        </CardBody>
      </Card>
      <Card>
        <CardHeader className="flex justify-between items-center">
          <p className="text-xl font-bold">Companies</p>
          <Input
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startContent={<Search className="text-default-400" />}
            className="w-64"
          />
        </CardHeader>
        <CardBody>
          <Table aria-label="Companies table">
            <TableHeader>
              <TableColumn>S No.</TableColumn>
              <TableColumn>Name</TableColumn>
              <TableColumn>Symbol</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No companies found">
              {paginatedCompanies.map((company, index) => (
                <TableRow key={index}>
                  <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{company.name}</TableCell>
                  <TableCell>{company.symbol}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Tooltip content="Edit Company">
                        <Button
                          size="sm"
                          color="primary"
                          onPress={() => handleEdit(index)}
                          isIconOnly
                        >
                          <Edit size={16} />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Delete Company">
                        <Button
                          size="sm"
                          color="danger"
                          onPress={() => {
                            setDeleteIndex(index);
                            onOpen();
                          }}
                          isIconOnly
                        >
                          <Trash2 size={16} />
                        </Button>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-center mt-4">
            <Pagination total={pages} page={page} onChange={setPage} />
          </div>
        </CardBody>
      </Card>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalBody>
            Are you sure you want to delete this company? This action cannot be
            undone.
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button
              color="danger"
              onPress={() => deleteIndex !== null && handleDelete(deleteIndex)}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
