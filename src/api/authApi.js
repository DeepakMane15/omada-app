
import { PageRoutes } from "../common/AppConstant";
import axiosInstance from "../utils/axios/axiosInstance";

export const LoginApi = async (creds) => {
    const response = await axiosInstance.post(PageRoutes.LOGIN + `${process.env.REACT_APP_CLIENT_ID}&omadac_id=${process.env.REACT_APP_OMADA_ID}`, creds);
    return response;
};

export const GetAuthToken = async (data) => {
    const response = await axiosInstance.post(PageRoutes.AUTH_TOKEN + `${process.env.REACT_APP_CLIENT_ID}&omadac_id=${process.env.REACT_APP_OMADA_ID}&response_type=code`, {
        headers: {
            "Csrf-Token": data.csrfToken,
            "Cookie": "TPOMADA_SESSIONID=" + data.sessionId
        }
    });
    return response;
}

export const GetAccessToken = async (code) => {
    let data = { "client_id": process.env.REACT_APP_CLIENT_ID, "client_secret": process.env.REACT_APP_CLIENT_SECRET }
    const response = await axiosInstance.post(PageRoutes.ACCESS_TOKEN + `authorization_code&code=${code}`, data);
    return response;
}