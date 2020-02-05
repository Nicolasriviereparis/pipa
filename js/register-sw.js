if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("http://localhost/pipa_v0.1/sw.js", {
      scope: "./"
    });
  });
}
