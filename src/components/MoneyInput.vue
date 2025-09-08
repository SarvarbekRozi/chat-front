<template>
  <div class="money-input-container">
    <input
        ref="inputRef"
        v-model="displayValue"
        type="text"
        :placeholder="placeholder"
        :readonly="readonly"
        :class="{ 'readonly-input': readonly }"
        @blur="onBlur"
    />
    <span class="currency-suffix">{{ currency }}</span>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: [Number, String],
  placeholder: String,
  currency: { type: String, default: "so'm" },
  readonly: Boolean
})

const emit = defineEmits(['update:modelValue'])

const displayValue = computed({
  get() {
    if (!props.modelValue && props.modelValue !== 0) return ''
    const num = typeof props.modelValue === 'string'
        ? parseFloat(props.modelValue.replace(/\s+/g, ''))
        : props.modelValue
    return new Intl.NumberFormat('ru-RU').format(num)
  },
  set(value) {
    if (props.readonly) return
    const num = parseFloat(value.replace(/\s+/g, '')) || 0
    emit('update:modelValue', num)
  }
})

const onBlur = () => {
  if (props.readonly) return
  const num = parseFloat(displayValue.value.replace(/\s+/g, '')) || 0
  emit('update:modelValue', num)
}
</script>

<style scoped>
.money-input-container {
  position: relative;
  width: 100%;
}

.money-input-container input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  padding-right: 2.5rem;
}

.money-input-container input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.currency-suffix {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
}

.readonly-input {
  background-color: #f3f4f6;
  cursor: not-allowed;
  user-select: none;
}

.readonly-input:focus {
  border-color: #d1d5db;
  box-shadow: none;
}
</style>