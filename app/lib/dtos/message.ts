export type message = {
    id: number;
    content: string;
    sender_id: number;
    receiver_id: number;
    timestamp: Date;
};

export type chatMenuProps = {
    laboratory_id: number;
    current_id: string;
    usertype_id: number;
}

export type chatFormData = {
    users: fetchedChatUserWithCount[];
    tabValue: number;
    message: string | '';
    messages: fetchedMessages[];
    page: number;
    loadMoreDisabled: boolean;
};

export type fetchChatUsersData = {
    laboratory_id: number;
    usertype_id: number;
    current_id: number;
};

export type fetchedChatUser = {
    id: number;
    name: string;
};

export type fetchedChatUserWithCount = {
    id: number;
    name: string;
    unreadCount: number;
};

export type readMessagesData = {
    sender_id: number;
    receiver_id: number;
};

export type fetchMessagesData = {
    sender_id: number;
    receiver_id: number;
    page: number;
};

export type fetchedMessages = {
    id: number;
    content: string;
    sender_id: number;
    receiver_id: number;
    timestamp: Date;
    is_read: boolean
};

export type newMessageQuery = {
    content: string;
    sender_id: number;
    receiver_id: number;
};

export type fetchedAdminMessages = {
    id: number;
    name: string;
    unreadCount: any;
};

export type deleteMessageData = {
    id: number;
};

export type deleteMessageQuery = deleteMessageData;