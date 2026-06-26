import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';

export default function OTPScreen(){
    const { phone } = useLocalSearchParams(); 
    const router = useRouter();
    const [generatedOTP, setGenerateOTP] = useState("");
    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(30);
    const [error, setError] = useState("");

    // generated OTP (6 digits random)
    const generateRandomOTP = () => {
        const randomOTP = Math.floor(100000 + Math.random() * 900000).toString();
        setGenerateOTP(randomOTP);
        console.log("Generated OTP:", randomOTP);
    };

    const resendOtp = () => {
        if (timer === 0) {
            setError(""); // Clear previous errors on resend
            generateRandomOTP();
            setTimer(30);
        }
    };

    // Combined and corrected validation logic
    const handleVerify = () => {
        setError(""); // Reset error state

        if (otp.length !== 6) {
            setError("OTP must be 6 digits.");
            return;
        }
        
        if (otp !== generatedOTP) {
            setError("Incorrect OTP. Please try again.");
            return;
        }

        // Success - Navigate to account setup using route template parsing format
        console.log("Success! Navigating now...");
        // Direct navigation bypasses any alert callback issues on Windows/emulators
        router.push(`/account-setup?phone=${phone}`);
    };

    // generated OTP & start timer on screen load
    useEffect(() => {
        generateRandomOTP();
        
        const intervalId = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }}>
            {/* Enter title */}
            <Text style={{ fontSize: 26, fontWeight: '700', color: '#111827', marginBottom: 8 }}>
                Enter OTP
            </Text>

            {/* Description */}
            <Text style={{ color: '#6b7280', fontSize: 16, textAlign: 'center', marginBottom: 24, paddingHorizontal: 10 }}>
                A 6-digit code has been sent to {phone} ({generatedOTP})
            </Text>

            {/* OTP input */}
            <TextInput
                style={{ borderWidth: 1, borderColor: '#d1d5db', padding: 16, fontSize: 22, borderRadius: 8, width: '35%', textAlign: 'center', letterSpacing: 8 }}
                keyboardType="number-pad"
                value={otp}
                onChangeText={(text) => {
                    setError("");
                    setOtp(text);
                }}
                maxLength={6}
                placeholder="000000"
            />

            {/* error message fixed syntax and inline styling */}
            {error ? <Text style={{ color: '#ef4444', marginTop: 12, fontSize: 14, fontWeight: '500' }}>{error}</Text> : null}

            {/* Verify Button - Cleaned stray characters and re-attached onPress handler */}
            <TouchableOpacity 
                style={{ padding: 16, width: '35%', backgroundColor: '#22c55e', borderRadius: 9999, marginTop: 24 }} 
                onPress={handleVerify}
            >
                <Text style={{ color: '#ffffff', textAlign: 'center', fontWeight: '700', fontSize: 18 }}>
                    Verify
                </Text> 
            </TouchableOpacity>

            {/* Change Number */}
            <TouchableOpacity style={{ marginTop: 16 }} onPress={() => router.back()}>
                <Text style={{ color: '#3b82f6', fontSize: 16 }}>Change Number</Text>
            </TouchableOpacity>

            {/* Resend otp */}
            <TouchableOpacity style={{ marginTop: 16 }} onPress={resendOtp} disabled={timer > 0}>
                <Text style={{ color: timer > 0 ? '#9ca3af' : '#3b82f6', fontSize: 16, fontWeight: timer > 0 ? '400' : '600' }}>
                    {timer > 0 ? `Resend OTP in ${timer} sec` : "Resend OTP"}
                </Text>
            </TouchableOpacity>
        </View>
    );
}