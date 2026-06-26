import AsyncStorage from "@react-native-async-storage/async-storage";
import {useRouter} from "expo-router";
import { TouchableOpacity, View, Text } from "react-native";
import {useEffect} from "react";
import {getUser} from "@/util/storage";

export default function ChatsScreen(){

    const router=useRouter()
    const logout=async()=>{
        await AsyncStorage.removeItem("user");

        //redirect to welcome screen
        router.push("/");
    }

       const getUserData =async()=>{
        const userdata =await getUser();
         console.log(userdata, 'userdata');
       }

    useEffect(()=>{
       getUserData();
       
    })

    const getUser=async()=>{
        return await AsyncStorage.getItem('user')
    }
    return <View className="flex-1 items-center justify-senter">
        <TouchableOpacity className="bg-red-500 rounded-full">
            <Text className="text-white p-3">Logout</Text>
        </TouchableOpacity>
    </View>
}