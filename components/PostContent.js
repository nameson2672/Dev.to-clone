import Link  from 'next/link';

export function PostContent({ posts }) {
    const createdAt = typeof posts?.createdAt === 'number' ? new Date(posts.createdAt) : posts.createdAt;
    

    return (
        <div className="card">
            <h1>{posts?.title}</h1>
            <span className="text-sm">
                Written by{' '}
                <Link href={`/${posts.username}`}>
                    <a className="text-info">@{ posts.username}</a>
                </Link>{' '}
                on {"createdAt"}
            </span>

            
            <p>{posts.content}</p>
        </div>
    )
}
