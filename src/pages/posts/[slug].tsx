import {GetServerSideProps} from 'next'
import { getSession } from 'next-auth/react'
import { redirect } from 'next/dist/server/api-utils'
import Head from 'next/head'
import { RichText } from 'prismic-dom'
import { getPrismicClient } from '../../services/prismic'
import style from './post.module.scss'

type PostProps = {
    post:{
        slug: string;
        title: string;
        content: string;
        updatedAt: string;
    }
};

export default function Post({post}: PostProps) {
    return (
        <div className={style.fadeIn}>
        <Head>
            <title>{post.title} | IG News</title>
        </Head>
        <main className={style.container}>
            <article className={style.post}>
                <h1>{post.title}</h1>
                <time>{post.updatedAt}</time>
                <div dangerouslySetInnerHTML={{ __html: post.content}}/>
            </article>
        </main>
    </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({req, params}) => {
    const session = await getSession({req})
    const {slug} = params

    console.log(session)

    if(!session?.activeSubscription){
        return{
            redirect: {
                destination: `/posts/preview/${params.slug}`,
                permanent: false
            }
        }
    }

    const prismic = getPrismicClient(req)

    const response = await prismic.getByUID<any>('post', String(slug), {})

    const post = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-br',{
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }
    return {
        props: { post }
    }
}