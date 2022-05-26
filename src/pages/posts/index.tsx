import Head from 'next/head'
import style from './style.module.scss'
import { GetStaticProps } from 'next'
import { getPrismicClient } from '../../services/prismic'
import Prismic from '@prismicio/client'
import { RichText } from 'prismic-dom'
import Link from 'next/link'

type Post = {
    slug: string;
    title: string;
    excerpt: string;
    updatedAt: string;
};

interface PostsProps {
    posts: Post[];
}

export default function Post({posts}: PostsProps){
    return (
        <div className={style.fadeIn}>
            <Head>
                <title>Posts | IG News</title>
            </Head>

            <main className={style.container}>
                <div className={style.posts}>
                    { posts.map( post => (
                        <Link href={`/posts/${post.slug}`}>
                            <a key={post.slug}>
                                <time>{post.updatedAt}</time>
                                <strong>{post.title}</strong>
                                <p>{post.excerpt}</p>
                            </a>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const prismic = getPrismicClient()

    const response = await prismic.query<any>([
        Prismic.predicates.at('document.type', 'post')
    ],{ 
        fetch: ['Post.title', 'Post.descricao'],
        pageSize: 100,
    })

    const posts = response.results.map(post => {
        return {
            slug: post.uid,
            title: RichText.asText(post.data.title),
            excerpt: post.data.descricao.find(content => content.type === "paragraph")?.text ?? '',
            updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-br',{
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })
        }})
    return {
        props: {posts}
    }
} 