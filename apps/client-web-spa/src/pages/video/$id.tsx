import { useParams } from "umi";
import { useRequest } from "ahooks";
import { getBilisoundMetadata } from "@/api/online";
import { css } from "@/styled-system/css";

export default function Page() {
    const { id } = useParams<{
        id: string;
    }>();
    const { data, loading } = useRequest(async () => {
        if (!id) {
            return null;
        }
        return getBilisoundMetadata({ id });
    });

    if (loading) {
        return <div>Loading...</div>;
    }

    return <pre className={css({ overflowX: "scroll" })}>{JSON.stringify(data, null, 4)}</pre>;
}
