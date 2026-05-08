
import { getHistoryNums, getMessByNum, postSendMessage, patchBotActive} from "../services/api";
import { useState, useEffect } from "react";
import { useAction } from "./useAction";

export const useMessages = () => {
    const [contacts, setContacts] = useState([]); //numeros wsp
    const [msgsMore, setmsgsMore] = useState([]); //msg wsp // lo setea handleGetMessByNum
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
    const handleUpdateBotState = (num,val) => {
        run(async ()=>{
            await patchBotActive(num,val)
        })
    }
    return {
        contacts,
        msgsMore,
        handleGetMessByNum,
        handleSendMenssage,
        handleUpdateBotState
    };
}