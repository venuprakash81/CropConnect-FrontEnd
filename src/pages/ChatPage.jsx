import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./ChatPage.css";

const API_BASE = "http://localhost:8081/api/chat";

// Change these according to the logged-in account.
// Roles: FARMER, BUYER, TRANSPORTER, WAREHOUSE, ADMIN
const MY_ROLE = "FARMER";
const MY_ID = 1;

const ROLES = ["ALL", "FARMER", "BUYER", "TRANSPORTER", "WAREHOUSE", "ADMIN"];

const roleLabel = (role) => {
  const labels = {
    FARMER: "Farmer",
    BUYER: "Buyer",
    TRANSPORTER: "Transporter",
    WAREHOUSE: "Warehouse",
    ADMIN: "Admin",
  };
  return labels[role] || role;
};

const getName = (contact) =>
  contact?.name || contact?.fullName || contact?.ownerName ||
  contact?.warehouseName || contact?.email || "User";

const getInitial = (name) => (name || "U").trim().charAt(0).toUpperCase();

const formatTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export default function ChatPage() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [activeRole, setActiveRole] = useState("ALL");
  const [messageText, setMessageText] = useState("");
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [mobileConversation, setMobileConversation] = useState(false);

  const loadContacts = useCallback(async () => {
    setLoadingContacts(true);
    setError("");

    try {
      const params = new URLSearchParams({
        viewerRole: MY_ROLE,
        viewerId: String(MY_ID),
      });

      const response = await fetch(`${API_BASE}/users?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Could not load users (${response.status})`);
      }

      const data = await response.json();
      setContacts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Could not load contacts.");
    } finally {
      setLoadingContacts(false);
    }
  }, []);

  const loadMessages = useCallback(async () => {
    if (!selectedContact) {
      setMessages([]);
      return;
    }

    try {
      const params = new URLSearchParams({
        role1: MY_ROLE,
        id1: String(MY_ID),
        role2: selectedContact.role,
        id2: String(selectedContact.id),
      });

      const response = await fetch(`${API_BASE}/messages?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Could not load messages (${response.status})`);
      }

      const data = await response.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Could not load messages.");
    }
  }, [selectedContact]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  useEffect(() => {
    if (!selectedContact) return;

    setLoadingMessages(true);
    loadMessages().finally(() => setLoadingMessages(false));

    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [selectedContact, loadMessages]);

  const filteredContacts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return contacts.filter((contact) => {
      const roleMatches = activeRole === "ALL" || contact.role === activeRole;
      const name = getName(contact).toLowerCase();
      const email = (contact.email || "").toLowerCase();

      return roleMatches && (!query || name.includes(query) || email.includes(query));
    });
  }, [contacts, search, activeRole]);

  const openConversation = (contact) => {
    setSelectedContact(contact);
    setMessages([]);
    setError("");
    setMobileConversation(true);
  };

  const sendMessage = async (event) => {
    event.preventDefault();

    const content = messageText.trim();
    if (!content || !selectedContact || sending) return;

    setSending(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderRole: MY_ROLE,
          senderId: MY_ID,
          receiverRole: selectedContact.role,
          receiverId: selectedContact.id,
          message: content,
        }),
      });

      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(responseText || `Message failed (${response.status})`);
      }

      setMessageText("");
      await loadMessages();
    } catch (err) {
      setError(err.message || "Could not send the message.");
    } finally {
      setSending(false);
    }
  };

  const startDeviceCheck = async (kind) => {
    if (!selectedContact) {
      setError("Select a contact first.");
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Camera and microphone access is not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: kind === "video",
      });

      stream.getTracks().forEach((track) => track.stop());

      alert(
        `${kind === "video" ? "Video" : "Voice"} device check successful. ` +
        "Live calls need WebRTC signaling between both users."
      );
    } catch (err) {
      setError(
        err.name === "NotAllowedError"
          ? "Please allow camera/microphone access in your browser."
          : "Could not access your camera or microphone."
      );
    }
  };

  return (
    <div className="chat-page">
      <div className={`chat-container ${mobileConversation ? "chat-mobile-conversation" : ""}`}>
        {/* CONTACT SIDEBAR */}
        <aside className="chat-sidebar">
          <div className="chat-sidebar-header">
            <div className="chat-title-row">
              <div>
                <h2>CropConnect Chat</h2>
                <p className="chat-subtitle">Connect with the marketplace</p>
              </div>
              <button
                type="button"
                className="chat-refresh-btn"
                onClick={loadContacts}
                title="Refresh contacts"
                aria-label="Refresh contacts"
              >
                ↻
              </button>
            </div>

            <input
              type="search"
              className="chat-search"
              placeholder="Search people..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="chat-role-filter">
            {ROLES.map((role) => (
              <button
                key={role}
                type="button"
                className={activeRole === role ? "active" : ""}
                onClick={() => setActiveRole(role)}
              >
                {role === "ALL" ? "All" : roleLabel(role)}
              </button>
            ))}
          </div>

          <div className="chat-contact-list">
            {loadingContacts && (
              <div className="chat-list-status">Loading contacts...</div>
            )}

            {!loadingContacts && filteredContacts.length === 0 && (
              <div className="chat-empty-contacts">
                No registered users found.
              </div>
            )}

            {filteredContacts.map((contact) => {
              const name = getName(contact);
              const isActive =
                selectedContact?.role === contact.role &&
                String(selectedContact?.id) === String(contact.id);

              return (
                <button
                  type="button"
                  key={`${contact.role}-${contact.id}`}
                  className={`chat-contact ${isActive ? "active" : ""}`}
                  onClick={() => openConversation(contact)}
                >
                  <span className={`chat-avatar avatar-${contact.role?.toLowerCase()}`}>
                    {getInitial(name)}
                  </span>

                  <span className="chat-contact-info">
                    <strong>{name}</strong>
                    <span className="chat-contact-email">
                      {contact.email || roleLabel(contact.role)}
                    </span>
                    <span className="chat-role-label">
                      {roleLabel(contact.role)}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* CHAT WINDOW */}
        <main className="chat-main">
          {!selectedContact ? (
            <div className="chat-placeholder">
              <div className="chat-placeholder-icon">✉</div>
              <h3>Welcome to CropConnect Chat</h3>
              <p>Select a farmer, buyer, transporter, warehouse owner, or admin to start a conversation.</p>
            </div>
          ) : (
            <>
              <header className="chat-header">
                <button
                  type="button"
                  className="chat-back-btn"
                  onClick={() => setMobileConversation(false)}
                  aria-label="Back to contacts"
                >
                  ←
                </button>

                <div className="chat-header-user">
                  <span className="chat-avatar">
                    {getInitial(getName(selectedContact))}
                  </span>
                  <div className="chat-header-details">
                    <h3>{getName(selectedContact)}</h3>
                    <p>{roleLabel(selectedContact.role)}</p>
                  </div>
                </div>

                <div className="chat-header-actions">
                  <button
                    type="button"
                    className="chat-call-btn"
                    onClick={() => startDeviceCheck("audio")}
                    title="Voice call"
                    aria-label="Voice call"
                  >
                    ☎ <span>Voice</span>
                  </button>
                  <button
                    type="button"
                    className="chat-call-btn"
                    onClick={() => startDeviceCheck("video")}
                    title="Video call"
                    aria-label="Video call"
                  >
                    ▣ <span>Video</span>
                  </button>
                </div>
              </header>

              {error && <div className="chat-error">{error}</div>}

              <section className="chat-messages">
                {loadingMessages && messages.length === 0 && (
                  <div className="chat-empty-messages">Loading messages...</div>
                )}

                {!loadingMessages && messages.length === 0 && (
                  <div className="chat-empty-messages">
                    No messages yet. Send the first message!
                  </div>
                )}

                {messages.map((message) => {
                  const isSent =
                    message.senderRole === MY_ROLE &&
                    String(message.senderId) === String(MY_ID);

                  return (
                    <div
                      key={message.id}
                      className={`chat-message-row ${isSent ? "sent" : "received"}`}
                    >
                      <div className={`chat-message ${isSent ? "sent" : "received"}`}>
                        <p>{message.message}</p>
                        <span className="chat-message-time">
                          {formatTime(message.sentAt)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </section>

              <form className="chat-input-area" onSubmit={sendMessage}>
                <textarea
                  className="chat-input"
                  placeholder="Type your message..."
                  value={messageText}
                  onChange={(event) => setMessageText(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      sendMessage(event);
                    }
                  }}
                  rows={1}
                />

                <button
                  type="submit"
                  className="chat-send-btn"
                  disabled={!messageText.trim() || sending}
                >
                  {sending ? "Sending..." : "Send ➤"}
                </button>
              </form>
            </>
          )}
        </main>
      </div>
    </div>
  );
}