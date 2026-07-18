import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';

import { workspaceService } from '../services/workspaceService';
import { channelService } from '../services/channelService';
import type { Workspace } from '../types/workspace';
import type { Channel } from '../types/channel';

interface WorkspaceContextValue {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  channels: Channel[];
  activeChannel: Channel | null;
  loading: boolean;
  fetchWorkspaces: () => Promise<void>;
  setActiveWorkspace: (workspace: Workspace | null) => void;
  fetchChannels: (workspaceId: string) => Promise<void>;
  setActiveChannel: (channel: Channel | null) => void;
  createWorkspace: (name: string, description?: string) => Promise<Workspace>;
  joinWorkspace: (inviteCode: string) => Promise<Workspace>;
  createChannel: (name: string, description?: string) => Promise<Channel>;
}

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(undefined);

export const WorkspaceProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchWorkspaces = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const { data } = await workspaceService.getAll();
      setWorkspaces(data.workspaces);
    } catch (error) {
      console.error('Failed to fetch workspaces:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchChannels = useCallback(async (workspaceId: string): Promise<void> => {
    try {
      const { data } = await channelService.getAll(workspaceId);
      setChannels(data.channels);
    } catch (error) {
      console.error('Failed to fetch channels:', error);
    }
  }, []);

  const createWorkspaceHandler = useCallback(
    async (name: string, description?: string): Promise<Workspace> => {
      const { data } = await workspaceService.create({ name, description });
      setWorkspaces((prev) => [data.workspace, ...prev]);
      return data.workspace;
    },
    [],
  );

  const joinWorkspaceHandler = useCallback(
    async (inviteCode: string): Promise<Workspace> => {
      const { data } = await workspaceService.joinByInvite(inviteCode);
      setWorkspaces((prev) => [data.workspace, ...prev]);
      return data.workspace;
    },
    [],
  );

  const createChannelHandler = useCallback(
    async (name: string, description?: string): Promise<Channel> => {
      if (!activeWorkspace) {
        throw new Error('No active workspace');
      }
      const { data } = await channelService.create(activeWorkspace.id, {
        name,
        description,
      });
      setChannels((prev) => [...prev, data.channel]);
      return data.channel;
    },
    [activeWorkspace],
  );

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        activeWorkspace,
        channels,
        activeChannel,
        loading,
        fetchWorkspaces,
        setActiveWorkspace,
        fetchChannels,
        setActiveChannel,
        createWorkspace: createWorkspaceHandler,
        joinWorkspace: joinWorkspaceHandler,
        createChannel: createChannelHandler,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = (): WorkspaceContextValue => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
