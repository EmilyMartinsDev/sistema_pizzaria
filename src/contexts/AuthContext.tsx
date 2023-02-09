import { createContext, ReactNode, useState, useEffect } from "react";
import {destroyCookie} from 'nookies'
import  Router  from "next/router";
import { api } from "../services/apiClient";
import { setCookie, parseCookies } from "nookies";
import {toast } from 'react-toastify'
type AuthContextData ={
    user?: UserProps;
    isAuthenticated: boolean;
    signin: (credentials: SignInProps)=> Promise<void>;
    signOut: ()=> void;
    signUp: (credentials: SignUpProps)=> Promise<void>
 }

type  UserProps = {
    id: string;
    name: string;
    email: string;
}

type SignInProps = {
    email: string;
    password: string;
}

type AuthProviderProps = {
    children: ReactNode;
}

type  SignUpProps = {
    name: string;
    email: string;
    password: string;
}



export const AuthContext = createContext({} as AuthContextData);


export function signOut(){
    try{
        destroyCookie(undefined, '@nextauth.token');
        Router.push('/')
    }catch{
        console.log('erro ao deslogar')
    }
}


export function AuthProvider({children}:AuthProviderProps){
    


    const [user, setUser] = useState<UserProps> ()
    const isAuthenticated = !!user


    useEffect(()=>{
        const {"nextauth.token": token} = parseCookies()
        if(token){
            api.get('/me').then(res=>{
                const {email, name, id} = res.data

                setUser({
                    id, email, name
                })
            })
            .catch(() =>{
                signOut()
            })
        }
    },[])






   async function signin({email, password}: SignInProps){
      try{
        const response = await api.post('/session', {
            email, password
           
        });

        const {id, name, token} = response.data

        setCookie(undefined, '@nextauth.token', token, {

            maxAge: 60 * 60 * 24 * 30,
            path: '/' // todos os caminhos tem acesso ao cookie
        } );


        setUser({
            id, name, email
        })
        

        // passar o token para todas as requisições

        api.defaults.headers['Authorization'] = `Bearer ${token}`
        toast.success('logado com sucesso')

        // redirecionar / dashboard
        Router.push('/dashboard')

      }catch{
        toast.error('erro ao acessar')
        console.log('erro ao acessar')
      
      }
    }


    async function signUp({name, email, password}: SignUpProps){
        try{
            const response = api.post('/users', {
                name, email, password
            });
            toast.success('cadastrado com sucesso')
            Router.push('/')

        }catch(e){
            toast.error('erro ao cadastrar')
            console.log('erro ao cadastrar',e )
        }
    }


    return(
        <AuthContext.Provider value={{user, isAuthenticated, signin, signOut, signUp}}>
            {children}
        </AuthContext.Provider>
    )
}