
import { getHistoryNums, getMessByNum, postSendMessage, patchBotActive} from "../services/api";
import { useState, useEffect, useRef} from "react";
import { useAction } from "./useAction";
import { io } from "socket.io-client";
const API_URL = import.meta.env.VITE_API_URL
const socket = io(API_URL, { withCredentials: true });

export const useMessages = () => {
    const [contacts, setContacts] = useState([]); //numeros wsp
    const [msgsMore, setmsgsMore] = useState([]); //msg wsp // lo setea handleGetMessByNum
    const [selectedContact, setSelectedContact] = useState("");
    const selectedContactRef = useRef(selectedContact); // para socket
    const { loading, run, error } = useAction();
    

    useEffect(() => {
        handleGetHistNums();
      }, []);

    const handleGetHistNums = () => {
        run(async () => {
            const data = await getHistoryNums();
            setContacts(Array.isArray(data) ? data : [])
        })
    }
    const handleGetMessByNum = (num) => {
        run(async ()=>{
            const data = await getMessByNum(num);
            setmsgsMore(data)
        })
    }
    // mensajes que salen a usuario
    const handleSendMenssage = (from,msg) => {
        run(async ()=> {
            setmsgsMore(prev => ({
                ...prev, 
                messages: [
                ...prev.messages, 
                {
                    role: 'model', 
                    content:msg,
                    created_at: new Date()
                }]
            }));
            await postSendMessage(from,msg)
        })
    }
    const handleBotState = async (val) =>{
        handleUpdateBotState(selectedContact, val)
        setmsgsMore(prev => ({
                ...prev,
                bot_active: val
            }));
    }
    const handleUpdateBotState = (num,val) => {
        run(async ()=>{
            await patchBotActive(num,val)
        })
    }
    useEffect(() => {
        selectedContactRef.current = selectedContact;
    }, [selectedContact]);
    // mensajes que llegan de usuario
    useEffect(() => {
        const handleMessage = (data) => {
          if (String(data.telefono) == String(selectedContactRef.current)) {
    
            setmsgsMore(prev => ({
              ...prev,
              messages: [
                ...(prev?.messages || []),
                {
                  role: data.role,
                  content: data.content,
                  created_at: new Date()
                }
              ]
            }));
          }
        };
        socket.on("nuevo_mensaje", handleMessage);
        return () => {
          socket.off("nuevo_mensaje", handleMessage);
        };
    }, []);

    return {
        contacts,
        msgsMore,
        handleGetMessByNum,
        handleSendMenssage,
        selectedContact, 
        setSelectedContact,
        handleBotState
    };
}