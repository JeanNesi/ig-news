import { GetStaticProps } from 'next'
import Head from 'next/head'
import { RichText } from 'prismic-dom'
import { getPrismicClient } from '../../../services/prismic'
import Link from 'next/link'
import style from '../post.module.scss'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

type PostPreviewProps = {
    post:{
        slug: string;
        title: string;
        content: string;
        updatedAt: string;
    }
};

export default function PostPreview({post}: PostPreviewProps) {
    const session = useState()
    const router = useRouter()

    useEffect(() => {
        router.push(`/posts/${post.slug}`)
    }, [session])

    return (
        <div className={style.fadeIn}>
        <Head>
            <title>{post.title} | IG News</title>
        </Head>
        <main className={style.container}>
            <article className={style.post}>
                <h1>{post.title}</h1>
                <time>{post.updatedAt}</time>
                <div 
                    className={`${style.postPreview}`}
                    dangerouslySetInnerHTML={{ __html: post.content}}
                    />
                    <div className={style.continueReading}>
                    <Link  href="/">
                    <a> Wanna continue reading?<span> Subscribe now</span> 🤗</a>
                    </Link>
                    </div>

            </article>
        </main>
    </div>
    )
}

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async ({params}) => {
    const {slug} = params

    const prismic = getPrismicClient()

    const response = await prismic.getByUID<any>('post', String(slug), {})

    const post = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content.splice(1,3)),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-br',{
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }
    return {
        props: { post },
        revalidate: 60 * 30
    }
}