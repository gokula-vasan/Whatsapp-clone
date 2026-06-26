import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { useRouter } from "expo-router";

export default function LoginScreen(){
    const [phone, setPhone] = useState("+91");
    const router = useRouter();

    // whatsapp phone number validation
    const isValidNumber = /^\+\d{1,3}\s?\d{10}$/.test(phone);

    const handleNext = () => {
        if (!isValidNumber) {
            Alert.alert("Invalid number", "Enter a valid phone number.");
            return;
        }
        router.push({ pathname: "/otp", params: { phone } });
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }}>
            {/* Heading */}
            <Text style={{ fontSize: 26, fontWeight: '700', color: '#111827', marginBottom: 16, textAlign: 'center' }}>
                Enter your Phone Number
            </Text>

            {/* Description */}
            <Text style={{ color: '#6b7280', fontSize: 16, textAlign: 'center', marginBottom: 24, paddingHorizontal: 10 }}>
                WhatsApp will send an SMS to verify your Number
            </Text>
            
            {/* Phone number Input */}
            <TextInput
                style={{ borderWidth: 1, borderColor: '#d1d5db', padding: 16, fontSize: 18, borderRadius: 8, width: '35%', textAlign: 'center' }}
                placeholder="+91898754456"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
            />
            
            {/* Next Button */}
            <TouchableOpacity 
                style={{ 
                    padding: 16, 
                    width: '35%', 
                    backgroundColor: isValidNumber ? '#22c55e' : '#e5e7eb', 
                    borderRadius: 9999, 
                    marginTop: 24 
                }} 
                disabled={!isValidNumber}
                onPress={handleNext}
            >
                <Text style={{ color: isValidNumber ? '#ffffff' : '#9ca3af', textAlign: 'center', fontWeight: '700', fontSize: 18 }}>
                    Next
                </Text>
            </TouchableOpacity>
        </View>
    );
}