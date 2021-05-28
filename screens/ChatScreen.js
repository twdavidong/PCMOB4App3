import React, {useEffect, useState, useCallback} from "react";
import {StyleSheet, Text, View, Button, TouchableOpacity, ImageBackground, FlatList } from "react-native";
import firebase from "../database/firebaseDB";

import {MaterialCommunityIcons} from "@expo/vector-icons";
import {GiftedChat} from "react-native-gifted-chat";


// ======== const declaration ====================================

const db = firebase.firestore().collection("messages"); //
const auth = firebase.auth();
const anonymousUser = { name: "Anonymous", id: "1A" };  // from #learning
const image = { uri: "../assets/image.jpg" };


    export default function ChatScreen({navigation}) {  // ========= Start of Function ChatScreen ===============================
    const [messages, setMessages] = useState([]);
    const [currentUser, setCurrentUser] = useState(anonymousUser);
   
    useEffect(() => {  // ==== start of useEffect ======================================

        // ====== auth listener for log in and log out ==========================            
        firebase.auth().onAuthStateChanged((user) =>   {  
            

            if (user) {     
                            
                    navigation.navigate("Chat");   
                         setCurrentUser({  id: user.uid, name: user.email }); 
            } else    {
                        navigation.navigate("Login");    
                        setCurrentUser(anonymousUser);    
            }
        });



         // ==== loading from firebase =========================
        const unsubscribe = db                                              
            .orderBy("createdAt","desc")        
            .onSnapshot((collectionSnapshot) => {    
                const serverMessages = collectionSnapshot.docs.map((doc) => { 
                    const data = doc.data();                            
                    console.log(data);                                  
                const jsDate = new Date(data.createdAt.seconds * 1000); 
                    const returnData ={                               
                        ...data,                                      
                        createdAt: jsDate,                            
                    };                                                
                    return returnData;                                
                });                                                   
                setMessages(serverMessages);                          
            });                                                       

        // ======== logout button =====================================
        navigation.setOptions({                      
                headerRight:()  => (                      
                <TouchableOpacity onPress={logout}>       
                    <MaterialCommunityIcons               
                        name="logout"
                        size={24}
                        color="red"
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
        // auth.signOut();
        firebase.auth().signOut(); 
    }    

    // ================ return, rendering... Always at bottom ====================================
    
    return (
    

        <GiftedChat 
                
                messages = {messages}
                onSend = {(newMessages) => 
                    sendMessages(newMessages)}
                renderUsernameOnMessage={true}
                
                bottomOffset={26}
                //onPressAvatar={console.log}
                
                listViewProps={{
                    style: {backgroundColor:"#00cc00"}
                  //  style:{background: url ('../assets/image.jpg')}
                }}
                user={{
                   _id: 1,           // pg 258
                  // _id: currentUser.uid,
                  //  name: currentUser.email,
                }}
            />
    );


    const styles = StyleSheet.create({
        container: {
          flex: 1,
          flexDirection: "column"
        },
        image: {
          flex: 1,
          resizeMode: "cover",
          justifyContent: "center"
        },
        text: {
          color: "white",
          fontSize: 42,
          fontWeight: "bold",
          textAlign: "center",
          backgroundColor: "#000000a0"
        }
    });
} //========== End of Function ChatScreen ================================