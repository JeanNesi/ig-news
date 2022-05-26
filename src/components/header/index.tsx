import { SingInButton } from '../singInButton'
import style from './style.module.scss'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ActiveLink } from '../activeLink'

export function Header() {
    return (
        <header className={style.headerContainer}>
            <div className={style.headerContent}>
                <Link href="/">
                    <a className={style.logo}><img src="../../../images/logo.svg" alt="" /></a>
                </Link>

                <nav>
                    <ActiveLink activeClassName={style.active} href="/">
                        <a>Home</a>
                    </ActiveLink>
                    <ActiveLink activeClassName={style.active} href='/posts' prefetch>
                        <a>Post</a>
                    </ActiveLink>
                </nav>
                <SingInButton/>
            </div>
        </header>
    )
}