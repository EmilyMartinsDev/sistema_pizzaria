
import Head from 'next/head'
import { AuthContext } from '../../contexts/AuthContext';
import { useContext } from 'react';
import {useState, FormEvent} from 'react'
import styles from '../../../styles/home.module.scss'
import logoImg from '../../../public/logo.svg'
import Image from 'next/image'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import Link from 'next/link'
import { toast } from 'react-toastify';
export default function SignUp() {

  const {signUp} = useContext(AuthContext)



const [name, setName] = useState('');
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')

const [loading, setLoading] = useState(false)



async function handleSignUp(e: FormEvent){
  e.preventDefault()

  if(name === '' || password === '' || email === ''){
    toast.error('preencha todos os campos')
    return
  }
  setLoading(true);

 let data = {
    name: name,
    email: email,
    password: password
  }

  signUp(data);
  

  setLoading(false);
}





  return (
    <>


   <Head>
    <title> faça seu cadastro agora!</title>
   </Head>
   <div className={styles.containerCenter}>
    <Image src={logoImg} alt="image pizzaria"/>
 
    <div className={styles.login}>
    <h1>Criando sua conta</h1>

    <form onSubmit={handleSignUp}>
    <Input placeholder='digite seu nome' value={name} onChange={(e)=>setName(e.target.value)} type='text'/>
    <Input placeholder='digite seu email' value={email} onChange={(e)=>setEmail(e.target.value)} type='text'/>
    <Input placeholder='digite sua senha' value={password} onChange={(e)=>setPassword(e.target.value)} type="password"/>
    <Button type="submit" loading={loading}>Cadastrar</Button>
    </form>
    </div>
   <Link legacyBehavior href="/">
   <a className={styles.text}>Já possui uma conta? faça seu login!</a>
   </Link>
   </div>
 


    </>
  )
}
