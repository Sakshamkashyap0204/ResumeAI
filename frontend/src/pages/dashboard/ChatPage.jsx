import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RiDeleteBinLine, RiSendPlaneLine, RiSparklingLine } from 'react-icons/ri';
import toast from 'react-hot-toast';
import { chatApi } from '../../api/chat.api';
import { useWorkspace } from '../../store/WorkspaceContext';
import Button from '../../components/ui/Button';
import Textarea from '../../components/ui/Textarea';

function notifyChatUpdated() {
  window.dispatchEvent(new Event('chat-updated'));
}

function formatAssistantContent(content) {
  return content
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => !/^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?$/.test(line))
    .map((line) => {
      if (line.includes('|')) {
        return line.split('|').map((cell) => cell.trim().replace(/\*\*/g, '')).filter(Boolean).join(' - ');
      }
      return line.replace(/\*\*/g, '').replace(/^#{1,6}\s*/, '').replace(/^[*-]\s+/, '• ');
    })
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function ChatPage() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const { importConversation } = useWorkspace();

  useEffect(() => {
    let active = true;

    async function loadConversation() {
      if (!conversationId) {
        if (active) {
          setConversation(null);
          setMessages([]);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      try {
        const { data } = await chatApi.getConversation(conversationId);
        if (active) {
          setConversation(data.data.conversation);
          setMessages(data.data.messages);
        }
      } catch (error) {
        if (active) {
          toast.error(error.response?.data?.message || 'Unable to load this chat');
          navigate('/dashboard/chat', { replace: true });
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadConversation();
    return () => { active = false; };
  }, [conversationId, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const message = content.trim();
    if (!message || isSending) return;

    setContent('');
    setIsSending(true);
    try {
      let activeConversationId = conversationId;
      if (!activeConversationId) {
        const { data } = await chatApi.createConversation();
        activeConversationId = data.data.conversation._id;
      }

      const { data } = await chatApi.sendMessage(activeConversationId, message);
      if (!conversationId) navigate(`/dashboard/chat/${activeConversationId}`, { replace: true });
      setConversation(data.data.conversation);
      setMessages((current) => [...current, ...data.data.messages]);
      notifyChatUpdated();
    } catch (error) {
      setContent(message);
      toast.error(error.response?.data?.message || 'Unable to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  const handleDelete = async () => {
    if (!conversationId) return;
    try {
      await chatApi.deleteConversation(conversationId);
      notifyChatUpdated();
      navigate('/dashboard/chat', { replace: true });
      toast.success('Chat deleted');
    } catch {
      toast.error('Unable to delete this chat');
    }
  };

  const handleUseForGeneration = () => {
    importConversation({ id: conversationId, title: conversation?.title });
    navigate('/dashboard');
    toast.success('Chat context added to Generate');
  };

  if (isLoading) {
    return <div className="h-full flex items-center justify-center text-sm text-[var(--color-text-muted)]">Loading chat...</div>;
  }

  return (
    <div className="h-screen flex flex-col max-w-4xl mx-auto">
      <header className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-[var(--color-border)]">
        <div className="min-w-0">
          <h1 className="text-sm font-semibold text-[var(--color-text-primary)] truncate">{conversation?.title || 'New chat'}</h1>
          <p className="text-xs text-[var(--color-text-muted)]">Muse AI Chat</p>
        </div>
        {conversationId && (
          <div className="flex items-center gap-1">
            <Button type="button" variant="secondary" size="sm" onClick={handleUseForGeneration}>Use for Generation</Button>
            <Button type="button" variant="ghost" size="sm" onClick={handleDelete} title="Delete chat" aria-label="Delete chat">
              <RiDeleteBinLine className="text-base" />
            </Button>
          </div>
        )}
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-accent-subtle)] flex items-center justify-center mb-4">
              <RiSparklingLine className="text-2xl text-[var(--color-accent)]" />
            </div>
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">What will you create?</h2>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">Ask Muse anything about writing, ideas, or creativity.</p>
          </div>
        ) : (
          <div className="space-y-6 max-w-3xl mx-auto">
            {messages.map((message) => (
              <div key={message._id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-6 whitespace-pre-wrap ${message.role === 'user' ? 'bg-[var(--color-accent)] text-white rounded-br-sm' : 'bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-bl-sm'}`}>
                  {message.role === 'assistant' ? formatAssistantContent(message.content) : message.content}
                </div>
              </div>
            ))}
            {isSending && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-[var(--color-surface-2)] border border-[var(--color-border)] text-sm text-[var(--color-text-muted)]">Muse is thinking...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="shrink-0 px-6 pb-6">
        <div className="relative max-w-3xl mx-auto p-2 rounded-xl bg-[var(--color-surface-1)] border border-[var(--color-border)] shadow-[var(--shadow-card)]">
          <Textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Muse..."
            rows={2}
            maxLength={10000}
            aria-label="Message Muse"
            className="border-0 bg-transparent focus:border-0 px-2 py-2 pr-14"
          />
          <Button type="submit" size="md" isLoading={isSending} disabled={!content.trim()} aria-label="Send message" title="Send message" className="absolute right-3 top-1/2 h-11 w-11 -translate-y-1/2 p-0 [&>svg]:h-5 [&>svg]:w-5">
            {!isSending && <RiSendPlaneLine className="text-xl" />}
          </Button>
        </div>
        <p className="mt-2 text-center text-xs text-[var(--color-text-muted)]">Enter to send, Shift+Enter for a new line</p>
      </form>
    </div>
  );
}

export default ChatPage;