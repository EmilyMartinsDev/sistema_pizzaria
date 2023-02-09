import {useContext, FormEvent, useState} from 'react'
import Head from 'next/head'
import styles from '../../styles/home.module.scss'
import logoImg from '../../public/logo.svg'
import Image from 'next/image'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import Link from 'next/link'
import { AuthContext } from '../contexts/AuthContext'
import { toast } from 'react-toastify';
import { GetServerSideProps } from 'next'
import { canSSRGuest } from '../utils/canSSRGuest'


export default function Home() {
  const { signin } = useContext(AuthContext)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

 async function handleLogin(event: FormEvent){
      event.preventDefault()

      if(email === '' || password === ''){
        toast.error('preencha todos os campos')
        return;
      }

      setLoading(true)

      let data = {
       email, password
      }

     await signin(data)

     setLoading(false)
  }

  return (
    <>
   <Head>
    <title>Sujeito Pizza - faça seu login</title>
   </Head>
   <div className={styles.containerCenter}>
    <Image src={logoImg} alt="image pizzaria"/>

    <div className={styles.login}>
    <form onSubmit={handleLogin}>
    <Input placeholder='digite seu email' value={email} onChange={(e)=>{setEmail(e.target.value)}} type='text'/>
    <Input placeholder='digite sua senha' value={password} onChange={(e)=>{setPassword(e.target.value)}} type="password"/>
    <Button type="submit"  loading={false}>Acessar</Button>
    </form>
    </div>
   <Link legacyBehavior href="/signup">
   <a className={styles.text}>Nao possui uma conta? Cadastre-se</a>
   </Link>
   </div>
 


    </>
  )
}

export const getServerSideProps = canSSRGuest(async(ctx)=>{
  
  
  
  return{
    props:{

    }
  }
})