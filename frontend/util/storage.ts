import AsyncStorage from "@react-native-async-storage/async-storage";

//save data to storage
export const saveToStorage = async (key: string, value: any) => {
    try{
        await AsyncStorage.setItem(key, JSON.stringify(value))
    }
    catch(error){
        console.log(`Error saving data [${key}]`,error)
    }
}
    

//remove data to storage
export const removeFromStorage = async (key: string) => {
    try{
        await AsyncStorage.removeItem(key)
    }
    catch(error){
        console.log(`Error saving data [${key}]`,error)
    }
}
   

//Get data from storage
export const  getFromStorage= async (key: string) => {
    try{
        const value=await AsyncStorage.getItem(key);
        return value? JSON.parse(value):null;
    }
    catch(error){
        console.log(`Error saving data [${key}]`,error)
    }
}

const USER_KEY='user';
export const saveUser =async (user:any)=> saveToStorage(USER_KEY,user)
export const removeUser =async ()=> removeFromStorage(USER_KEY)
export const getUser =async ()=> getFromStorage(USER_KEY)
