import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Tree from "../../components/NavigationTree/Tree";
import apiClient from "../../lib/api-client";
import { toast } from "react-toastify";
import AnimatedPulse from "../../components/Pulse";
const NavigationPage = () => {
  const [navigationData, setNavigationData] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [searchString, setSearchString] = useState("");
  const transformData = (data) => {
    return data.map((item) => {
      let newItem = { ...item };
      if (item.childs) {
        newItem.children = transformData(item.childs);
        delete newItem.childs;
      }
      return newItem;
    });
  };

  const fetchSidebarData = async () => {
    try {
      const response = await apiClient.get("/sidebar");
      setNavigationData(transformData(response.sidebar_items));
    } catch (error) {
      console.error("Error fetching sidebar data:", error);
    }
  };

  const addFolder = async () => {
    try {
      const response = await apiClient.post("/sidebar/add_path", {
        title: categoryName,
        parent_id: null,
      });
      await fetchSidebarData();
      toast.success("Category added successfully!");
      setCategoryName("");
      setShowForm(false);
    } catch (error) {
      console.error("Error adding folder:", error);
    }
  };

  const showReportForm = () => {
    setShowForm(true);
  };
  const hideReportForm = () => {
    setShowForm(false);
  };

  useEffect(() => {
    fetchSidebarData();
  }, []);

  const navigate = useNavigate();
  const handleSearchChange = (e) => {
    setSearchString(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 w-full">
      <h2 className="text-2xl mb-4">Navigation</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search reports or folders"
          className="w-full p-2 border rounded"
          value={searchString}
          onChange={handleSearchChange}
        />
      </div>
      <div className="mb-4 flex items-center justify-center gap-3">
        <button
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          onClick={showReportForm}
        >
          Add Folder
        </button>
        <button
          onClick={() => navigate("/add-report")}
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Add Report
        </button>
      </div>
      <div
        className={`shadow-sm rounded-lg p-4 bg-white ${
          !showForm ? "hidden" : ""
        }`}
      >
        <h2 className="text-2xl mb-4">Add Folder</h2>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-2"
        >
          <div>
            <label className="block mb-1">Category Name:</label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex items-center justify-center mt-2 gap-5 px-5">
            <button
              className="bg-blue-500 w-full text-white p-2 rounded"
              onClick={addFolder}
            >
              Add
            </button>
            <button
              className="bg-gray-200 w-full text-black p-2 rounded"
              onClick={hideReportForm}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      <div className="w-full h-auto">
        {navigationData ? (
          <Tree
            treeData={navigationData}
            setTreeData={setNavigationData}
            searchString={searchString}
            setSearchString={setSearchString}
          />
        ) : (
          <AnimatedPulse />
        )}
      </div>
    </div>
  );
};

export default NavigationPage;
