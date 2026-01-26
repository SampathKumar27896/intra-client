import axios from 'axios';
import { toast } from 'sonner';

const instance = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_BASE_URI_LOCAL,  withCredentials: true, headers: { 'Content-Type': 'application/json' }});
const fetcher = async(url, { arg }) => {
    try {
      //console.log("coming here", url, arg)
         //console.log(process.env.NEXT_PUBLIC_API_BASE_URI)
    const result = await instance.post(url,{
     ...arg,
  });
    toast(result.data.message);
    return result.data;
    }catch(error) {
      console.log(error.response.data)
      toast(error.response.data.message);
      return error.response.data
    }
   
}
const dataGetter = async(url: string) => {
    try {
      //console.log("coming here", url, arg)
         //console.log(process.env.NEXT_PUBLIC_API_BASE_URI)
         console.log("🔥 fetcher called with key:", url)
    const result = await instance.get(url);
   
    if(result.data.statusCode === 401) {
      window.location.href = '/login';
    }
    return result.data?.data;
    }catch(error) {
      console.log(error.response.data)
      toast(error.response.data.message);
      if(error.response.status === 401) {
        setTimeout(() => {  
          window.location.href = '/login';
        }, 1000)
      }
      return error.response.data
    }
   
}
export { dataGetter };
export default fetcher;