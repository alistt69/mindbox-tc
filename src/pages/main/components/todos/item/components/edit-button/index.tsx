import React, { Dispatch, SetStateAction } from "react";
import { ITodoItem } from "@/models/todo";
import edit_icon from "../../../../../assets/edit_icon.png"
import classes from "./classes.module.scss";

const EditButton: React.FC<{ todo: ITodoItem, setIsEditing: Dispatch<SetStateAction<boolean>> }> = ({ todo, setIsEditing }) => {
    return (
        <>
            {!todo.completed &&
                <button onClick={() => setIsEditing(true)} className={classes.edit_button} data-testid={`edit-button-${todo.text}`}>
                    <img src={edit_icon} />
                </button>
            }
        </>
    );
};

export default EditButton;
