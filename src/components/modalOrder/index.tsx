import styles from './style.module.scss'
import Modal from 'react-modal'
import {FiX} from 'react-icons/fi'
import {OrderProps} from '../../pages/dashboard/index'
import { Button } from '../ui/Button';
interface ModalItemProps{
    isOpen: boolean;
    onRequestClose: ()=> void;
    order:OrderProps[];
    handleFinishOrder: (id:string)=>void;
}


export function ModalOrder({isOpen, onRequestClose, order, handleFinishOrder}:ModalItemProps){

    const customStyles ={
        content:{
            top: '50%',
            bottom: 'auto',
            left: '50%',
            right: 'auto',
            padding: '30px',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#1d1d2e',


           
        }
    }
    return(
        <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        style={customStyles}
        
        >
             <button type='button' onClick={onRequestClose}
             style={{background: 'transparent', border: 0}}
             className='react-modal-close'>
            <FiX color='#f34748' size={48}/>
            </button>   

            <section className={styles.section}>
            <h1>Detalhes do pedido</h1>
            <span>Mesa: {order[0]?.order.table}</span>
                {order.map((item)=>(
                    <div key={item.id} className={styles.container}>
                        <span><strong>Quantidade:</strong>  {item?.amount} - {item?.product?.name} </span>
                        <span><strong>Descrição:</strong>  {item?.product?.description}</span>

                        <span className={styles.price}><strong>Preço:</strong> {item?.product?.price}</span>
                        <hr/>
                    </div>

                ))}

                <button onClick={()=>handleFinishOrder(order[0]?.order?.id)} className={styles.btn}>Concluir pedido</button>
            </section>


        </Modal>

       
    )
}
