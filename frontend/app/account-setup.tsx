import { View, Text, TouchableOpacity, Image, TextInput, Alert, Platform,ActivityIndicator,BackHandler } from "react-native";
import axios from 'axios';
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import{fetchUser, saveUser as saveUserAPI, updateUser} from "@/util/api";
import {saveUser as saveUserStorage} from "@/util/storage";

const API_URL = Constants.expoConfig?.extra?.API_URL || "http://172.16.145.153:5000/api";

export default function AccountsetupScreen(){
    const [name, setName] = useState("");
    const params = useLocalSearchParams();
    const phone = params.phone ? (Array.isArray(params.phone) ? params.phone[0] : params.phone) : undefined;
    const [profileImage, setProfileImage] = useState("");
    const [Id, setId] = useState("");
    const router = useRouter(); 
    const[loading,setLoading]=useState(false);


    const loadUser = async () => {
        if (!phone) return;
        try {
          const data=  await fetchUser(phone)
            if (data) {
                setName(data.name || "");
                setId(data._id);
                setProfileImage(data.profileImage || "");
            }
        } catch (error) {
            console.log("No User Found in MongoDB", error);
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && result.assets?.length > 0) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const getImageFile = async (uri: string) => {
        if (Platform.OS === 'web') {
            const response = await fetch(uri);
            const blob = await response.blob();
            const fileType = blob.type || 'image/jpeg';
            return new File([blob], 'profile.jpg', { type: fileType });
        }

        return {
            uri,
            type: 'image/jpeg',
            name: 'profile.jpg',
        } as any;
    };

    
//    useEffect(() => {
//         fetchUser();
//     }, [phone]); 

    //Save and update profile
    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert("Error", "Please enter your name.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("phone", phone || "");
            formData.append("name", name);

            if (profileImage && !profileImage.startsWith("http")) {
                const imageFile = await getImageFile(profileImage);
                formData.append("profileImage", imageFile as any);
            }
            setLoading(true);

            let response;
            if (Id) {
                response=await updateUser(Id,formData)
            } else {
                response = await saveUserAPI(formData)
            }

            if (response) {
                await saveUserStorage(response)
                router.push("/chats");
            } else {
                Alert.alert("Error", "Something went wrong while saving your profile");
            }
        } catch (error) {
            console.log("Error saving profile:", (error as any).message);
            
        }
        finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        loadUser();
    }, [phone]);

    useEffect(() => {
        const handleBackPress =()=>{
            router.replace("/");
            return true;
        }
        const subscription = BackHandler.addEventListener("hardwareBackPress",handleBackPress);
        return () => {
            subscription.remove();
        };
    }, []); 


    if(loading) return loading && <ActivityIndicator size="large" color="green" className="flex-1 justify-center"/>

    return (
        <View style={{ flex: 1, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
            <Text style={{ fontSize: 26, fontWeight: '700', color: '#111827', marginBottom: 24 }}>
                Set up your profile
            </Text>
            
            {/* Profile Image Component */}
            <TouchableOpacity 
                style={{ 
                    width: 128, 
                    height: 128, 
                    borderRadius: 64, 
                    borderWidth: 2, 
                    borderColor: '#22c55e', 
                    backgroundColor: '#f3f4f6', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    marginBottom: 24, 
                    overflow: 'hidden' 
                }} 
                onPress={pickImage}
            >
                {profileImage ? (
                    <Image 
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                        source={{ uri: profileImage }} 
                    />
                ) : (
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 30, marginBottom: 4 }}>📷</Text>
                        <Text style={{ fontSize: 13, fontWeight: '600', color: '#4b5563', textAlign: 'center' }}>
                            Add profile
                        </Text>
                    </View>
                )}
            </TouchableOpacity>

            {/* Name input */}
            <TextInput 
                style={{ borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 16, width: '35%', fontSize: 18, marginBottom: 24, textAlign: 'center' }}
                placeholder="Enter your Name"
                value={name}
                onChangeText={setName}
            />

            {/* Save Button */}
            <TouchableOpacity 
                style={{ padding: 16, width: '35%', borderRadius: 9999, backgroundColor: '#22c55e' }}
                onPress={handleSave}
            >
                <Text style={{ color: '#ffffff', textAlign: 'center', fontWeight: '700', fontSize: 18 }}>
                    Save & continue
                </Text>
            </TouchableOpacity>
        </View>
    );
}