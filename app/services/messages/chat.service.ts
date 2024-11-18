"use server"

import { deleteMessageData, fetchChatUsersData, fetchedMessages, fetchMessagesData, newMessageQuery, readMessagesData } from "@/app/lib/dtos/message";
import { countAllUnreadMessages, countUnreadMessages, createMessage, dropMessage, getMessages, readMessage } from "@/app/lib/queries/messages";
import { getLabScholars } from "@/app/lib/queries/scholar";
import { getAdmins } from "@/app/lib/queries/user";
import { getTypeAdmin, getTypeScholar } from "@/app/lib/queries/usertype";

export async function fetchChatUsers(data: fetchChatUsersData) {
    try {
        const adminType = await getTypeAdmin();
        const scholarType = await getTypeScholar();
        if (data.usertype_id === adminType) {
            try {
                const scholars = await getLabScholars(data.laboratory_id);
                const scholarsWithUnreadCount = await Promise.all(scholars.map(async (scholar) => {
                    const unreadCount = await countUnreadMessages(scholar.id, data.current_id);
                    return { ...scholar, unreadCount };
                }));
                return scholarsWithUnreadCount;
            } catch (error) {
                console.error("Error en fetchChatUsers:", error);
                throw error;
            };
        } else if (data.usertype_id === scholarType) {
            try {
                const admins = await getAdmins(data.laboratory_id);
                const adminsWithUnreadCount = await Promise.all(admins.map(async (admin) => {
                    const unreadCount = await countUnreadMessages(admin.id, data.current_id);
                    return { ...admin, unreadCount };
                }));
                return adminsWithUnreadCount;
            } catch (error) {
                console.error("Error en fetchChatUsers:", error);
                throw error;
            };
        } else {
            console.error("Tipo de usuario no reconocido")
        };
    } catch (error) {
        console.error("Error en fetchChatUsers:", error);
        throw error;
    };
};

export async function fetchChatMessages(data: fetchMessagesData) {
    try {
        const response = await getMessages(data.sender_id, data.receiver_id, data.page);
        return response;
    } catch (error) {
        console.error("Error en fetchChatUsers:", error);
        throw error;
    };
};

export async function fetchUnreadCount(id: number) {
    try {
        let response: number;
        response = await countAllUnreadMessages(id);
        return response;
    } catch (error) {
        console.error("Error en fetchChatUsers:", error);
    }
};

export async function setMessagesAsRead(data: readMessagesData) {
    try {
        try {
            await readMessage(data.sender_id, data.receiver_id);
            return { success: true };
        } catch(error) {
            console.error("Error editando mensaje:", error);
            return { success: false };
        }; 
    } catch (error) {
        console.error("Error en setMessagesAsRead:", error);
        return { success: false }
    };
};

export async function sendMessage(data: newMessageQuery) {
    try {
        const message = {
            content: data.content,
            receiver_id: data.receiver_id,
            sender_id: data.sender_id
        } as newMessageQuery;
        try {
            await createMessage(message);
            return { success: true };
        } catch (error) {
            console.error("Error al crear mensaje:", error);
            throw error;
        };
    } catch (error) {
        console.error("Error en sendMessage:", error);
        throw error;
    };
};

export async function deleteMessage(data: deleteMessageData) {
    try {
        try {
            await dropMessage(data);
            return { success: true };
        } catch (error) {
            console.error("Error al eliminar observación:", error);
            throw error;
        };
    } catch (error) {
        console.error("Error en deleteObservation:", error);
        throw error;
    };
};