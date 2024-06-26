import React, { createContext } from "react";

export interface FormContextOption {
    direction: "vertical" | "horizontal";
    labelWidth?: string;
    labelAlign: "start" | "end";
}

export const formContextDefaultOption: FormContextOption = {
    direction: "vertical",
    labelAlign: "start",
};

export const FormContext = createContext<FormContextOption>(formContextDefaultOption);

export default function FormProvider({
    direction,
    labelWidth,
    labelAlign,
    children,
}: React.PropsWithChildren<Partial<FormContextOption>>) {
    return (
        <FormContext.Provider
            value={Object.assign(formContextDefaultOption, {
                direction,
                labelWidth,
                labelAlign,
            })}
        >
            {children}
        </FormContext.Provider>
    );
}
