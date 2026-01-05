import { useState } from 'react';
import { useCreateNetworkingConnection } from '../hooks/useEvents';
import { useAuth } from '../context/AuthContext';
import { MessageCircle, Users, UserPlus, Send, Heart, Handshake } from 'lucide-react';
import type { NetworkingConnection } from '../types/events';

interface NetworkingPanelProps {
  eventId: number;
  connections: NetworkingConnection[];
}

const NetworkingPanel = ({ eventId, connections }: NetworkingPanelProps) => {
  const { user } = useAuth();
  const createConnection = useCreateNetworkingConnection();
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectMessage, setConnectMessage] = useState('');

  const getConnectionTypeIcon = (type: string) => {
    switch (type) {
      case 'interested':
        return <Heart className="w-4 h-4" />;
      case 'connected':
        return <UserPlus className="w-4 h-4" />;
      case 'collaborated':
        return <Handshake className="w-4 h-4" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getConnectionTypeColor = (type: string) => {
    switch (type) {
      case 'interested':
        return 'text-pink-300 bg-pink-900/30 border-pink-400/50';
      case 'connected':
        return 'text-green-300 bg-green-900/30 border-green-400/50';
      case 'collaborated':
        return 'text-purple-300 bg-purple-900/30 border-purple-400/50';
      default:
        return 'text-cyan-300 bg-cyan-900/30 border-cyan-400/50';
    }
  };

  const getUserDisplayName = (connection: NetworkingConnection, isUser1: boolean) => {
    const userData = isUser1 ? connection.user1 : connection.user2;
    return userData?.user_metadata?.full_name || 
           userData?.user_metadata?.user_name || 
           'Unknown User';
  };

  const getOtherUser = (connection: NetworkingConnection) => {
    return connection.user1_id === user?.id ? connection.user2 : connection.user1;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-cyan-400" />
          <h3 className="text-xl font-semibold text-white">
            Networking ({connections.length})
          </h3>
        </div>

        <button
          onClick={() => setShowConnectModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-900/30 hover:bg-cyan-900/50 border border-cyan-400/50 rounded-lg text-cyan-300 transition"
        >
          <UserPlus className="w-4 h-4" />
          Connect with Attendees
        </button>
      </div>

      {/* Connections List */}
      {connections.length === 0 ? (
        <div className="text-center py-8">
          <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 mb-4">No networking connections yet</p>
          <p className="text-sm text-gray-500">
            Start connecting with other attendees to build your professional network!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {connections.map((connection) => {
            const otherUser = getOtherUser(connection);
            const isInitiator = connection.user1_id === user?.id;
            
            return (
              <div
                key={connection.id}
                className="bg-slate-800/30 border border-slate-700 rounded-lg p-4"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  {otherUser?.user_metadata?.avatar_url ? (
                    <img
                      src={otherUser.user_metadata.avatar_url}
                      alt="Avatar"
                      className="w-12 h-12 rounded-full ring-2 ring-cyan-400/50"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
                      <span className="text-lg text-gray-300">
                        {getUserDisplayName(connection, !isInitiator)[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}

                  {/* Connection Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-white">
                        {getUserDisplayName(connection, !isInitiator)}
                      </h4>
                      <span className={`
                        inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border
                        ${getConnectionTypeColor(connection.connection_type)}
                      `}>
                        {getConnectionTypeIcon(connection.connection_type)}
                        {connection.connection_type.charAt(0).toUpperCase() + connection.connection_type.slice(1)}
                      </span>
                    </div>

                    {connection.message && (
                      <p className="text-sm text-gray-300 mb-2">
                        "{connection.message}"
                      </p>
                    )}

                    <p className="text-xs text-gray-500">
                      {isInitiator ? 'You connected' : 'Connected with you'} • {' '}
                      {new Date(connection.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-slate-700 rounded-lg transition">
                      <MessageCircle className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Connection Stats */}
      <div className="bg-slate-800/20 border border-slate-700 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-cyan-400">
              {connections.length}
            </div>
            <div className="text-sm text-gray-400">Total Connections</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-pink-400">
              {connections.filter(c => c.connection_type === 'interested').length}
            </div>
            <div className="text-sm text-gray-400">Interested</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-green-400">
              {connections.filter(c => c.connection_type === 'connected').length}
            </div>
            <div className="text-sm text-gray-400">Connected</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-purple-400">
              {connections.filter(c => c.connection_type === 'collaborated').length}
            </div>
            <div className="text-sm text-gray-400">Collaborated</div>
          </div>
        </div>
      </div>

      {/* Connect Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Connect with Attendees
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Connection Message (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={connectMessage}
                    onChange={(e) => setConnectMessage(e.target.value)}
                    placeholder="Hi! I'd love to connect and discuss..."
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConnectModal(false)}
                    className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // This would typically show a list of attendees to connect with
                      setShowConnectModal(false);
                      setConnectMessage('');
                    }}
                    className="flex-1 px-4 py-2 bg-cyan-900/30 hover:bg-cyan-900/50 border border-cyan-400/50 rounded-lg text-cyan-300 transition"
                  >
                    <Send className="w-4 h-4 inline mr-2" />
                    Send Requests
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Networking Tips */}
      <div className="bg-gradient-to-r from-cyan-900/10 to-blue-900/10 border border-cyan-900/30 rounded-lg p-4">
        <h4 className="font-medium text-cyan-300 mb-2">💡 Networking Tips</h4>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Be genuine and specific in your connection messages</li>
          <li>• Mention shared interests or goals from the event</li>
          <li>• Follow up after the event to maintain connections</li>
          <li>• Offer value - share resources or insights</li>
        </ul>
      </div>
    </div>
  );
};

export default NetworkingPanel;