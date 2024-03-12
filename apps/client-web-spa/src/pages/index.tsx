import React from "react";
import { center } from "@/styled-system/patterns";
import { Formik, Field, Form } from "formik";
import { bsInput } from "@/components/recipes/input";
import { bsButton } from "@/components/recipes/button";
import { bsForm } from "@/components/recipes/form";
import { css } from "@/styled-system/css";
import FormItem from "@/components/ui/FormItem";
import FormProvider from "@/components/ui/FormProvider";
import { validateUserQuery } from "@bilisound2/utils";

interface Values {
    query: string;
}

export default function Page() {
    return (
        <div className={center()}>
            <Formik<Values>
                initialValues={{
                    query: "",
                }}
                onSubmit={(values, { setSubmitting }) => {
                    setTimeout(() => {
                        alert(JSON.stringify(values, null, 2));
                        setSubmitting(false);
                    }, 500);
                }}
            >
                {({ errors, touched }) => (
                    <Form
                        className={css(bsForm.raw(), {
                            w: "full",
                            maxW: "xl",
                        })}
                    >
                        <FormProvider>
                            <FormItem
                                htmlFor="query"
                                label={"视频地址或 ID"}
                                error={touched.query && errors.query}
                                required={true}
                                formLabelCSS={css.raw({ srOnly: true })}
                            >
                                <Field
                                    id="query"
                                    name="query"
                                    placeholder="粘贴完整 URL、客户端分享短链接或带前缀 ID 至此"
                                    validate={validateUserQuery}
                                    className={bsInput()}
                                />
                            </FormItem>
                        </FormProvider>
                        <div className={center({ w: "full" })}>
                            <button type="submit" className={bsButton()}>
                                查询
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
