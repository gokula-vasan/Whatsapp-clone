import { Text, Image, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
 import {useEffect,useState} from "react";
 import "../global.css";
 import {getUser} from "@util/storage";

export default function WelcomeScreen() {
    const router = useRouter();
    const[loading,setLoading]=useState(false);

    const redirectUser = async()=>{
        try{
            setLoading(true)
            const user=await getUser();

            if(user){
                router.replace("/chats");
            }
        }
        catch(error){
            console.log("Error",error)
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        redirectUser();
    },[])

    if(loading)
        return <ActivityIndicator size={"large"} color={"green"} className="flex-1 justify-center"/>
    
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff', paddingHorizontal: 24 }}>
            
            {/* Logo */}
            <Image 
                style={{ width: 64, height: 64, marginBottom: 24 }}
                resizeMode="contain"
                source={require("../assets/images/WhatsApp Image.png")} 
            />

            {/* Welcome Text */}
            <Text style={{ fontSize: 24, fontWeight: '700', color: '#1f2937', marginBottom: 24 }}>
                Welcome to ChatApp!
            </Text>

            {/* Privacy and terms formatted properly inside one block */}
            <Text style={{ textAlign: 'center', fontSize: 14, color: '#4b5563', marginBottom: 32, lineHeight: 20 }}>
                Read our{' '}
                <Text style={{ color: '#3b82f6', fontWeight: '600' }}>Privacy Policy</Text>. 
                Tap "Agree & Continue" to accept the{' '}
                <Text style={{ color: '#3b82f6', fontWeight: '600' }}>Terms and Conditions</Text>.
            </Text>

            {/* Agree and Continue button */}
            <TouchableOpacity 
                style={{ backgroundColor: '#22c55e', paddingVertical: 14, borderRadius: 9999, width: '35%' }} // <-- Fixed style syntax here
                onPress={() => { router.push("/login"); }} // <-- Fixed: Moved onPress outside of the style object
            >
                <Text style={{ color: '#ffffff', textAlign: 'center', fontWeight: '700', fontSize: 16 }}>
                    Agree & Continue
                </Text>
            </TouchableOpacity>
            
        </View>
    );
} 