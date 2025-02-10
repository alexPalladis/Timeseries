import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import Chart from "./Chart";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Table = ({ data }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [edited, setEdited] = useState([]);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState({
    Germany: true,
    Greece: true,
    France: true,
  });


  useEffect(() => {
    fetch("http://localhost:5000/api/timeseries")
      .then((response) => response.json())
      .then((data) => {
        setEdited(data);
        setFilteredData(data);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (start && end) {
      const filtered = edited.filter((row) => {
        const rowDate = new Date(row.DateTime);
        return rowDate >= start && rowDate <= end;
      });

      setFilteredData(filtered.length > 0 ? filtered : []);
    } else {
      setFilteredData(edited);
    }
  }, [start, end, edited]);

  const handleInput = (index, key, value) => {
    setEdited((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = { ...updatedData[index], [key]: value };
      return updatedData;
    });
  

    if (value.trim() === "") {
      setError("⚠️ You must insert a number!");
      return;
    }

    if (!/^(-?\d*\.?\d*)?$/.test(value)) {
      setError("❌ Letters and symbols are not allowed! Please enter a valid number.");
      return;
    }
  
    const arithmeticValue = parseFloat(value);
  
    
    if (isNaN(arithmeticValue) || arithmeticValue < -2000 || arithmeticValue > 2000) {
      setError("🚩 Number must be between -2000 and 2000!");
  
  
      setEdited((prevData) => {
        const restoredData = [...prevData];
        restoredData[index] = { ...restoredData[index], [key]: filteredData[index][key] }; // Keep last valid value
        return restoredData;
      });
  
      return; 
    }
  
  
    setError("");
  
    setFilteredData((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = { ...updatedData[index], [key]: arithmeticValue }; // ✅ Store only valid numbers
      return updatedData;
    });
  };
  
  
   const handleCheckbox = (timeserie) => {
    setVisible((prev) => ({
      ...prev,
      [timeserie]: !prev[timeserie],
    }));
  };

  return (
    <div className="p-2 mx-auto bg-gradient-to-r from-purple-700 to-blue-600">
      <h2 className="text-3xl text-white font-bold text-center">
        📈 Timeseries Data
      </h2>
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 sm:flex-row sm:justify-start mt-2 sm:mt-4 mx-auto pb-2">
        <p className="text-gray-900 text-xl">Filter by Date:</p>
        <DatePicker
          selected={start}
          onChange={(date) => setStart(date)}
          startDate={start}
          endDate={end}
          placeholderText="Select Start Date"
          selectsStart
          className="border p-1 rounded bg-gray-500"
        />
        <DatePicker
          selected={end}
          onChange={(date) => setEnd(date)}
          startDate={start}
          endDate={end}
          placeholderText="Select End Date"
          selectsEnd
          className="border p-1 rounded bg-gray-500"
        />
      </div>
      <Chart data={filteredData} visible={visible}/>
      <div className="flex justify-center space-x-4 mb-4 mt-2 text-white font-bold">
        <p className="text-yellow-400">Show : </p>
        <label>
          <input
            type="checkbox"
            checked={visible.Germany}
            onChange={() => handleCheckbox("Germany")}
          />
          Germany
        </label>
        <label>
          <input
            type="checkbox"
            checked={visible.Greece}
            onChange={() => handleCheckbox("Greece")}
          />
          Greece
        </label>
        <label>
          <input
            type="checkbox"
            checked={visible.France}
            onChange={() => handleCheckbox("France")}
          />
          France
        </label>
      </div>
      

      {error && (
        <div className="text-red-600 text-center font-bold text-xl mb-2">
          {error}
        </div>
      )}

      <div className="overflow-x-auto shadow-2xl rounded-xl">
        {filteredData.length > 0 ? (
          <table className="min-w-full text-center">
            <thead>
              <tr className="bg-indigo-700 text-white text-center">
                <th className="border border-gray-400 text-lg px-6 py-3 w-1/4">
                  Timestamp
                </th>
                {visible.Germany && (
                  <th className="border border-gray-400 text-lg px-6 py-3">
                    Germany
                  </th>
                )}
                {visible.Greece && (
                  <th className="border border-gray-400 text-lg px-6 py-3">
                    Greece
                  </th>
                )}
                {visible.France && (
                  <th className="border border-gray-400 text-lg px-6 py-3">
                    France
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => {
                return (
                  <tr
                    key={index}
                    className="border border-gray-500 odd:bg-blue-500 even:bg-blue-600 hover:bg-indigo-200 transition"
                  >
                    <td className="border border-gray-600 text-gray-900 px-6 py-3">
                      {format(new Date(row.DateTime), "dd-MM-yyyy HH:mm")}
                    </td>
                    {visible.Germany && (
                      <td className="border border-gray-600 text-gray-700 px-6 py-3">
                        <input
                          type="text"
                          value={edited[index]["ENTSOE_DE_DAM_Price"]}
                          onChange={(e) =>
                            handleInput(
                              index,
                              "ENTSOE_DE_DAM_Price",
                              e.target.value
                            )
                          }
                          className="w-full text-center bg-transparent border border-gray-300 p-1 rounded-xl"
                        />
                      </td>
                    )}

                    {visible.Greece && (
                      <td className="border border-gray-600 text-gray-700 px-6 py-3">
                        <input
                          type="text"
                          value={edited[index]["ENTSOE_GR_DAM_Price"]}
                          onChange={(e) =>
                            handleInput(
                              index,
                              "ENTSOE_GR_DAM_Price",
                              e.target.value
                            )
                          }
                          className="w-full text-center bg-transparent border border-gray-300 p-1 rounded-xl"
                        />
                      </td>
                    )}

                    {visible.France && (
                      <td className="border border-gray-600 text-gray-700 px-6 py-3">
                        <input
                          type="text"
                          value={edited[index]["ENTSOE_FR_DAM_Price"]}
                          onChange={(e) =>
                            handleInput(
                              index,
                              "ENTSOE_FR_DAM_Price",
                              e.target.value
                            )
                          }
                          className="w-full text-center bg-transparent border border-gray-300 p-1 rounded-xl"
                        />
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-white text-center font-bold text-lg p-4">
            ❌ No records found for the selected date range.
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;  