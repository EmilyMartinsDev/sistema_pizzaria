import styles from './style.module.scss'
import {ChangeEvent} from 'react'
import {useState} from 'react'
import Head from 'next/head'
import { Header } from '../../components/Header'
import {canSSRAuth} from '../../utils/canSSRAuth'
import {FiUpload} from 'react-icons/fi'
import { setupAPIClient } from '../../services/api'
import { FormEvent } from 'react'
import { toast } from 'react-toastify'
import FormData from 'form-data'

interface CategoryItemProps{
    id: string;
    name: string;
}

interface CategoryProps{
    category:CategoryItemProps[];
}



export default function Product({category}: CategoryProps){

    const [avatarURL, setAvatarURL] = useState('');
    const [imageAvatar, setImageAvatar] = useState<any | null>(null)
    const [categories, setCategories] = useState(category || []);
    const [selected, setSelected] = useState(0)
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');

     function handleFile(e: ChangeEvent<HTMLInputElement>){
        if(!e.target.files){
            return;
        }

        const image = e.target.files[0];

        if(!image){
            return;
        }

        if(image.type === 'image/png' || image.type === 'image/jpeg'){
            setImageAvatar(image )
            setAvatarURL(URL.createObjectURL(e.target.files[0]))
        }
    }

    function handleSelected(e: any){
        setSelected(e.target.value)
    }


 async function handleRegisterProduct(e:FormEvent){
        e.preventDefault()

        try{
            const data = new FormData()

            if(!name || !price || !description || !imageAvatar){
                toast.error('preencha todos os campos')
                return;
            }

            data.append('name', name);
            data.append('price', price);
            data.append('description', description)
            data.append('file', imageAvatar);
            data.append('category_id', categories[selected]?.id);

            const api = setupAPIClient()
            await api.post('/product', data)
            toast.success('cadastrado com sucesso')

        }catch(err){
            console.log(err.response);
            toast.error('erro ao cadastrar')
        }
    }


    return(

        
        <>
        <Head>
            <title>Novo produto</title>
        </Head>
        <div>
        <Header/>
        <main className={styles.container}>
            <h1>Novo Produto</h1>

            <form className={styles.form} onSubmit={handleRegisterProduct}>
            <label className={styles.labelAvatar}>
                <span>
                <FiUpload size={25} color="#FFF"/>

                </span>
                <input type='file' accept='image/png, image/jpeg' onChange={handleFile}/>

            {avatarURL && (
                <img src={avatarURL} alt="foto do produto" width={250} height={250} className={styles.preview} />
            )}
                
            </label>

                <select value={selected} onChange={handleSelected}>
                    {categories.map((item)=>(
                    <option className={styles.optionCategoory} value={item?.id} key={item?.id}>
                        {item?.name}
                    </option>
                    ))}
                   
                </select>
                <input
                className={styles.input}
                type='text'
                value={name}
                onChange={(e)=>{setName(e.target.value)}}
                placeholder='digite o nome do produto'
                />

                <input
                 className={styles.input}
                type='text'
                value={price}
                onChange={(e)=>{setPrice(e.target.value)}}
                placeholder='digite o preço do produto'
                />

                <textarea
                 className={styles.input}
                 value={description}
                 onChange={(e)=>{setDescription(e.target.value)}}
                placeholder='descreva seu produto'
                />

                <button className={styles.buttonAdd} type='submit'>Cadastrar</button>
            </form>

        </main>
        
        </div>
        
        
        </>
    )
}

export const getServerSideProps = canSSRAuth(async(ctx)=>{
    const apiClient = setupAPIClient(ctx);
    try{

        const response = await apiClient.get('/category');

       return{
        props:{
            category: response?.data 
        }
       }
    }catch(err){
        console.log(err)
        return{
            redirect:{
                destination: '/dashboard',
                permanent: false,
            }
        }
    }

})