import Head from 'next/head'
import {GetStaticProps} from 'next'
import { SubscribeButton } from '../components/subscribeButton'
import style from './home.module.scss'
import { stripe } from '../services/stripe'

interface  HomeProps  {
  product: {
    priceId: string,
    amount: number,
  };
}

export default function Home({product}: HomeProps) {
  return (
    <div className={style.fadeIn}>
      <Head>
        <title>Home | IG News</title>
      </Head>
      <main className={style.contentContainer}>
          <section className={style.heroSection}>
            <span>👏 Hey, welcome</span>
            <h1>
              News about <br/>
              the <span>React</span> world
            </h1>
            <p>
              Get acess to all the publications <br />
              <span>for {product.amount} month</span>
            </p>
            <SubscribeButton priceId={product.priceId}/>
          </section>
          <img src="./images/avatar.svg" alt="" />
      </main>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1L0n2TFaPXBhaDchWqEzYlqc')

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100)
  };
    
  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24
  }
}
