import React, { useEffect } from "react";
import { useNavigate, useParams } from "umi";
import base64url from "base64url";

const Component: React.FC = () => {
    const navigate = useNavigate();
    const params = useParams<{
        id: string
    }>();

    useEffect(() => {
        navigate(`/video-query/${base64url.encode(`${params.id}`)}`, { replace: true });
    }, []);

    return <div />;
};

export default Component;
