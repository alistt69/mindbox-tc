import classes from "./classes.module.scss";
import React from "react";

const ClearButton: React.FC<{ clearCompleted: () => void }> = ({ clearCompleted }) => {
    return (
        <button onClick={clearCompleted} className={classes.clear_bnt}>
            Clear Completed
        </button>
    );
};

export default ClearButton;
