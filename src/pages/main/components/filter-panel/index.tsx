import React, { Dispatch, SetStateAction } from "react";
import { FilterType } from "@/pages/main/enums/filter/index.d";
import classes from "./classes.module.scss";

const FilterPanel: React.FC<{ setFilter: Dispatch<SetStateAction<FilterType>>, menuSelectorClassName: string }> = ({ setFilter, menuSelectorClassName }) => {
    return (
        <div className={classes.filter_panel}>
            <button onClick={() => setFilter(FilterType.All)} className={classes.all_button}>All</button>
            <button onClick={() => setFilter(FilterType.Active)} className={classes.active_button}>Active</button>
            <button onClick={() => setFilter(FilterType.Completed)} className={classes.completed_button}>Completed</button>
            <button onClick={() => setFilter(FilterType.WithTime)} className={classes.withTime_button}>Timed</button>
            <span className={`${classes.dynamic_menu_selector} ${menuSelectorClassName}`}/>
        </div>
    );
};

export default FilterPanel;
