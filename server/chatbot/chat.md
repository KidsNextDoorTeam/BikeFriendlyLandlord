added chat div on index.html

added to client/public/index.html:
  <div id="chat"></div>

in client/src/App.jsx
import Chat from "../../server/chatbot/chat.jsx"

<Route path="/chat" element={<Chat />} />
to App.jsx