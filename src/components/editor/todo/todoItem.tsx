import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import { BsSquare, BsCheckSquareFill } from "react-icons/bs";
import "./todoItem.css";

// Helper to get priority styles, similar to page.tsx but simplified for BlockNote
// eslint-disable-next-line react-refresh/only-export-components
const getPriorityStyles = (priority?: string | null) => {
  switch (priority) {
    case "2": // High
    case "high":
      return {
        label: "High",
        dotClassName: "priority-dot-high",
        textClassName: "priority-text-high",
      };
    case "1": // Medium
    case "medium":
      return {
        label: "Medium",
        dotClassName: "priority-dot-medium",
        textClassName: "priority-text-medium",
      };
    default: // "0", "low", undefined, null
      return {
        label: "Low",
        dotClassName: "priority-dot-low",
        textClassName: "priority-text-low",
      };
  }
};

// The TodoItem block.
export const TodoItem = createReactBlockSpec(
  {
    type: "todo",
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
      checked: {
        default: "false", // Stored as string "true" or "false"
      },
      todoId: {
        default: "", // Stores the ID of the todo item in the database
      },
      priority: {
        default: "0", // "0" for Low, "1" for Medium, "2" for High
        values: ["0", "1", "2"],
      },
    },
    content: "inline",
  },
  {
    render: (props) => {
      const editor = props.editor;
      const isChecked = props.block.props.checked === "true";
      const currentPriority = props.block.props.priority || "0"; // Default to "0" if undefined
      const priorityStyle = getPriorityStyles(currentPriority);

      const Icon = isChecked ? BsCheckSquareFill : BsSquare;

      const toggleChecked = () => {
        const newCheckedStateString = isChecked ? "false" : "true";
        editor.updateBlock(props.block, {
          props: { ...props.block.props, checked: newCheckedStateString },
        });
        // The actual database update will be handled by the main save function
        // in DiaryDetailView.tsx, which iterates through blocks.
      };

      const cyclePriority = () => {
        let nextPriority: "0" | "1" | "2";
        if (currentPriority === "0") {
          nextPriority = "1";
        } else if (currentPriority === "1") {
          nextPriority = "2";
        } else {
          nextPriority = "0";
        }
        editor.updateBlock(props.block, {
          props: { ...props.block.props, priority: nextPriority },
        });
      };

      return (
        <div className={`bn-todo-item-container ${isChecked ? "checked" : ""}`}>
          <div className={"bn-todo-checkbox-wrapper"} contentEditable={false} onClick={toggleChecked}>
            <Icon
              className={"bn-todo-checkbox-icon"}
              size={18}
            />
          </div>
          <div className={"bn-todo-content-wrapper"}>
            <div className={"bn-inline-content"} ref={props.contentRef} />
            <div 
              className={"bn-todo-priority-indicator"} 
              contentEditable={false}
              onClick={cyclePriority}
              title={`Current priority: ${priorityStyle.label}. Click to change.`}
            >
              <span className={`bn-todo-priority-dot ${priorityStyle.dotClassName}`}></span>
              <span className={`bn-todo-priority-label ${priorityStyle.textClassName}`}>{priorityStyle.label}</span>
            </div>
          </div>
        </div>
      );
    },
  }
);
