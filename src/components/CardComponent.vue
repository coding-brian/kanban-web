<script setup lang="ts"></script>

<template>
  <div class="card">
    <span class="title"><slot name="title">456</slot></span>
    <span class="sub-title"
      ><slot name="completed-substasks"></slot> of
      <slot name="totle-substasks"></slot> substasks</span
    >
  </div>
</template>

<style lang="scss" scoped>
.card {
  width: 280px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(#364e7e, 0.1);
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 16px;
  padding-top: 24px;
  padding-bottom: 24px;
  background-color: white;
  cursor: pointer;

  .title {
    @extend %heading-m;
  }

  .sub-title {
    @extend %body-m;
    color: $medium-grey;
  }
}
</style>
