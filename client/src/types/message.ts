export interface MessageSender {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Message {
  id: string;
  workspace: string;
  channel: string;
  sender: MessageSender;
  content: string;
  editedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MessagesResponse {
  success: boolean;
  messages: Message[];
  hasMore: boolean;
}

export interface MessageResponse {
  success: boolean;
  message: Message;
}
