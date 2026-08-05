import axios from "axios";

const axiosInstance = axios.create({

    timeout:10000,

    headers:{
        "Content-Type":"application/json"
    }

});

axiosInstance.interceptors.response.use(

    response=>response,

    error=>{

        if(error.response){

            switch(error.response.status){

                case 400:

                    console.error("Bad Request");

                    break;

                case 401:

                    console.error("Unauthorized");

                    break;

                case 404:

                    console.error("Not Found");

                    break;

                case 500:

                    console.error("Internal Server Error");

                    break;

            }

        }

        return Promise.reject(error);

    }

);

export default axiosInstance;