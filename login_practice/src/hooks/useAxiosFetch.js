import { useState, useEffect } from "react";
import axios from 'axios';

const useAxiosFetch=(dataURL, trigger)=>{
    const [data, setData]=useState([]);

    useEffect(()=>{
        let isMounted=true;
        const source=axios.CancelToken.source();

        const fetchData=async(url)=>{
            try{
                const response=await axios.get(url,{cancelToken:source.token});
                if(isMounted){
                    setData(response.data);
                }
            }catch(error){
                if(isMounted){
                    console.error(error);
                    setData([]);
                }
            }
        }

        fetchData(dataURL);

        const cleanUp=()=>{
            isMounted=false;
            source.cancel();
        }
        return cleanUp;
    },[dataURL,trigger]);

    return {data};
}

export default useAxiosFetch;