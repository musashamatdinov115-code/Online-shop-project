import { apiClient } from "./api";

export async function loginPost(emailValue: string, passwordValue: string): Promise<string | null> {
    try {
        const response = await apiClient.post('/auth/login', {email : emailValue, password :passwordValue})
        console.log("jaqsi jaqsi",response.data);
        if (response.data && response.data.data && response.data.data.token) {
            const token = response.data.data.token;
            localStorage.setItem("token", token);
            return token;
        }
        return null
    } catch (error : any) {
        console.log(error);
        return null
    }

}

export async function registerPost(nameValue : string, emailValue : string, passwordValue : string): Promise<string | null> {
    try {
        const response = await apiClient.post('/auth/register', {
            name : nameValue,
            email : emailValue,
            password : passwordValue
        })
        console.log(response);
        
        if (response.data && response.data.data && response.data.data.token) {
            const token = response.data.data.token;
            localStorage.setItem("token", token);
            localStorage.setItem("userName", nameValue)
            return token;
        }
        return null
    } catch (error : any) {
        console.log(error);
        return null
    }
}
