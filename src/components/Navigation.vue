<script setup>

</script>

<template>
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <a class="navbar-brand" noref>
      <img src="@/assets/logo.png" alt="Logo" height="32" class="d-inline-block align-top"/>
    </a>
    <button class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="`$t('navigation.toggle_navigation')`">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <RouterLink class="nav-link" :to="{name:'journal'}" active-class="active">{{$t('journal.title')}}</RouterLink>
        </li>
      </ul>
    </div>
  </div>
</nav>
</template>

<style scoped>

</style>