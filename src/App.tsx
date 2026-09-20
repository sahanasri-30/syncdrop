import { useEffect, useMemo, useState } from "react";
import { supabase } from "./lib/supabase";

import {
  Copy,
  LogIn,
  Plus,
  Send,
  Wifi,
  WifiOff,
  MessageSquare,
  Upload,
  Download,
  Image as ImageIcon,
  FileText,
  X,
  Clock,
  RefreshCw,
} from "lucide-react";

type Message = {
  id: string;
  room_code: string;
  sender_device_id: string;
  sender_device_name: string;
  kind: string;
  text: string;
  created_at: string;
};

type SharedFile = {
  id: string;
  room_code: string;
  sender_device_id: string;
  sender_device_name: string;
  file_name: string;
  file_path: string;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  created_at: string;
};

const generateId = () => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};

const getDeviceId = () => {
  const saved = localStorage.getItem("syncdrop_device_id");

  if (saved) return saved;

  const id = generateId();

  localStorage.setItem("syncdrop_device_id", id);

  return id;
};

const generateRoomCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let code = "";

  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  return code;
};

const formatFileSize = (size: number | null) => {
  if (!size) return "";

  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const isImage = (type: string | null) => {
  return !!type && type.startsWith("image/");
};

function App() {
  const deviceId = useMemo(() => getDeviceId(), []);

  const [deviceName, setDeviceName] = useState(() => {
    return (
      localStorage.getItem("syncdrop_device_name") ||
      `Device-${Math.floor(Math.random() * 9999)}`
    );
  });

  const [roomCode, setRoomCode] = useState("");
  const [enteredRoomCode, setEnteredRoomCode] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);
  const [files, setFiles] = useState<SharedFile[]>([]);

  const [messageText, setMessageText] = useState("");

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [connected, setConnected] = useState(false);

  const [error, setError] = useState("");

  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    localStorage.setItem("syncdrop_device_name", deviceName);
  }, [deviceName]);

  /*
   * CLOCK
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /*
   * LOAD ROOM
   */
  useEffect(() => {
    if (!roomCode) return;

    let messageChannel: ReturnType<typeof supabase.channel> | null = null;

    let fileChannel: ReturnType<typeof supabase.channel> | null = null;

    const loadRoom = async () => {
      setLoading(true);
      setError("");

      /*
       * Load room
       */
      const { data: room, error: roomError } = await supabase
        .from("rooms")
        .select("*")
        .eq("code", roomCode)
        .maybeSingle();

      if (roomError) {
        setError(roomError.message);
        setLoading(false);
        return;
      }

      if (!room) {
        setError("Room not found.");
        setLoading(false);
        return;
      }

      setExpiresAt(room.expires_at || null);

      /*
       * Load messages
       */
      const { data: messageData, error: messageError } = await supabase
        .from("messages")
        .select("*")
        .eq("room_code", roomCode)
        .order("created_at", {
          ascending: true,
        });

      if (messageError) {
        setError(messageError.message);
      } else {
        setMessages((messageData as Message[]) || []);
      }

      /*
       * Load files
       */
      const { data: fileData, error: fileError } = await supabase
        .from("shared_files")
        .select("*")
        .eq("room_code", roomCode)
        .order("created_at", {
          ascending: true,
        });

      if (!fileError) {
        setFiles((fileData as SharedFile[]) || []);
      }

      /*
       * MESSAGE REALTIME
       */
      messageChannel = supabase
        .channel(`messages-${roomCode}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `room_code=eq.${roomCode}`,
          },
          (payload) => {
            const message = payload.new as Message;

            setMessages((current) => {
              if (current.some((item) => item.id === message.id)) {
                return current;
              }

              return [...current, message];
            });
          }
        )
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            setConnected(true);
          }
        });

      /*
       * FILE REALTIME
       */
      fileChannel = supabase
        .channel(`files-${roomCode}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "shared_files",
            filter: `room_code=eq.${roomCode}`,
          },
          (payload) => {
            const file = payload.new as SharedFile;

            setFiles((current) => {
              if (current.some((item) => item.id === file.id)) {
                return current;
              }

              return [...current, file];
            });
          }
        )
        .subscribe();

      setLoading(false);
    };

    loadRoom();

    return () => {
      if (messageChannel) {
        supabase.removeChannel(messageChannel);
      }

      if (fileChannel) {
        supabase.removeChannel(fileChannel);
      }

      setConnected(false);
    };
  }, [roomCode]);

  /*
   * CREATE ROOM
   */
  const createRoom = async () => {
    setLoading(true);
    setError("");

    try {
      const newCode = generateRoomCode();

      const expiry = new Date(
        Date.now() + 30 * 60 * 1000
      ).toISOString();

      const { error: insertError } = await supabase
        .from("rooms")
        .insert({
          code: newCode,
          device_id: deviceId,
          device_name: deviceName,
          status: "online",
          expires_at: expiry,
        });

      if (insertError) {
        setError(insertError.message);
        return;
      }

      setRoomCode(newCode);
      setEnteredRoomCode(newCode);
      setExpiresAt(expiry);
    } catch (err) {
      console.error(err);
      setError("Unable to create room.");
    } finally {
      setLoading(false);
    }
  };

  /*
   * JOIN ROOM
   */
  const joinRoom = async () => {
    const code = enteredRoomCode.trim().toUpperCase();

    if (!code) {
      setError("Enter a room code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data, error: roomError } = await supabase
        .from("rooms")
        .select("*")
        .eq("code", code)
        .maybeSingle();

      if (roomError) {
        setError(roomError.message);
        return;
      }

      if (!data) {
        setError("Room not found.");
        return;
      }

      if (
        data.expires_at &&
        new Date(data.expires_at).getTime() < Date.now()
      ) {
        setError("This room has expired.");
        return;
      }

      setExpiresAt(data.expires_at || null);

      setRoomCode(code);
    } catch (err) {
      console.error(err);
      setError("Unable to join room.");
    } finally {
      setLoading(false);
    }
  };

  /*
   * SEND MESSAGE
   */
  const sendMessage = async () => {
    const text = messageText.trim();

    if (!text || !roomCode) return;

    setLoading(true);
    setError("");

    try {
      const { data, error: insertError } = await supabase
        .from("messages")
        .insert({
          room_code: roomCode,
          sender_device_id: deviceId,
          sender_device_name: deviceName,
          kind: "text",
          text,
        })
        .select()
        .single();

      if (insertError) {
        setError(insertError.message);
        return;
      }

      if (data) {
        setMessages((current) => {
          if (current.some((item) => item.id === data.id)) {
            return current;
          }

          return [...current, data as Message];
        });
      }

      setMessageText("");
    } catch (err) {
      console.error(err);
      setError("Unable to send message.");
    } finally {
      setLoading(false);
    }
  };

  /*
   * UPLOAD FILE
   */
  const uploadFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file || !roomCode) return;

    setUploading(true);
    setError("");

    try {
      /*
       * Limit to 10 MB for demo
       */
      if (file.size > 10 * 1024 * 1024) {
        setError("File must be smaller than 10 MB.");
        return;
      }

      const safeName = file.name.replace(
        /[^a-zA-Z0-9._-]/g,
        "_"
      );

      const path = `${roomCode}/${Date.now()}-${safeName}`;

      /*
       * Upload to Supabase Storage
       */
      const { error: uploadError } = await supabase.storage
        .from("syncdrop-files")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error(uploadError);
        setError(uploadError.message);
        return;
      }

      /*
       * Public URL
       */
      const { data: publicData } = supabase.storage
        .from("syncdrop-files")
        .getPublicUrl(path);

      const publicUrl = publicData.publicUrl;

      /*
       * Save file information
       */
      const { data, error: dbError } = await supabase
        .from("shared_files")
        .insert({
          room_code: roomCode,
          sender_device_id: deviceId,
          sender_device_name: deviceName,
          file_name: file.name,
          file_path: path,
          file_url: publicUrl,
          file_type: file.type || "application/octet-stream",
          file_size: file.size,
        })
        .select()
        .single();

      if (dbError) {
        setError(dbError.message);
        return;
      }

      if (data) {
        setFiles((current) => {
          if (current.some((item) => item.id === data.id)) {
            return current;
          }

          return [...current, data as SharedFile];
        });
      }
    } catch (err) {
      console.error(err);
      setError("Unable to upload file.");
    } finally {
      setUploading(false);

      event.target.value = "";
    }
  };

  /*
   * COPY ROOM
   */
  const copyRoomCode = async () => {
    if (!roomCode) return;

    try {
      await navigator.clipboard.writeText(roomCode);
    } catch (err) {
      console.error(err);
    }
  };

  /*
   * LEAVE ROOM
   */
  const leaveRoom = () => {
    setRoomCode("");
    setMessages([]);
    setFiles([]);
    setEnteredRoomCode("");
    setConnected(false);
    setError("");
    setExpiresAt(null);
  };

  /*
   * REFRESH
   */
  const refreshRoom = () => {
    if (!roomCode) return;

    setMessages([]);
    setFiles([]);

    const current = roomCode;

    setRoomCode("");

    setTimeout(() => {
      setRoomCode(current);
    }, 50);
  };

  /*
   * ROOM TIMER
   */
  const getRemainingTime = () => {
    if (!expiresAt) return "";

    const difference =
      new Date(expiresAt).getTime() - now;

    if (difference <= 0) {
      return "Expired";
    }

    const minutes = Math.floor(
      difference / 1000 / 60
    );

    const seconds = Math.floor(
      (difference / 1000) % 60
    );

    return `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const roomExpired =
    !!expiresAt &&
    new Date(expiresAt).getTime() <= now;

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="border-b border-slate-800 bg-slate-950/95">

        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
              <MessageSquare size={23} />
            </div>

            <div>
              <h1 className="text-xl font-bold">
                SyncDrop
              </h1>

              <p className="text-xs text-slate-400">
                Your private device-to-device room
              </p>
            </div>

          </div>

          <div className="flex items-center gap-2 text-sm">

            {connected ? (
              <>
                <Wifi
                  size={16}
                  className="text-green-400"
                />

                <span className="text-green-400">
                  Connected
                </span>
              </>
            ) : (
              <>
                <WifiOff
                  size={16}
                  className="text-slate-500"
                />

                <span className="text-slate-500">
                  Offline
                </span>
              </>
            )}

          </div>

        </div>

      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-6xl px-5 py-10">

        {!roomCode ? (

          /* =================================================
             HOME
          ================================================= */

          <div className="mx-auto max-w-xl">

            <div className="mb-10 text-center">

              <h2 className="text-4xl font-bold tracking-tight">

                Private sharing,

                <span className="text-blue-500">
                  {" "}simplified.
                </span>

              </h2>

              <p className="mt-4 text-slate-400">
                Create a temporary room and share
                messages and files between devices
                in real time.
              </p>

            </div>

            {/* DEVICE */}

            <div className="mb-5 rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <label className="mb-2 block text-sm font-medium text-slate-300">
                Device name
              </label>

              <input
                value={deviceName}
                onChange={(e) =>
                  setDeviceName(e.target.value)
                }
                placeholder="My Laptop"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
              />

              <p className="mt-2 text-xs text-slate-500">
                Device ID is generated automatically.
              </p>

            </div>

            {/* CREATE */}

            <button
              onClick={createRoom}
              disabled={loading}
              className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-4 font-semibold transition hover:bg-blue-500 disabled:opacity-50"
            >

              <Plus size={20} />

              {loading
                ? "Creating..."
                : "Create New Room"}

            </button>

            {/* JOIN */}

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <h3 className="mb-4 font-semibold">
                Join Existing Room
              </h3>

              <div className="flex gap-3">

                <input
                  value={enteredRoomCode}
                  onChange={(e) =>
                    setEnteredRoomCode(
                      e.target.value.toUpperCase()
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      joinRoom();
                    }
                  }}
                  placeholder="ABC123"
                  maxLength={6}
                  className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-center font-mono tracking-widest text-white outline-none focus:border-blue-500"
                />

                <button
                  onClick={joinRoom}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl border border-slate-700 px-5 py-3 font-medium transition hover:bg-slate-800 disabled:opacity-50"
                >

                  <LogIn size={18} />

                  Join

                </button>

              </div>

            </div>

            {error && (

              <div className="mt-5 rounded-xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
                {error}
              </div>

            )}

          </div>

        ) : (

          /* =================================================
             ROOM
          ================================================= */

          <div className="mx-auto max-w-4xl">

            {/* ROOM HEADER */}

            <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-sm text-slate-400">
                    Room Code
                  </p>

                  <div className="mt-1 flex items-center gap-3">

                    <span className="font-mono text-3xl font-bold tracking-[0.25em] text-blue-400">
                      {roomCode}
                    </span>

                    <button
                      onClick={copyRoomCode}
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
                      title="Copy room code"
                    >
                      <Copy size={18} />
                    </button>

                  </div>

                  <div className="mt-2 flex items-center gap-2 text-xs">

                    <Clock size={14} />

                    <span
                      className={
                        roomExpired
                          ? "text-red-400"
                          : "text-slate-400"
                      }
                    >
                      {roomExpired
                        ? "Room expired"
                        : `Expires in ${getRemainingTime()}`}
                    </span>

                  </div>

                </div>

                <div className="flex gap-2">

                  <button
                    onClick={refreshRoom}
                    className="rounded-xl border border-slate-700 p-3 text-slate-400 hover:bg-slate-800 hover:text-white"
                    title="Refresh"
                  >
                    <RefreshCw size={18} />
                  </button>

                  <button
                    onClick={leaveRoom}
                    className="rounded-xl border border-red-900 px-4 py-2 text-sm text-red-400 hover:bg-red-950"
                  >
                    Leave Room
                  </button>

                </div>

              </div>

            </div>

            {/* CHAT */}

            <div className="flex min-h-[550px] flex-col rounded-2xl border border-slate-800 bg-slate-900">

              {/* MESSAGE AREA */}

              <div className="flex-1 space-y-4 overflow-y-auto p-5">

                {messages.length === 0 &&
                files.length === 0 ? (

                  <div className="flex min-h-[430px] flex-col items-center justify-center text-center">

                    <MessageSquare
                      size={42}
                      className="mb-4 text-slate-700"
                    />

                    <h3 className="font-semibold text-slate-300">
                      No messages yet
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      Send a message or file to start.
                    </p>

                  </div>

                ) : (

                  <>

                    {/* MESSAGES */}

                    {messages.map((message) => {

                      const isMine =
                        message.sender_device_id ===
                        deviceId;

                      return (

                        <div
                          key={message.id}
                          className={`flex ${
                            isMine
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >

                          <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                              isMine
                                ? "rounded-br-md bg-blue-600"
                                : "rounded-bl-md bg-slate-800"
                            }`}
                          >

                            <div className="mb-1 text-xs font-medium opacity-70">
                              {isMine
                                ? "You"
                                : message.sender_device_name}
                            </div>

                            <p className="break-words text-sm">
                              {message.text}
                            </p>

                            <div className="mt-1 text-[10px] opacity-50">
                              {new Date(
                                message.created_at
                              ).toLocaleTimeString()}
                            </div>

                          </div>

                        </div>

                      );
                    })}

                    {/* FILES */}

                    {files.map((file) => {

                      const isMine =
                        file.sender_device_id ===
                        deviceId;

                      return (

                        <div
                          key={file.id}
                          className={`flex ${
                            isMine
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >

                          <div
                            className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                              isMine
                                ? "bg-blue-600"
                                : "bg-slate-800"
                            }`}
                          >

                            <div className="mb-2 text-xs opacity-70">
                              {isMine
                                ? "You"
                                : file.sender_device_name}
                            </div>

                            {isImage(file.file_type) ? (

                              <img
                                src={file.file_url}
                                alt={file.file_name}
                                className="mb-3 max-h-64 max-w-full rounded-xl object-contain"
                              />

                            ) : (

                              <div className="mb-3 flex items-center gap-3 rounded-xl bg-black/20 p-3">

                                <FileText size={28} />

                                <div className="min-w-0">

                                  <p className="truncate text-sm font-medium">
                                    {file.file_name}
                                  </p>

                                  <p className="text-xs opacity-60">
                                    {formatFileSize(
                                      file.file_size
                                    )}
                                  </p>

                                </div>

                              </div>

                            )}

                            <div className="flex items-center justify-between gap-4">

                              <span className="max-w-[180px] truncate text-xs opacity-60">
                                {file.file_name}
                              </span>

                              <a
                                href={file.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="flex items-center gap-1 rounded-lg bg-black/20 px-3 py-2 text-xs hover:bg-black/30"
                              >
                                <Download size={14} />
                                Download
                              </a>

                            </div>

                          </div>

                        </div>

                      );
                    })}

                  </>

                )}

              </div>

              {/* INPUT */}

              <div className="border-t border-slate-800 p-4">

                <div className="flex gap-3">

                  {/* FILE */}

                  <label
                    className={`flex cursor-pointer items-center justify-center rounded-xl border border-slate-700 px-4 text-slate-300 transition hover:bg-slate-800 ${
                      uploading
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    }`}
                    title="Send file"
                  >

                    {uploading ? (
                      <span className="text-xs">
                        Uploading...
                      </span>
                    ) : (
                      <Upload size={19} />
                    )}

                    <input
                      type="file"
                      className="hidden"
                      disabled={uploading}
                      onChange={uploadFile}
                    />

                  </label>

                  {/* MESSAGE */}

                  <input
                    value={messageText}
                    onChange={(e) =>
                      setMessageText(e.target.value)
                    }
                    onKeyDown={(e) => {

                      if (
                        e.key === "Enter" &&
                        !e.shiftKey
                      ) {
                        e.preventDefault();
                        sendMessage();
                      }

                    }}
                    placeholder="Type a message..."
                    className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                  />

                  {/* SEND */}

                  <button
                    onClick={sendMessage}
                    disabled={
                      !messageText.trim() ||
                      loading
                    }
                    className="flex items-center justify-center rounded-xl bg-blue-600 px-5 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    <Send size={19} />

                  </button>

                </div>

                <p className="mt-2 text-center text-[10px] text-slate-600">
                  Files up to 10 MB • Room expires after 30 minutes
                </p>

              </div>

            </div>

            {error && (

              <div className="mt-4 flex items-center justify-between rounded-xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">

                <span>{error}</span>

                <button
                  onClick={() => setError("")}
                  className="text-red-400 hover:text-white"
                >
                  <X size={16} />
                </button>

              </div>

            )}

            <p className="mt-5 text-center text-xs text-slate-600">
              SyncDrop • Private real-time communication
            </p>

          </div>

        )}

      </main>

    </div>
  );
}

export default App;