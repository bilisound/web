import React, { useContext } from "react";
import { bsFormError, bsFormItem, bsFormLabel, bsFormValue } from "@/components/recipes/form";
import { FormContext, formContextDefaultOption, FormContextOption } from "@/components/ui/FormProvider";
import { SystemStyleObject } from "@/styled-system/types";
import { css } from "@/styled-system/css";

export interface FormItemProps {
    direction?: FormContextOption["direction"];
    error?: React.ReactNode;
    formErrorCSS?: SystemStyleObject;
    formItemCSS?: SystemStyleObject;
    formLabelCSS?: SystemStyleObject;
    formValueCSS?: SystemStyleObject;
    htmlFor: string;
    label?: React.ReactNode;
    labelAlign?: FormContextOption["labelAlign"];
    labelWidth?: FormContextOption["labelWidth"];
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

    return (
        <div className={css(bsFormItem.raw({ direction: options.direction }), formItemCSS)}>
            <label
                className={css(bsFormLabel.raw({ align: options.labelAlign, required }), formLabelCSS)}
                htmlFor={htmlFor}
                style={{ width: options.labelWidth }}
            >
                {label}
            </label>
            <div className={css(bsFormValue.raw({ direction: options.direction }), formValueCSS)}>
                {children}
                {error ? (
                    <div
                        data-error={true}
                        className={css(bsFormError.raw({ direction: options.direction }), formErrorCSS)}
                    >
                        {error}
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default FormItem;
