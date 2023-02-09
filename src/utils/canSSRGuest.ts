import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { redirect } from "next/dist/server/api-utils";
import { parseCookies } from "nookies";

//paginas visitantes

export function canSSRGuest<P>(fn: GetServerSideProps<P>){
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>>=>{
        
        const cookie = parseCookies(ctx)

        if(cookie['@nextauth.token']){
            return {
                redirect:{
                    destination: '/dashboard',
                    permanent: false
                }
            }
        }

        return await fn(ctx)
    }
}