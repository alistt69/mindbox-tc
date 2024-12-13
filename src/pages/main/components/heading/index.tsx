import React from 'react';
import classes from "./classes.module.scss";

const Heading: React.FC = () => {
    return(
        <p className={classes.heading}>
            todos
        </p>
    );
};

export default Heading;
