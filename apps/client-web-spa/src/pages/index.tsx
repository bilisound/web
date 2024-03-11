import React from "react";
import { center } from "@/styled-system/patterns";
import { Formik, Field, Form } from "formik";
import { css } from "@/styled-system/css";
import { bsInput } from "@/components/recipes/input";
import { bsButton } from "@/components/recipes/button";

interface Values {
    query: string;
}

function validateQuery(query: string) {
    if (!query) {
        return "请输入 query";
    }
    return undefined;
}

export default function Page() {
    return (
        <div
            className={center({
                mx: "auto",
            })}
        >
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
                    <Form>
                        <label htmlFor="query" className={css({ srOnly: true })}>
                            视频地址或 ID：
                        </label>
                        <Field id="query" name="query" placeholder="" validate={validateQuery} className={bsInput()} />
                        {errors.query && touched.query && <div>{errors.query}</div>}

                        <button type="submit" className={bsButton()}>
                            Submit
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
