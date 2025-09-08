<template>
  <div class="chat-container">
    <!-- Messages -->
    <div class="messages" ref="messageBox">
      <div
          v-for="msg in messages"
          :key="msg.id"
          :class="['message', msg.role_id == user.role_id ? 'me' : 'other']"
      >
        <div class="bubble">
          <span class="sender">{{ msg.role_id == 1 ? "Admin" : "Citizen" }}</span>
          <p>{{ msg.body }}</p>
          <small>
            {{ formatTime(msg.created_at) }}
            <span v-if="msg.role_id == user.role_id">
        <span v-if="msg.status == 'sent'">✔</span>
        <span v-else-if="msg.status == 'delivered'">✔✔</span>
        <span v-else-if="msg.status == 'read'" style="color: blue;">✔✔</span>
      </span>
          </small>
        </div>
      </div>
    </div>

    <!-- Input -->
    <div class="chat-input">
      <input
          v-model="text"
          type="text"
          placeholder="Xabar yozing..."
          @keyup.enter="sendMessage"
      />
      <button @click="sendMessage">📨</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick,onUnmounted } from "vue";
import { toast } from "vue3-toastify";
import api from "../plugins/axios";

const messages = ref<any[]>([]);
const text = ref("");
const loading = ref(false);
const messageBox = ref<HTMLElement | null>(null);
const user = ref(JSON.parse(localStorage.getItem("user") || "{}"));
let pollingInterval: number | null = null;
/**
 * Scroll to bottom
 */
const scrollToBottom = async () => {
  await nextTick();
  if (messageBox.value) {
    messageBox.value.scrollTop = messageBox.value.scrollHeight;
  }
};

/**
 * Get messages
 */
const fetchMessages = async () => {
  loading.value = true;
  try {
    const res = await api.get("/messages");
    messages.value = res.data;
  } catch (err: any) {
    console.error("Xabarni olishda xatolik", err);
    toast.error(err.response?.data?.message || "Xabarni olishda xatolik");
  } finally {
    loading.value = false;
  }
};

/**
 * Send message
 */
const sendMessage = async () => {
  if (!text.value.trim()) return;

  const newMsg = {
    role_id: user.value.role_id,
    body: text.value,
  };

  text.value = ""; // inputni bo‘shatish

  try {
    const res = await api.post("/messages", newMsg);
    messages.value.push(res.data); // fetch emas, o‘zi qo‘shadi
    scrollToBottom(); // yuborgandan keyin pastga tushsin
  } catch (err: any) {
    console.error("Xabar yuborishda xatolik", err);
    toast.error(err.response?.data?.message || "Xabar yuborishda xatolik");
  }
};

/**
 * Format time
 */
const formatTime = (time: string) => {
  return new Date(time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

onMounted(async () => {
  await fetchMessages();
  pollingInterval = setInterval(fetchMessages, 2000);
  await api.put("/messages/read/all");
});
onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval);
});
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 80vh;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
}

.messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  background: #f5f7fb;
}

.message {
  display: flex;
  margin-bottom: 10px;
}

.message.me {
  justify-content: flex-end; /* o‘z xabari o‘ng tomonda */
}

.message.other {
  justify-content: flex-start; /* boshqaniki chap tomonda */
}

.bubble {
  max-width: 60%;
  padding: 10px;
  border-radius: 10px;
  position: relative;
  word-wrap: break-word;
  background: #e0f7fa;
}

.message.me .bubble {
  background: #d1f7d6;
  text-align: right;
}

.sender {
  font-size: 0.7rem;
  font-weight: bold;
  display: block;
  margin-bottom: 2px;
}

.chat-input {
  display: flex;
  padding: 10px;
  background: white;
  border-top: 1px solid #ddd;
}

.chat-input input {
  flex: 1;
  border: none;
  padding: 10px;
  border-radius: 20px;
  background: #f0f0f0;
  margin-right: 10px;
}

.chat-input input:focus {
  outline: none;
}

.chat-input button {
  border: none;
  background: #4caf50;
  color: white;
  padding: 10px 16px;
  border-radius: 50%;
  cursor: pointer;
}
</style>
