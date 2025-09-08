<template>
  <div class="pagination">
    <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="pagination-btn"
    >
      <ChevronLeft size="16px" />
    </button>

    <template v-for="page in pages" :key="page">
      <button
          @click="changePage(page)"
          :class="{ active: currentPage === page }"
          class="pagination-btn"
      >
        {{ page }}
      </button>
    </template>

    <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="pagination-btn"
    >
      <ChevronRight size="16px" />

    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ChevronRight, ChevronLeft } from "lucide-vue-next"

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  maxVisible: {
    type: Number,
    default: 5
  }
});

const emit = defineEmits(['pageChanged']);

const pages = computed(() => {
  const half = Math.floor(props.maxVisible / 2);
  let start = props.currentPage - half;
  let end = props.currentPage + half;

  if (start < 1) {
    start = 1;
    end = Math.min(props.maxVisible, props.totalPages);
  }

  if (end > props.totalPages) {
    end = props.totalPages;
    start = Math.max(1, end - props.maxVisible + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const changePage = (page: number) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('pageChanged', page);
  }
};
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: end;
  margin: 20px;
  gap: 8px;
}

.pagination-btn {
  padding: 8px 14px;
  border: 1px solid #007bff;
  background: white;
  cursor: pointer;
  border-radius: 6px;
  font-size: 14px;
  min-width: 40px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.pagination-btn:hover:not(:disabled) {
  background: #007bff;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 2px 6px rgba(0, 123, 255, 0.3);
}

.pagination-btn.active {
  background: #007bff;
  color: white;
  font-weight: bold;
  border-color: #007bff;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
