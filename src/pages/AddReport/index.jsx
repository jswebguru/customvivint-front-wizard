import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiClient from "../../lib/api-client";
const AddReportPage = () => {
  const [reportName, setReportName] = useState("");
  const [alias, setAlias] = useState("");
  const [link, setLink] = useState("");
  const [reportType, setReportType] = useState("Tableau Report");
  const navigate = useNavigate();

  const handleAddReport = async () => {
    // Logic to add the report
    try {
      // Make API call to add the report
      const response = await apiClient.post("/sidebar/add_report", {
        title: reportName,
        parent_id: "1DSWHiAW1iSFYVb86WQQUPn57iQ6W1DjGo",
        avatar_url: "abcd",
        description: "abcd",
        link: "abcd",
      });
      toast.success("Report added successfully!");
      setReportName("");
      setAlias("");
      navigate("/");
    } catch (error) {
      toast.error("Can't add report!");
      console.error("Error adding folder:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl mb-4">Add Report</h2>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col gap-4"
      >
        <div>
          <label className="block mb-1">Report Name:</label>
          <input
            type="text"
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Alias:</label>
          <input
            type="text"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Link to the report:</label>
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Report Type:</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="Tableau Report">Tableau Report</option>
            <option value="Custom Report">Custom Report</option>
          </select>
        </div>
        <div className="flex items-center justify-center mt-6">
          <button
            onClick={handleAddReport}
            className="bg-blue-500 w-full text-white p-2 rounded"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddReportPage;
