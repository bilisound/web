import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect } from "react";
import { decode } from "universal-base64url";

export const Route = createFileRoute("/video-query/$id")({
    component: Page,
});

// 兼容 v1 地址用
function Page() {
    const navigate = useNavigate();
    const params = useParams<"id">();

    useEffect(() => {
        navigate("/video/" + decode(params.id ?? ""));
    }, [navigate, params.id]);

    return <div></div>;
}
