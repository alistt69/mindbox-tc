import React, { ReactNode } from "react";
import classes from "./classes.module.scss";

const MainLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <div className={classes.main_layout}>
            {children}
        </div>
    );
};

export default MainLayout;
