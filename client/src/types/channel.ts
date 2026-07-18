export interface Channel {
  id: string;
  name: string;
  description: string;
  workspace: string;
  members: string[];
  isDefault: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChannelsResponse {
  success: boolean;
  channels: Channel[];
}

export interface ChannelResponse {
  success: boolean;
  channel: Channel;
}
