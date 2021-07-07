<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png" />
    <editor
      api-key="no-api-key"
      :init="{
        height: 500,
        menubar: false,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount',
          'hr',
        ],
        toolbar: 'undo redo | formatselect | bold italic image hr',
      }"
    /> -->
    <select id="city" onchange="fn()">
      <option value="jx">江西</option>
      <option value="gd">广东</option>
      <option value="fj">福建</option>
      <option value="hn">湖南</option>
    </select>
    <select id="area">
      <option>抚州市</option>
      <option>南昌市</option>
      <option>赣州市</option>
      <option>宜春市</option>
    </select>
  </div>
</template>

<script>
export default {
  name: "app",

  methods: {
    fn() {
      var select = document.getElementById("city");
      var c = select.value;
      var area = document.getElementById("area");
      switch (c) {
        case "jx":
          area.innerHTML =
            "<option>抚州市</option><option>南昌市</option><option>赣州市</option><option>宜春市</option>";
          break;
        case "gd":
          area.innerHTML =
            "<option>广州市</option><option>韶关市</option><option>佛山市</option><option>东莞市</option>";
          break;
        case "fj":
          area.innerHTML =
            "<option>泉州市</option><option>厦门市</option><option>福州市</option><option>漳州市</option>";
          break;
        case "hn":
          area.innerHTML =
            "<option>长沙市</option><option>湘潭市</option><option>乐昌市</option><option>郴州市</option>";
          break;
        default:
          alert("error");
      }
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
