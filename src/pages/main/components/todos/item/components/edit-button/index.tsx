import React, { Dispatch, SetStateAction } from "react";
import { ITodoItem } from "@/models/todo";
import EditIcon from "@/pages/main/assets/EditIcon.svg";
import classes from "./classes.module.scss";

const EditButton: React.FC<{ todo: ITodoItem, setIsEditing: Dispatch<SetStateAction<boolean>> }> = ({ todo, setIsEditing }) => {
    return (
        <>
            {!todo.completed &&
                <button onClick={() => setIsEditing(true)} className={classes.edit_button}>
                    <EditIcon/>
                </button>
            }
        </>
    );
};

export default EditButton;
