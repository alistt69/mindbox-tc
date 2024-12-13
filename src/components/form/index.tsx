import React, { Dispatch, SetStateAction } from "react";
import DateIcon from "@/pages/main/assets/DateIcon.svg";
import ClockIcon from "@/pages/main/assets/ClockIcon.svg";
import DateXTimeIcon from "@/pages/main/assets/DateXTimeIcon.svg";
import classes from "./classes.module.scss";

interface FormProps {
    formType: string
    onSubmit: (e: React.FormEvent) => void;
    textValue: string;
    dateValue: string;
    timeValue: string;
    textValueOnChange: Dispatch<SetStateAction<string>>;
    dateValueOnChange: Dispatch<SetStateAction<string>>;
    timeValueOnChange: Dispatch<SetStateAction<string>>;
    showDateTimeInputs?: boolean;
    setShowDateTimeInputs?: Dispatch<SetStateAction<boolean>>;
}

const Form: React.FC<FormProps> = ({ formType, onSubmit, textValue, dateValue, timeValue, textValueOnChange, dateValueOnChange, timeValueOnChange, showDateTimeInputs, setShowDateTimeInputs }) => {
    return (
        <form onSubmit={onSubmit}>
            <div className={classes.text_input_container}>
                <button type="submit" className={classes.submit_btn}>{formType}</button>
                <input
                    type="input"
                    id={formType}
                    name={formType}
                    maxLength={26}
                    value={textValue}
                    className={classes.input_field}
                    onChange={(e) => textValueOnChange(e.target.value)}
                    placeholder={formType}
                    autoComplete="off"
                />
                <label htmlFor={formType} className={classes.input_label} style={!setShowDateTimeInputs ? {backgroundColor: "white"} : undefined}>What needs to be done?</label>
            </div>
            <div className={classes.date_time_panel}>
                {setShowDateTimeInputs && (
                    <button type="button"
                            onClick={() => setShowDateTimeInputs(!showDateTimeInputs)}
                            className={`${classes.visibility_toggle} ${!showDateTimeInputs && classes.is_date_time_hidden}`}
                    >
                        <div><DateXTimeIcon className={classes.icon}/></div>
                    </button>
                )}
                {(setShowDateTimeInputs && showDateTimeInputs) || !setShowDateTimeInputs ? (
                    <div className={classes.date_time_input_container}>
                        <div className={classes.date_input_container}>
                            <DateIcon className={classes.date_icon}/>
                            <input
                                type="date"
                                value={dateValue}
                                className={classes.date_field}
                                onChange={(e) => dateValueOnChange(e.target.value)}
                            />
                        </div>
                        <div className={classes.time_input_container}>
                            <ClockIcon className={classes.time_icon}/>
                            <input
                                type="time"
                                value={timeValue}
                                className={classes.time_field}
                                onChange={(e) => timeValueOnChange(e.target.value)}
                            />
                        </div>
                    </div>
                ) : null}
            </div>
        </form>
    );
};

export default Form;
