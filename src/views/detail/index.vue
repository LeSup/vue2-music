<template>
  <div>
    detail is {{ id }}，yyds
    <br />
    <img src="../../common/images/01.jpg" />
  </div>
</template>

<script>
export default {
  name: "mDetail",
  data() {
    return {
      detail: "",
    };
  },
  computed: {
    id() {
      return this.$route.params?.id;
    },
  },
};
</script>

<style>
</style>
