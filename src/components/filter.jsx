import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
  RadioGroup,
  Radio,
  useDisclosure,
} from "@nextui-org/react";
import { Filter } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function FilterModal({ symbols, onFilterChange }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedSymbols, setSelectedSymbols] = useState([]);
  const [selectedType, setSelectedType] = useState("any");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const handleSymbolChange = (symbol) => {
    setSelectedSymbols((prev) =>
      prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol]
    );
  };

  const handleApplyFilters = () => {
    onFilterChange({
      symbols: selectedSymbols,
      type: selectedType,
      dateRange: {
        from: fromDate,
        to: toDate,
      },
    });
    onClose();
  };

  return (
    <>
      <Button
        variant="solid"
        color="primary"
        onPress={onOpen}
        startContent={<Filter className="h-4 w-4" />}
      >
        Filter
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 items-center justify-center text-2xl py-10">
            Filter Transactions
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Symbols</h3>
                <div className="flex flex-col">
                  {symbols.map((symbol) => (
                    <Checkbox
                      key={symbol}
                      isSelected={selectedSymbols.includes(symbol)}
                      onValueChange={() => handleSymbolChange(symbol)}
                    >
                      {symbol}
                    </Checkbox>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Transaction Type</h3>
                <RadioGroup
                  value={selectedType}
                  onValueChange={setSelectedType}
                >
                  <Radio value="any">Any</Radio>
                  <Radio value="buy">Buy</Radio>
                  <Radio value="sell">Sell</Radio>
                </RadioGroup>
                <h3 className="text-lg font-semibold mt-4 mb-2">Date Range</h3>
                <div className="flex flex-col space-y-2">
                  <DatePicker
                    selected={fromDate}
                    onChange={(date) => setFromDate(date)}
                    placeholderText="From Date"
                    className="w-full p-2 border rounded"
                  />
                  <DatePicker
                    selected={toDate}
                    onChange={(date) => setToDate(date)}
                    placeholderText="To Date"
                    className="w-full p-2 border rounded"
                    minDate={fromDate}
                  />
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleApplyFilters}>
              Apply Filters
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
