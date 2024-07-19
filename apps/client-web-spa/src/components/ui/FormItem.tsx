import { useContext } from "react";
import type React from "react";
import { bsForm } from "@/components/recipes/form";
import { FormContext, formContextDefaultOption, FormContextOption } from "@/components/ui/FormProvider";
import type { SystemStyleObject } from "@styled-system/types";
import { css } from "@styled-system/css";

export interface FormItemProps extends Partial<FormContextOption> {
    error?: React.ReactNode;
    formErrorCSS?: SystemStyleObject;
    formItemCSS?: SystemStyleObject;
    formLabelCSS?: SystemStyleObject;
    formValueCSS?: SystemStyleObject;
    htmlFor: string;
    label?: React.ReactNode;
    required?: boolean;
}

const FormItem: React.FC<React.PropsWithChildren<FormItemProps>> = ({
    label,
    error,
    required = false,
    direction = "vertical",
    labelWidth,
    labelAlign = "start",
    htmlFor,
    children,
    formItemCSS = {},
    formErrorCSS = {},
    formLabelCSS = {},
    formValueCSS = {},
}) => {
    const options: FormContextOption = {
        ...{ direction, labelWidth, labelAlign },
        ...formContextDefaultOption,
        ...useContext(FormContext),
    };
    const classes = bsForm.raw({ direction: options.direction, align: options.labelAlign, required });

    return (
        <div className={css(classes.item, formItemCSS)}>
            <label className={css(classes.label, formLabelCSS)} htmlFor={htmlFor} style={{ width: options.labelWidth }}>
                {label}
            </label>
            <div className={css(classes.value, formValueCSS)}>
                {children}
                {error ? (
                    <div data-error={true} className={css(classes.error, formErrorCSS)}>
                        {error}
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default FormItem;
