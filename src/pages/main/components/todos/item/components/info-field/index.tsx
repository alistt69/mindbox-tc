import React from "react";
import classes from "./classes.module.scss";

const InfoField: React.FC<{label: string, value: string}> = ({ label, value }) => {
    return (
        <span className={classes.info_field}>
            {label}: <span>{value}</span>
        </span>
    );
};

export default InfoField;