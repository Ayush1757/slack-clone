import AppLayout from '../components/layout/AppLayout';
import ChatView from '../components/chat/ChatView';

const DashboardPage = (): JSX.Element => {
  return (
    <AppLayout>
      <ChatView />
    </AppLayout>
  );
};

export default DashboardPage;
