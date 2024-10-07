import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import { FaEdit, FaTrash, FaFolder, FaInfoCircle } from "react-icons/fa";
import SortableTree from "@nosferatu500/react-sortable-tree";
import { toast } from "react-toastify";
import { debounce } from "lodash";
import TreeNode from "./TreeNode";
import ConfirmModal from "../ConfirmModal";
import apiClient from "../../lib/api-client";
import "@nosferatu500/react-sortable-tree/style.css";
import "./Tree.css";

const Tree = React.memo(
  ({ treeData, setTreeData, searchString, setSearchString, fetchTreeData }) => {
    const [searchFocusIndex, setSearchFocusIndex] = useState(0);
    const [searchFoundCount, setSearchFoundCount] = useState(0);
    const containerRef = useRef(null);
    const previousTreeData = useRef(treeData);

    useEffect(() => {
      const handleResize = () => {
        if (containerRef.current) {
          containerRef.current.style.height = `${window.innerHeight}px`;
        }
      };

      handleResize();

      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);

    const handleNodeChange = useCallback(
      async ({ node, parentNode }) => {
        try {
          const endpoint_url =
            node.type === "folder"
              ? "/sidebar/move_folder"
              : "/sidebar/move_report";
          await apiClient.post(endpoint_url, {
            item_id: node.id.toString(),
            destination_parent_id: parentNode ? parentNode.id : null,
          });
          toast.success("Updated successfully!");
        } catch (error) {
          toast.warning("Can't update!");
          console.error("Error updating!", error);
          setTreeData(previousTreeData.current);
        }
      },
      [setTreeData]
    );

    const deleteNode = useCallback(
      async (node) => {
        try {
          const endpoint_url =
            node.type === "folder"
              ? "/sidebar/delete_folder/"
              : "/sidebar/delete_report/";
          await apiClient.delete(endpoint_url + node.id.toString());
          fetchTreeData();
          toast.success("Deleted successfully!");
        } catch (error) {
          toast.warning("Can't delete!");
          console.error("Error deleting!", error);
        }
      },
      [fetchTreeData]
    );

    const debouncedWarning = useMemo(
      () =>
        debounce(() => {
          toast.warning("The node cannot be a child of a report node!");
        }, 1000),
      []
    );

    const onMoveNode = useCallback(
      ({ treeData: newTreeData, node, nextParentNode }) => {
        previousTreeData.current = treeData;
        setTreeData(newTreeData);
        handleNodeChange({ node, parentNode: nextParentNode });
      },
      [treeData, setTreeData, handleNodeChange]
    );

    const canDrop = useCallback(
      ({ nextParent }) => {
        if (nextParent && nextParent.type === "report") {
          debouncedWarning();
          return false;
        }
        return true;
      },
      [debouncedWarning]
    );

    return (
      <DndProvider
        backend={TouchBackend}
        options={{ enableMouseEvents: true, delayTouchStart: 200 }}
      >
        <div className="tree-container" ref={containerRef}>
          <div className="flex items-center mt-2 space-x-4 justify-center">
            {searchFoundCount > 0 && (
              <>
                <button
                  className="p-2 border rounded-lg bg-gray-200 hover:bg-gray-300"
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
                <span>
                  {searchFocusIndex + 1} / {searchFoundCount}
                </span>
                <button
                  className="p-2 border rounded bg-gray-200 hover:bg-gray-300"
                  onClick={() =>
                    setSearchFocusIndex(
                      (searchFocusIndex + 1) % searchFoundCount
                    )
                  }
                >
                  Next
                </button>
              </>
            )}
          </div>
          <SortableTree
            className="sortable-tree"
            treeData={treeData}
            onChange={setTreeData}
            canDrag={({ node }) => !node.dragDisabled}
            canDrop={canDrop}
            onMoveNode={onMoveNode}
            touchScreenHoldDelay={500}
            rowHeight={60}
            generateNodeProps={({ node }) => ({
              ...TreeNode({ node, deleteNode }),
            })}
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
        </div>
      </DndProvider>
    );
  }
);

export default Tree;
