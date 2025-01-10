console.log("Popup script loaded");

const parent = document.parent;
const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");
const documentElement = document.documentElement;
const btnLight = document.getElementById("btnLight");
const btnDark = document.getElementById("btnDark");

function setTheme(theme) {
  console.log("Setting theme to " + theme);
  document.documentElement.setAttribute("data-bs-theme", theme);
  btnLight.classList.toggle("active", theme === "light");
  btnDark.classList.toggle("active", theme === "dark");
}

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function updateTheme() {
  setTheme(getSystemTheme());
}

console.log("matchMedia : " + colorScheme.toString());

document.addEventListener("DOMContentLoaded", () => {
  console.log("Popup DOM loaded");
  updateTheme();

  colorScheme.addEventListener("change", updateTheme);
  btnLight.addEventListener("click", () => setTheme("light"));
  btnDark.addEventListener("click", () => setTheme("dark"));
});




// 시스템 테마 변경 시 테마 업데이트

// // document.addEventListener("DOMContentLoaded", () => console.log("Popup DOM loaded"));
// // const storage = chrome.storage;
// // 시스템 테마에 따라 다크 모드 설정
// // 페이지 로드 시 테마 업데이트
// // document.addEventListener("DOMContentLoaded", updateTheme);
// // document.addEventListener('DOMContentLoaded', () => {
// const extensionSwitch = document.getElementById("extensionSwitch");
// console.log("Popup extensionSwitch loaded");

// // 스위치 상태를 로드
// chrome.storage.sync.get(["extensionEnabled"], function (result) {
//   console.log("Extension enabled state is " + result.extensionEnabled);
//   extensionSwitch.checked = result.extensionEnabled || false;
// });

// // 스위치 상태 변경 시 저장
// extensionSwitch.addEventListener("change", function () {
//   chrome.storage.sync.set(
//     { extensionEnabled: extensionSwitch.checked },
//     function () {
//       console.log(
//         "Extension enabled state is set to " + extensionSwitch.checked
//       );
//     }
//   );
// });
// });
