import React, { useEffect, useState } from "react";
import {
    loggedInUser,
    chatActiveContact,
    chatMessages,
} from "../atom/globalState";
import recoilPersist from "recoil-persist";
import ScrollToBottom from "react-scroll-to-bottom";
import "./Chat.css";
import {countNewMessages, findChatMessage, findChatMessages, getUsers} from "../../util/APIUtils";
import {Button, message} from "antd";
import {RecoilRoot, useRecoilState, useRecoilValue} from "recoil";
import {API_CHAT_URL, BASE_LOGO_PATH} from "../../constants";
import logo from "../../img/download.png";

var stompClient = null;
const Chat = (props) => {
    const currentUser = props.currentUser;
    const [text, setText] = useState("");
    const [contacts, setContacts] = useState([]);

    const [activeContact, setActiveContact] = useRecoilState(chatActiveContact);
    const [messages, setMessages] = useRecoilState(chatMessages);

    useEffect(() => {
        if (localStorage.getItem("accessToken") === null) {
            props.history.push("/login");
        }
        connect();
        loadContacts();
    }, []);


    useEffect(() => {
        if (activeContact === undefined) return;
        findChatMessages(activeContact.id, currentUser.id.toString()).then((msgs) =>
            setMessages(msgs)
        );
        loadContacts();
    }, [activeContact]);

    const connect = () => {
        const Stomp = require("stompjs");
        let SockJS = require("sockjs-client");
        SockJS = new SockJS(API_CHAT_URL + "/ws");
        stompClient = Stomp.over(SockJS);
        stompClient.connect({}, onConnected, onError);
    };

    const onConnected = () => {
        console.log("connected");
        console.log(currentUser);
        stompClient.subscribe(
            "/user/" + currentUser.id.toString() + "/queue/messages",
            onMessageReceived
        );
    };

    const onError = (err) => {
        console.log(err);
    };

    const onMessageReceived = (msg) => {
        const notification = JSON.parse(msg.body);
        const active = JSON.parse(sessionStorage.getItem("recoil-persist")).chatActiveContact;

        if (active.id.toString() === notification.senderId) {
            findChatMessage(notification.id).then((message) => {
                const newMessages = JSON.parse(sessionStorage.getItem("recoil-persist")).chatMessages;
                newMessages.push(message);
                setMessages(newMessages);
            });
        } else {
            message.info("Получено новое сообщение от " + notification.senderName);
        }
        loadContacts();
    };

    const sendMessage = (msg) => {
        if (msg.trim() !== "") {
            const message = {
                senderId: currentUser.id.toString(),
                recipientId: activeContact.id,
                senderName: currentUser.name,
                recipientName: activeContact.name,
                content: msg,
                timestamp: new Date(),
            };
            stompClient.send("/app/chat", {}, JSON.stringify(message));

            const newMessages = [...messages];
            newMessages.push(message);
            setMessages(newMessages);
        }
    };

    const loadContacts = () => {
        const promise = getUsers().then((users) =>
            users.map((contact) =>
                countNewMessages(contact.id, currentUser.id.toString()).then((count) => {
                    contact.newMessages = count;
                    return contact;
                })
            )
        );

        promise.then((promises) =>
            Promise.all(promises).then((users) => {
                setContacts(users);
                if (activeContact === undefined && users.length > 0) {
                    setActiveContact(users[0]);
                }
            })
        );
    };

    return (
        <div id="frame">
            <div id="sidepanel">
                <div id="profile">
                    <div class="wrap">
                        <img
                            id="profile-img"
                            src={
                                currentUser && currentUser.avatar ?
                                    currentUser.avatar.match("googleusercontent.com") ?
                                        currentUser.avatar :
                                        BASE_LOGO_PATH + currentUser.username :
                                    logo
                            }
                            class="online"
                            alt=""
                        />
                        <p>{currentUser.username}</p>
                        <div id="status-options">
                            <ul>
                                <li id="status-online" class="active">
                                    <span class="status-circle"></span> <p>Online</p>
                                </li>
                                <li id="status-away">
                                    <span class="status-circle"></span> <p>Away</p>
                                </li>
                                <li id="status-busy">
                                    <span class="status-circle"></span> <p>Busy</p>
                                </li>
                                <li id="status-offline">
                                    <span class="status-circle"></span> <p>Offline</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div id="search" />
                <div id="contacts">
                    <ul>
                        {contacts.map((contact) => (
                            <li onClick={() => setActiveContact(contact)}
                                class={
                                    activeContact && contact.id === activeContact.id
                                        ? "contact active"
                                        : "contact"
                                }
                            >
                                <div class="wrap">
                                   {/* <span class="contact-status online"></span>*/}
                                    <img id={contact.id} src={
                                        contact && contact.avatar ?
                                            contact.avatar.match("googleusercontent.com") ?
                                                contact.avatar :
                                                BASE_LOGO_PATH + contact.username :
                                            logo
                                    } alt="" />
                                    <div class="meta">
                                        <p class="name">{contact.username}</p>
                                        {contact.newMessages !== undefined &&
                                        contact.newMessages > 0 && (
                                            <p class="preview">
                                                Новое сообщение ({contact.newMessages})
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
              {/*  <div id="bottom-bar">
                    <button id="addcontact">
                        <i class="fa fa-user fa-fw" aria-hidden="true"></i>{" "}
                        <span>Profile</span>
                    </button>
                    <button id="settings">
                        <i class="fa fa-cog fa-fw" aria-hidden="true"></i>{" "}
                        <span>Settings</span>
                    </button>
                </div>*/}
            </div>
            <div class="content">
                <div class="contact-profile">
                    <img src={activeContact ? activeContact.avatar ?
                        activeContact.avatar.match("googleusercontent.com") ?
                            activeContact.avatar :
                            BASE_LOGO_PATH + activeContact.username :
                        logo: null} alt="" />
                    <p>{activeContact && activeContact.username}</p>
                </div>
                <ScrollToBottom className="messages">
                    <ul>
                        {messages.map((msg) => (
                            <li class={msg.senderId === currentUser.id.toString() ? "sent" : "replies"}>
                                {msg.senderId !== currentUser.id.toString() && (
                                    <img src={
                                        activeContact.avatar ?
                                            activeContact.avatar.match("googleusercontent.com") ?
                                                activeContact.avatar :
                                                BASE_LOGO_PATH + activeContact.username :
                                            logo
                                    } alt="" />
                                )}
                                <p>{msg.content}</p>
                            </li>
                        ))}
                    </ul>
                </ScrollToBottom>
                <div class="message-input">
                    <div class="wrap">
                        <input
                            name="user_input"
                            size="large"
                            placeholder="Напишите сообщение..."
                            value={text}
                            onChange={(event) => setText(event.target.value)}
                            onKeyPress={(event) => {
                                if (event.key === "Enter") {
                                    sendMessage(text);
                                    setText("");
                                }
                            }}
                        />

                        <Button
                            onClick={() => {
                                sendMessage(text);
                                setText("");
                            }}
                        style={{paddingTop: '10px'}}>
                            <div className={"button-chat-send-cont"}>
                                <ion-icon name="send" style={{height: '30px', width: '30px'}}/>
                            </div>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ChatContainer = (props) => {
    return (
        <div>
            {
                props.currentUser ? ( <Chat currentUser={props.currentUser} {...props} />) : null
            }
        </div>
    )
}

export default ChatContainer;
