<template>
  <div class="flex justify-center items-center bg-[#333e5a] px-[12px] py-[6px] rounded-[16px] sticky bottom-4 w-fit">
    <div class="flex items-center">
      <div class="mr-[10px]">
        <div class="loading-circle" />
      </div>
      <div class="text-white font-medium">Hệ thống đang OCR. Xin vui lòng chờ trong giây lát</div>
    </div>
  </div>
</template>
<style scoped>
.loading-circle {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
