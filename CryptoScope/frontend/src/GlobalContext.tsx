import {createContext, type ReactNode, useContext, useEffect, useState} from "react";
import {fetchCryptos, fetchSentiment} from "./api.ts";
import type {CryptoDTO} from "./intefaces.ts";


interface GlobalState {
    allCryptos: CryptoDTO[];
    loading: boolean;
}

const GlobalContext = createContext<GlobalState | undefined>(undefined);

export const GlobalProvider = ({children}: {children: ReactNode}) => {
    const [allCryptos, setAllCryptos] = useState<CryptoDTO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCryptos()
            .then((res) => {
                setAllCryptos(res.data)
            })
            .catch(console.error)
            .finally(() => setLoading(false));

        fetchSentiment()
            .then(res => {
                console.log(res.data)
            })
            .catch(console.error)
    }, [])

    return (
        <GlobalContext.Provider value={{allCryptos, loading}} >
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error("useGlobal must be used inside GlobalProvider");
    }
    return context;
}