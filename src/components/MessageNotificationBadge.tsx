import { useConversations } from '../hooks/useMessaging';
import { useAuth } from '../hooks/useAuth';

const MessageNotificationBadge = () => {
  const { user } = useAuth();
  const { data: conversations = [] } = useConversations();

  if (!user) return null;

  const totalUnread = conversations.reduce((total, conv) => {
    return total + (conv.unread_count || 0);
  }, 0);

  if (totalUnread === 0) return null;

  return (
    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
      {totalUnread > 99 ? '99+' : totalUnread}
    </div>
  );
};

export default MessageNotificationBadge;