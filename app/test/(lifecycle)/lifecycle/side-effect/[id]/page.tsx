import { Suspense } from "react";

//※권장하지 않음
interface Params {
    params: Promise<{id: string}>
}

async function Post({params}: Params) {

    const {id} = await params;
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, )
    const post = await response.json()

    return (
        <>
            <p>{post.id}</p>
            <p>{post.title}</p>
        </>
    );
}

export default function page({params}: Params) {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <Post params={params} />
        </Suspense>
    );
}
