import React, {useEffect, useState} from "react";
import {StyleSheet, Text, View, Button, TouchableOpacity} from "react-native";
import firebase from "../database/firebaseDB";

import {MaterialCommunityIcons} from "@expo/vector-icons";
import {GiftedChat} from "react-native-gifted-chat";

// ======== const declaration ====================================

const db = firebase.firestore().collection("messages");
const auth = firebase.auth();

export default function ChatScreen({navigation}) {  // ========= Start of Function ChatScreen ===============================
    const [messages, setMessages]= useState([]);

   
    useEffect(() => {  // ==== start of useEffect ======================================

        // ====== auth listener for log in and log out ==========================            
        //   firebase.auth().onAuthStateChanged((user) =>   {
        const unsubAuth = auth.onAuthStateChanged((user) => {
            if (user) {
                        navigation.navigate("Chat by David Ong TW"); //,{id: user.id, email: user.email}
            } else    {
                        navigation.navigate("Login");    
            }
        });



         // ==== loading from firebase =========================
        const unsubscribe = db
            .orderBy("createdAt","desc")
            .onSnapshot((collectionSnapshot) => {
                const serverMessages = collectionSnapshot.docs.map((doc) => {
                    const data = doc.data();

                    const returnData ={
                        ...doc.data(),
                        createdAt: new Date(data.createdAt.seconds * 1000),
                    };
                    return returnData;
                });
                setMessages(serverMessages);
            });



        // ======== logout =====================================
        navigation.setOptions({
            headerRight:()  => (
                <TouchableOpacity onPress={logout}>
                    <MaterialCommunityIcons
                        name="logout"
                        size={24}
                        color="grey"
                        style={{marginRight:20}}
                        />
                </TouchableOpacity>
            ),
        });

        // ============ returning unsubs ==================
        return () => { 
            unsubscribe();
            unsubAuth();
        };

    }, []); // ========= end of useEffect =======================

    
    // ==================== send message Function ===================
    function sendMessages(newMessages){

        console.log(newMessages);

        db.add(newMessages[0]);
    }

    // ================  logout Function ==========================
    function logout() {
        auth.signOut();
    }    

    // ================ return, Always at bottom ====================================   
    return (
        <GiftedChat 
                messages = {messages}
                onSend = {(newMessages) => 
                    sendMessages(newMessages)}
                renderUsernameOnMessage={true}
                listViewProps={{
                    style:{backgroundColor: "#00cc00"},
                }}
                user={{
                    _id: 1,
                    
                }}
        />
    );
} //========== End of Function ChatScreen ================================