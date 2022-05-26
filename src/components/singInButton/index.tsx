import style from'./style.module.scss'
import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'
import { signIn,  signOut, useSession } from 'next-auth/react' 

export function SingInButton() {
    const {data: session} = useSession()
    
    return session ? (
        <button
        className={style.singInButton}
        type="button"
        onClick={() => signOut()}
    >
        <FaGithub color="var(--green)"/>
        Jean Carlos Nesi
        <FiX color="#737388" className={style.closeIcon}/>
    </button>
    ) : (
        <button
        className={style.singInButton}
        type="button"
        onClick={() =>signIn('github')}
    >
        <FaGithub color="var(--yellow)"/>
        Sing in with GitHub
    </button>
    )
}
