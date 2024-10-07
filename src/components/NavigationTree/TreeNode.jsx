import React from "react";
import { FaEdit, FaTrash, FaFolder, FaInfoCircle } from "react-icons/fa";

const TreeNode = ({ node, deleteNode }) => ({
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
      <button className="text-blue-400" onClick={() => deleteNode(node)}>
        <FaEdit size={20} />
      </button>
      <button className="text-red-400" onClick={() => deleteNode(node)}>
        <FaTrash size={20} />
      </button>
    </div>,
  ],
});

export default TreeNode;
