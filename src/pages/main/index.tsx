import React from "react";
import classes from "./classes.module.scss";
import MainLayout from "@/layout-components/main-layout";
import Heading from "@/pages/main/components/heading";

const MainPage = () => {
    return (
        <MainLayout>
            <div className={classes.container}>
                <Heading />
            </div>
        </MainLayout>
    );
};

export default MainPage;
