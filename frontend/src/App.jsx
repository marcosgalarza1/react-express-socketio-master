import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("/");

export default function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.on("message", receiveMessage)

    return () => {
      socket.off("message", receiveMessage);
    };
  }, []);

  const receiveMessage = (message) =>
    setMessages(state => [message, ...state]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const newMessage = {
      body: message,
      from: "Me",
    };
    setMessages(state => [newMessage, ...state]);
    setMessage("");
    socket.emit("message", newMessage.body);
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 shadow-lg">
        <h1 className="text-xl font-bold">Chat Marcuss</h1>
        <p className="text-xs text-green-100">En línea</p>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>No hay mensajes aún</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.from === "Me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                  msg.from === "Me"
                    ? "bg-green-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                }`}
              >
                <p className="text-xs font-semibold opacity-70 mb-1">
                  {msg.from}
                </p>
                <p className="break-words">{msg.body}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="bg-white border-t border-gray-300 p-3 flex gap-2">
        <input
          name="message"
          type="text"
          placeholder="Escribe un mensaje..."
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-gray-800 focus:outline-none focus:border-green-500"
          value={message}
          autoFocus
        />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-semibold transition"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
