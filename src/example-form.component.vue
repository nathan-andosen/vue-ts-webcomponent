<template>
  <div class="example-form">
    <div class="logo"></div>
    
    <!-- <div class="mdc-card">
      <div class="mdc-card__actions">
        <div class="mdc-text-field">
          <input type="text" id="my-text-field" class="mdc-text-field__input">
          <label class="mdc-floating-label" for="my-text-field">Hint text</label>
          <div class="mdc-line-ripple"></div>
        </div>
      </div>
    </div> -->

    <m-card>
      <div>
        
      </div>
    </m-card>
    <m-textfield v-model="text" id="textfield">
          <m-floating-label for="textfield">Textfield label</m-floating-label>
          <m-line-ripple slot="bottomLine"/>
        </m-textfield>
    <div>
        <span class="icomoon-phone"></span>
      </div>
    <footer-component></footer-component>
    <!-- Cant include images in html yet -->
    <!-- <img src="./assets/images/fake-logo.png" /> -->
  </div>
</template>
<script lang="ts" src="./example-form.component.ts"></script>
<style lang="scss" scoped src ="./example-form.component.scss"></style>

