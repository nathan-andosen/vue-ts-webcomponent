<template>
  <div class="footer">
    <p>This is the footer, its a separate component.</p>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class FooterComponent extends Vue {
  @Prop() msg!: string;
}
</script>

<style lang="scss" scoped>
.footer {
  border-top: 1px solid #eee;
  padding-top: 15px;
  margin-top: 15px;
  text-align: center;
  font-style: italic;

  p {
    color: #999;
  }
}
</style>