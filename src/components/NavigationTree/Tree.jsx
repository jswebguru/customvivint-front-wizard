import React, { useState, useCallback, useRef, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import { FaEdit, FaTrash, FaFolder, FaInfoCircle } from "react-icons/fa";
import SortableTree from "@nosferatu500/react-sortable-tree";
import { toast } from "react-toastify";
import { debounce } from "lodash";
import "@nosferatu500/react-sortable-tree/style.css";
import "./Tree.css";
const Tree = ({ treeData, setTreeData, searchString, setSearchString }) => {
  const [searchFocusIndex, setSearchFocusIndex] = useState(0);
  const [searchFoundCount, setSearchFoundCount] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    // Update container height based on content
    const handleResize = () => {
      if (containerRef.current) {
        containerRef.current.style.height = `${window.innerHeight}px`;
      }
    };

    // Initial set
    handleResize();

    // Adjust on resize
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const handleTreeOnChange = (treeData) => {
    setTreeData(treeData);
  };

  const generateNodeProps = ({ node }) => ({
    style: {
      backgroundColor: "lightblue",
      width: "100%",
    },
    title: (
      <div className="flex items-center space-x-2">
        {node.type === "folder" ? (
          <FaFolder className="text-yellow-500" size={20} />
        ) : (
          <FaInfoCircle className="text-blue-500" size={20} />
        )}
        <span className="font-medium">{node.title}</span>
      </div>
    ),
    buttons: [
      <div className="flex space-x-2">
        <button className="text-blue-400 " onClick={() => handleEdit(node)}>
          <FaEdit size={20} />
        </button>
        <button className="text-red-400" onClick={() => handleDelete(node)}>
          <FaTrash size={20} />
        </button>
      </div>,
    ],
  });

  const debouncedWarning = useCallback(
    debounce(() => {
      toast.warning("The node cannot be a child of a report node!");
    }, 1000), // Set the debounce time as 1 second
    []
  );

  const canDrop = ({ nextParent }) => {
    // Ensure that a report node cannot be a child of another report node
    if (nextParent && nextParent.type === "report") {
      debouncedWarning();
      return false;
    }
    return true;
  };
  const handleSearchChange = (e) => {
    setSearchString(e.target.value);
  };
  return (
    <DndProvider
      backend={TouchBackend}
      options={{ enableMouseEvents: true, delayTouchStart: 200 }}
    >
      <div className="tree-container" ref={containerRef}>
        <SortableTree
          className="sortable-tree"
          treeData={treeData}
          onChange={(treeData) => handleTreeOnChange(treeData)}
          canDrag={({ node }) => !node.dragDisabled}
          canDrop={canDrop}
          touchScreenHoldDelay={500}
          rowHeight={60}
          generateNodeProps={generateNodeProps}
          searchQuery={searchString}
          searchFocusOffset={searchFocusIndex}
          searchMethod={({ node, searchQuery }) =>
            searchQuery &&
            node.title.toLowerCase().includes(searchQuery.toLowerCase())
          }
          searchFinishCallback={(matches) => {
            setSearchFoundCount(matches.length);
            setSearchFocusIndex(
              matches.length > 0 ? searchFocusIndex % matches.length : 0
            );
          }}
        />
        <div className="flex items-center mt-2 space-x-4">
          {searchFoundCount > 0 && (
            <>
              <button
                className="p-2 border rounded bg-gray-200 hover:bg-gray-300"
                onClick={() =>
                  setSearchFocusIndex(
                    searchFocusIndex !== 0
                      ? searchFocusIndex - 1
                      : searchFoundCount - 1
                  )
                }
              >
                Prev
              </button>
              <button
                className="p-2 border rounded bg-gray-200 hover:bg-gray-300"
                onClick={() =>
                  setSearchFocusIndex((searchFocusIndex + 1) % searchFoundCount)
                }
              >
                Next
              </button>
              <span>
                {searchFocusIndex + 1} / {searchFoundCount}
              </span>
            </>
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default Tree;
