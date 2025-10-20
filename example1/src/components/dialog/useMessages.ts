import { useContext } from 'react'
import { createContext } from 'react'
import { AppDispatch } from 'src/store'
import { Message, setMBoxOpened, pushMessage } from 'src/store/messages';

type MessageParser = (s :string) => Message[];

export type MessagesContextValue = {
  showMessage: (m : string)=>void;
  showAlert: (m : string, details : string)=>void;
  parseMessage: (m : string, parser: MessageParser)=>void;
}

export const MessagesContext = (dispatch:AppDispatch)=>{
  if (!dispatch)
  return createContext<MessagesContextValue>({
      showMessage: (m : string)=>{
         alert(m)
      },
      showAlert: (m : string, details = '')=>{
        alert(m)
     },
     parseMessage: (m : string, parser: MessageParser = (s: string)=>[])=>{
      alert(m)
   }
  })
  else
    return createContext<MessagesContextValue>({
      showMessage: (m : string)=>{
        //const store_messages = useSelector((state: RootState) => state.messages)
        dispatch(pushMessage({
        color : 'black',
        size: '1em',
        weight: 'normal',
        message :m
        }));
        dispatch(setMBoxOpened(true));
      },
      showAlert: (m : string,details='')=>{
        //const store_messages = useSelector((state: RootState) => state.messages)
        dispatch(pushMessage({
        class:'',
        color : 'red',
        size: '1em',
        weight: 'bold',
        message :m
        }));
        if (details)
        dispatch(pushMessage({
          class:'details',
          color : 'red',
          size: '1em',
          weight: 'normal',
          message :details
          }));
          dispatch(setMBoxOpened(true));
      },
      parseMessage: (m : string, parser: MessageParser = (s: string)=>{
        return [{class:'',
                message:m,
                size: '1em',
                weight: 'normal',
                color:'black'},]
      }
      )=>{
        for (let m1 of parser(m)){
          dispatch(pushMessage(m1));
        }
        dispatch(setMBoxOpened(true));
     }
    })

}

export const useMessages = (dispatch :AppDispatch): MessagesContextValue => useContext(MessagesContext(dispatch))
