import React, { useCallback } from "react";
import { center } from "@/styled-system/patterns";
import { Formik, Field, Form } from "formik";
import { bsInput } from "@/components/recipes/input";
import { bsButton } from "@/components/recipes/button";
import { bsForm } from "@/components/recipes/form";
import { css } from "@/styled-system/css";
import FormItem from "@/components/ui/FormItem";
import FormProvider from "@/components/ui/FormProvider";
import { validateUserQuery } from "@bilisound2/utils";
import { ReactComponent as IconLoading } from "@/icons/loading.svg";
import { resolveVideo } from "@/utils/format";
import { getBilisoundMetadata } from "@/api/online";
import { sendToast } from "@/utils/toast";
import { useNavigate } from "umi";
import { useQueryClient } from "@tanstack/react-query";

interface Values {
    query: string;
}

export default function Page() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const handleRequest = useCallback(
        async (req: Values) => {
            const resolvedInput = await resolveVideo(req.query);
            return queryClient.fetchQuery({
                queryKey: [resolvedInput],
                queryFn: () => {
                    return getBilisoundMetadata({ id: resolvedInput });
                },
            });
        },
        [queryClient],
    );

    return (
        <div className={center()}>
            <Formik<Values>
                initialValues={{
                    query: "",
                }}
                onSubmit={async values => {
                    try {
                        const value = await handleRequest(values);
                        navigate("/video/" + value.data.bvid);
                    } catch (e) {
                        sendToast(e as any, {
                            type: "error",
                        });
                        throw e;
                    }
                }}
            >
                {({ errors, touched, isSubmitting }) => (
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
                            <button type="submit" className={bsButton()} disabled={isSubmitting}>
                                {isSubmitting && <IconLoading />}
                                查询 / 抽出
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
