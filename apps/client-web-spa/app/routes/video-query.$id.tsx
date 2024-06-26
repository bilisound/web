import { useNavigate, useParams } from "@remix-run/react";
import { useEffect } from "react";
import { decode } from "universal-base64url";

// 兼容 v1 地址用
export default function Page() {
    const navigate = useNavigate();
    const params = useParams<"id">();

    useEffect(() => {
        navigate("/video/" + decode(params.id ?? ""));
    }, [navigate, params.id]);

    return <div></div>;
}
