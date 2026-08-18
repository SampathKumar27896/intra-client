import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
type FetcherArgs<TArg> = {
  arg: TArg
}

const instance = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_BASE_URI,  withCredentials: true, headers: { 'Content-Type': 'application/json' }});
const fetcher = async <TArg, TResponse>(
  url: string, 
  { arg }: FetcherArgs<TArg>
): Promise<TResponse> => {
    try {
      let result;
      if(url === 'login') {
            result = await axios.post('/api/auth/login', {
            ...arg,
          },{
            headers: { 'Content-Type': 'application/json' },
          });
      } else {
        result = await instance.post(url,{
        ...arg,
        });
    }
    toast(result.data.message);
    return result.data;
    }catch(error: unknown) {
      if (error instanceof AxiosError) {
        toast(error.response?.data?.message ?? "Something went wrong")
        return error.response?.data
      }

      if (error instanceof Error) {
        toast(error.message)
      }

        throw error
    }
   
}
const dataGetter = async(url: string) => {
    try {
      
         console.log("🔥 fetcher called with key:", url)
    const result = await instance.get(url);
   
    if(result.data.statusCode === 401) {
      window.location.href = '/login';
    }
    return result.data?.data;
    }catch(error: unknown) {
      if (error instanceof AxiosError) {
        toast(error.response?.data?.message ?? "Something went wrong")
        if(error.response && error.response.status === 401) {
        setTimeout(() => {  
          window.location.href = '/login';
        }, 1000)
      }
      return error?.response?.data;
      }
    }
   
}
export { dataGetter };
export default fetcher;