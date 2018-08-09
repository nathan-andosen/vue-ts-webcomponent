<template>
  <div class="example-form">
    <div class="logo"></div>
    <h2>{{title}}</h2>
    <div>
      <div class="form-group">
        <label for="exampleInputEmail1">Email address</label>
        <input v-model="data.email" type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
        <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Password</label>
        <input v-model="data.password" type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
      </div>
      <div class="form-group">
        <div class="form-check">
          <input v-model="data.rememberMe" type="checkbox" class="form-check-input" id="exampleCheck1">
          <label class="form-check-label" for="exampleCheck1">Remember me</label>
        </div>
      </div>
      <button v-on:click="submitForm" class="btn btn-primary">Submit</button>
    </div>

    <div class="phone-num">
      <span class="icomoon-phone"></span>
      1800 000 111
    </div>
    <footer-component></footer-component>
    <!-- Cant include images in html yet -->
    <!-- <img src="./assets/images/fake-logo.png" /> -->
  </div>
</template>

<script lang="ts" src="./example-form.component.ts"></script>
<style lang="scss" scoped src ="./example-form.component.scss"></style>

