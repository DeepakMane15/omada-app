import axiosInstance from "../utils/axios/axiosInstance";

// export const GetDeviceApi = async ()=> {
//     const response = await axiosInstance.post('http://172.16.0.100/api/snm-get/device-info');
//     return response.data; 
// };

export const GetDeviceApi = async (token,sessionId, requireCod=false) => {
    const response = await axiosInstance.post('snm-get/device-info', {token:token, sessionId: sessionId, requireCod: requireCod});
    return response;
};
