import { Server } from "socket.io";
import nodemailer from "nodemailer";
import crypto from "node:crypto";
import db from "../configs/db.js";

const MAX_TEXT = 500;
const MAX_NAME = 100;
const MAX_EMAIL = 254;
const HISTORY_LIMIT = 200;

const onlineVisitors = new Map();
const onlineOwners = new Set();

const clean = (value, maxLength = MAX_TEXT) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

const isEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const makeToken = () => crypto.randomBytes(32).toString("hex");

const tokenHash = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const uuid = () => crypto.randomUUID();

const toMessage = (row) => ({
  id: row.id,
  from: row.sender_type,
  text: row.message,
  createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
  isRead: Boolean(row.is_read),
});

const transporter =
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })
    : null;

// ---------------- OWNER PASSWORD ----------------

function verifyOwnerSecret(secret) {
  const expected = process.env.CHAT_OWNER_SECRET;

  if (!expected || typeof secret !== "string") {
    throw new Error("Owner authentication required");
  }

  const receivedHash = crypto.createHash("sha256").update(secret).digest();

  const expectedHash = crypto.createHash("sha256").update(expected).digest();

  if (!crypto.timingSafeEqual(receivedHash, expectedHash)) {
    throw new Error("Invalid owner password");
  }

  return true;
}

// ---------------- DATABASE ----------------

async function getConversation(id) {
  const [rows] = await db.execute(
    `SELECT
       id,
       visitor_name,
       visitor_email,
       visitor_token_hash,
       status,
       last_message_at,
       created_at
     FROM user_convo
     WHERE id = ?
     LIMIT 1`,
    [id],
  );

  return rows[0] ?? null;
}

async function getConversationByToken(token) {
  const [rows] = await db.execute(
    `SELECT
       id,
       visitor_name,
       visitor_email,
       visitor_token_hash,
       status,
       last_message_at,
       created_at
     FROM user_convo
     WHERE visitor_token_hash = ?
     LIMIT 1`,
    [tokenHash(token)],
  );

  return rows[0] ?? null;
}

async function getHistory(conversationId) {
  const [rows] = await db.execute(
    `SELECT id, sender_type, message, is_read, created_at
     FROM (
       SELECT id, sender_type, message, is_read, created_at
       FROM message_cofig
       WHERE conversation_id = ?
       ORDER BY created_at DESC, id DESC
       LIMIT ${HISTORY_LIMIT}
     ) AS recent_messages
     ORDER BY created_at ASC, id ASC`,
    [conversationId],
  );

  return rows.map(toMessage);
}

