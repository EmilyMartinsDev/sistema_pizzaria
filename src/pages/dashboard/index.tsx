import { canSSRAuth } from "../../utils/canSSRAuth"
import Head from "next/head";
import {Header} from "../../components/Header";
import styles from './style.module.scss';
import {setupAPIClient} from '../../services/api'
import { useState } from "react";
import {FiRefreshCcw} from 'react-icons/fi';
import Modal from 'react-modal';
import {ModalOrder} from '../../components/modalOrder'
interface ListOrderItem{
  id: string;
  table: string | number;
  status: boolean;
  draft: boolean;
  name: string | null;

}

interface ListOrder{
  listOrder: ListOrderItem[];
}


export type OrderProps = {
  id: string;
  amount: number;
  order_ID: string;
  product_id: string;
  product:{
    id: string;
    name: string;
    price: string;
    description: string;
    banner: string;
  }
  order:{
    id: string;
    table: string | number;
    status: boolean;
    name: string | null;
  }
}

export default function Dashboard({listOrder}: ListOrder){

  const [orders, setOrders] = useState(listOrder || [])
  const [modalItem, setModalItem] = useState<OrderProps[]>();
  const [modalVisible, setModalVisible] = useState(false)


  function handleCloseModal(){
    setModalVisible(false)
  }

  async function handleModalView(id: string){
    const apiClient = setupAPIClient();
    try{
      const response = await apiClient.get('/order/datail',{
        params:{
          order_id: id
        }
      });
     setModalItem(response.data);
     setModalVisible(true);

    }catch(err){
      console.log(err)
    }


  }


 async function handleFinishOrder(id:string){

    try{
      const apiClient = setupAPIClient()
      await apiClient.put('/order/finish', {
        order_id: id,

      });

     const response = await apiClient.get('/orders')
      setOrders(response.data);

      setModalVisible(false);


    }catch(err){
      console.log(err)
    }
   
  }
  async function handleRefresh(){
    const apiClient = setupAPIClient()
   const response = await apiClient.get('/orders')
    setOrders(response.data)
  }

  Modal.setAppElement('#__next');


    return(
      <>
    <Head>
        <title>Painel sujeito pizzaria</title>
    </Head>
    <Header/>
      <div className={styles.container}>
        <div className={styles.containerHeader}>
        <h1 className={styles.title}>Pedidos</h1>
        <FiRefreshCcw onClick={handleRefresh} size={24}/>
        </div>
      <article className={styles.orders}>
      {orders.length === 0 && (
        <span>Nenhum pedido encontrado</span>
      )}

      </article>
      
       {orders.map((order)=>(
         <button key={order.id} onClick={()=>handleModalView(order.id)} className={styles.mesa}>
         <span>Mesa {order.table}</span> 
          </button>
       ))}

      </div>
      {modalVisible && (
       <ModalOrder
       isOpen={modalVisible}
       onRequestClose={handleCloseModal}
       order={modalItem}
       handleFinishOrder={handleFinishOrder}
       />
      )}
      </>
    )
}

export const getServerSideProps = canSSRAuth(async(ctx)=>{
  try{
    const apiClient = setupAPIClient(ctx);

    const response = await apiClient.get('/orders');

    if(!response.data){
      return {
        redirect:{
          destination: '/dashboard',
          permanent: false
    
          }
      }
    }

    return {
      props:{
        listOrder: response.data
      }
    }

  }catch(err){
    console.log(err.response);

    return {
      redirect:{
      destination: '/dashboard',
      permanent: false

      }
    }
  }

})