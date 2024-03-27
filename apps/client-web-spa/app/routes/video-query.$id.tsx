import { useNavigate, useParams } from "@remix-run/react";
import { useEffect } from "react";
import { decode } from "universal-base64url";

export default function Page() {
    const navigate = useNavigate();
    const params = useParams<"id">();

    useEffect(() => {
        navigate("/video/" + decode(params.id ?? ""));
    }, []);

    return <div></div>;
}