async function saveMessage(conversationId, sender, text) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const messageId = uuid();

    await connection.execute(
      `INSERT INTO message_cofig
       (id, conversation_id, sender_type, message, is_read)
       VALUES (?, ?, ?, ?, ?)`,
      [messageId, conversationId, sender, text, sender === "owner" ? 1 : 0],
    );

    await connection.execute(
      `UPDATE user_convo
       SET last_message_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [conversationId],
    );

    const [rows] = await connection.execute(
      `SELECT id, sender_type, message, is_read, created_at
       FROM message_cofig
       WHERE id = ?
       LIMIT 1`,
      [messageId],
    );

    await connection.commit();

    return toMessage(rows[0]);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function getConversationSummary(conversation) {
  const [lastRows] = await db.execute(
    `SELECT id, sender_type, message, is_read, created_at
     FROM message_cofig
     WHERE conversation_id = ?
     ORDER BY created_at DESC, id DESC
     LIMIT 1`,
    [conversation.id],
  );

  const [unreadRows] = await db.execute(
    `SELECT COUNT(*) AS unread_count
     FROM message_cofig
     WHERE conversation_id = ?
       AND sender_type = 'visitor'
       AND is_read = 0`,
    [conversation.id],
  );

  return {
    id: conversation.id,
    name: conversation.visitor_name,
    email: conversation.visitor_email,
    status: conversation.status,
    online: (onlineVisitors.get(conversation.id)?.size ?? 0) > 0,
    last: lastRows[0] ? toMessage(lastRows[0]) : null,
    unreadCount: Number(unreadRows[0]?.unread_count ?? 0),
    updatedAt: conversation.last_message_at ?? conversation.created_at,
  };
}

async function getAllConversations() {
  const [rows] = await db.execute(
    `SELECT
       id,
       visitor_name,
       visitor_email,
       status,
       last_message_at,
       created_at
     FROM user_convo
     ORDER BY COALESCE(last_message_at, created_at) DESC
     LIMIT 500`,
  );

  return Promise.all(rows.map(getConversationSummary));
}

async function emitConversationUpdate(io, conversationId) {
  const conversation = await getConversation(conversationId);

  if (!conversation) return;

  io.of("/admin").emit(
    "chat:conversation-updated",
    await getConversationSummary(conversation),
  );
}

// ---------------- ONLINE TRACKING ----------------

function addOnlineVisitor(conversationId, socketId) {
  if (!onlineVisitors.has(conversationId)) {
    onlineVisitors.set(conversationId, new Set());
  }

  onlineVisitors.get(conversationId).add(socketId);
}

function removeOnlineVisitor(conversationId, socketId) {
  const sockets = onlineVisitors.get(conversationId);

  if (!sockets) return;

  sockets.delete(socketId);

  if (sockets.size === 0) {
    onlineVisitors.delete(conversationId);
  }
}

// ---------------- EMAIL NOTIFICATION ----------------

async function notifyOwnerOffline(conversation, message) {
  if (onlineOwners.size > 0) return;

  if (!transporter || !process.env.OWNER_EMAIL) {
    console.warn("Owner is offline; email notification is not configured.");
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.ADMIN_MAIL_PORT,
      to: process.env.ADMIN_MAIL_PORT,
      subject: `New portfolio chat from ${conversation.visitor_name}`,
      text: [
        `Name: ${conversation.visitor_name}`,
        `Email: ${conversation.visitor_email}`,
        "",
        "New message:",
        message.text,
        "",
        "Open your private portfolio chat inbox to reply.",
      ].join("\n"),
    });
  } catch (error) {
    console.error("Chat notification email failed:", error.message);
  }
}

// ---------------- SOCKET.IO ----------------

export function initChat(httpServer, options = {}) {
  const configuredOrigins =
    options.origins ??
    (process.env.CHAT_ORIGINS || "http://localhost:5173")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean);

  const io = new Server(httpServer, {
    cors: {
      origin(origin, callback) {
        if (!origin || configuredOrigins.includes(origin)) {
          return callback(null, true);
        }

        return callback(new Error("Origin not allowed"));
      },
      methods: ["GET", "POST"],
      credentials: false,
    },
  });

  const admin = io.of("/admin");

  // OWNER AUTHENTICATION: password from backend .env
  admin.use((socket, next) => {
    const suppliedSecret = socket.handshake.auth?.secret;
    const ownerSecret = process.env.CHAT_ADMIN_SECRET;

    if (!ownerSecret || suppliedSecret !== ownerSecret) {
      return next(new Error("Invalid owner password"));
    }

    next();
  });

  admin.on("connection", async (socket) => {
    onlineOwners.add(socket.id);

    try {
      socket.emit("chat:conversations", await getAllConversations());
    } catch (error) {
      console.error("Unable to load conversations:", error.message);

      socket.emit("chat:error", {
        message: "Unable to load conversations",
      });
    }

    socket.on("chat:refresh", async (ack) => {
      try {
        const conversations = await getAllConversations();

        socket.emit("chat:conversations", conversations);

        if (typeof ack === "function") {
          ack({ ok: true });
        }
      } catch (error) {
        if (typeof ack === "function") {
          ack({ ok: false, message: "Refresh failed" });
        }
      }
    });

    socket.on("chat:history", async (payload, ack) => {
      try {
        // Compatible with frontend payload { id } or { conversationId }.
        const conversationId = clean(
          payload?.id ?? payload?.conversationId,
          36,
        );

        if (!conversationId) {
          throw new Error("Conversation ID is required");
        }

        const conversation = await getConversation(conversationId);

        if (!conversation) {
          throw new Error("Conversation not found");
        }

        const messages = await getHistory(conversationId);

        await db.execute(
          `UPDATE message_cofig
           SET is_read = 1
           WHERE conversation_id = ?
             AND sender_type = 'visitor'
             AND is_read = 0`,
          [conversationId],
        );

        const summary = await getConversationSummary(conversation);

        // Callback contract used by AdminChat.jsx.
        if (typeof ack === "function") {
          ack({
            ok: true,
            conversation: summary,
            messages,
          });
        }

        socket.emit("chat:conversation-updated", {
          ...summary,
          unreadCount: 0,
        });
      } catch (error) {
        if (typeof ack === "function") {
          ack({
            ok: false,
            message: error.message || "Unable to load history",
          });
        }
      }
    });

    socket.on("chat:reply", async (payload, ack) => {
      try {
        const conversationId = clean(
          payload?.id ?? payload?.conversationId,
          36,
        );

        const text = clean(payload?.text);

        if (!conversationId || !text) {
          throw new Error("Conversation ID and message are required");
        }

        if (text.length > MAX_TEXT) {
          throw new Error("Message is too long");
        }

        const conversation = await getConversation(conversationId);

        if (!conversation) {
          throw new Error("Conversation not found");
        }

        if (conversation.status === "closed") {
          throw new Error("This conversation is closed");
        }

        const message = await saveMessage(conversationId, "owner", text);

        // Deliver reply to the visitor's conversation room.
        io.to(`conversation:${conversationId}`).emit("chat:new-message", {
          conversationId,
          message,
        });

        await emitConversationUpdate(io, conversationId);

        if (typeof ack === "function") {
          ack({ ok: true, message });
        }
      } catch (error) {
        if (typeof ack === "function") {
          ack({
            ok: false,
            message: error.message || "Reply failed",
          });
        }
      }
    });

    socket.on("chat:close", async (payload, ack) => {
      try {
        const conversationId = clean(
          payload?.id ?? payload?.conversationId,
          36,
        );

        if (!conversationId) {
          throw new Error("Conversation ID is required");
        }

        await db.execute(
          `UPDATE user_convo
           SET status = 'closed'
           WHERE id = ?`,
          [conversationId],
        );

        io.to(`conversation:${conversationId}`).emit("chat:status", {
          status: "closed",
        });

        await emitConversationUpdate(io, conversationId);

        if (typeof ack === "function") {
          ack({ ok: true });
        }
      } catch (error) {
        if (typeof ack === "function") {
          ack({
            ok: false,
            message: error.message || "Unable to close conversation",
          });
        }
      }
    });

    socket.on("disconnect", () => {
      onlineOwners.delete(socket.id);
    });
  });

  // VISITOR CONNECTION
  io.on("connection", (socket) => {
    socket.data.conversationId = null;
    socket.data.visitorTokenHash = null;

    socket.on("visitor:start", async (payload, ack) => {
      try {
        const name = clean(payload?.name, MAX_NAME);
        const email = clean(payload?.email, MAX_EMAIL).toLowerCase();
        const suppliedToken = clean(payload?.token, 128);

        if (!email || !isEmail(email)) {
          throw new Error("Enter a valid email address");
        }

        let conversation;
        let visitorToken;

        if (suppliedToken) {
          // Restore an existing browser session using its token.
          conversation = await getConversationByToken(suppliedToken);

          if (!conversation) {
            throw new Error(
              "Your chat session has expired. Please start again.",
            );
          }

          if (conversation.visitor_email.toLowerCase() !== email) {
            throw new Error("This chat belongs to another email");
          }

          visitorToken = suppliedToken;
        } else {
          if (!name) {
            throw new Error("Enter your name");
          }

          // Do not let an unverified email claim someone else's history.
          const [existingRows] = await db.execute(
            `SELECT id, status
             FROM user_convo
             WHERE visitor_email = ?
             LIMIT 1`,
            [email],
          );

          if (existingRows.length > 0) {
            throw new Error(
              "A conversation already exists for this email. Restore it using the original browser session or implement email OTP verification.",
            );
          }

          visitorToken = makeToken();
          const conversationId = uuid();

          await db.execute(
            `INSERT INTO user_convo
             (id, visitor_name, visitor_email, status, visitor_token_hash)
             VALUES (?, ?, ?, 'open', ?)`,
            [conversationId, name, email, tokenHash(visitorToken)],
          );

          conversation = await getConversation(conversationId);
        }

        if (!conversation) {
          throw new Error("Unable to load conversation");
        }

        if (conversation.status === "closed") {
          throw new Error("This conversation is closed");
        }

        if (
          socket.data.conversationId &&
          socket.data.conversationId !== conversation.id
        ) {
          throw new Error("This connection already belongs to another chat");
        }

        // Prevent duplicate online counts on repeated visitor:start calls.
        if (socket.data.conversationId !== conversation.id) {
          socket.data.conversationId = conversation.id;
          socket.data.visitorTokenHash = tokenHash(visitorToken);

          await socket.join(`conversation:${conversation.id}`);
          addOnlineVisitor(conversation.id, socket.id);
        }

        const messages = await getHistory(conversation.id);

        if (typeof ack === "function") {
          ack({
            ok: true,
            conversation: {
              id: conversation.id,
              name: conversation.visitor_name,
              email: conversation.visitor_email,
              status: conversation.status,
            },
            token: visitorToken,
            messages,
          });
        }

        await emitConversationUpdate(io, conversation.id);

        admin.emit("chat:presence", {
          conversationId: conversation.id,
          online: true,
        });
      } catch (error) {
        if (typeof ack === "function") {
          ack({
            ok: false,
            message: error.message || "Unable to start chat",
          });
        }
      }
    });

    socket.on("chat:message", async (payload, ack) => {
      try {
        const conversationId = socket.data.conversationId;
        const storedHash = socket.data.visitorTokenHash;
        const text = clean(payload?.text);

        if (!conversationId || !storedHash) {
          throw new Error("Start the chat first");
        }

        if (!text) {
          throw new Error("Message cannot be empty");
        }

        const conversation = await getConversation(conversationId);

        if (!conversation || conversation.visitor_token_hash !== storedHash) {
          throw new Error("Chat authentication failed");
        }

        if (conversation.status === "closed") {
          throw new Error("This conversation is closed");
        }

        const message = await saveMessage(conversationId, "visitor", text);

        admin.emit("chat:new-message", {
          conversationId,
          message,
        });

        await emitConversationUpdate(io, conversationId);
        await notifyOwnerOffline(conversation, message);

        if (typeof ack === "function") {
          ack({ ok: true, message });
        }
      } catch (error) {
        if (typeof ack === "function") {
          ack({
            ok: false,
            message: error.message || "Message could not be sent",
          });
        }
      }
    });

    socket.on("disconnect", () => {
      const conversationId = socket.data.conversationId;

      if (!conversationId) return;

      removeOnlineVisitor(conversationId, socket.id);

      admin.emit("chat:presence", {
        conversationId,
        online: (onlineVisitors.get(conversationId)?.size ?? 0) > 0,
      });
    });
  });

  return io;
}
