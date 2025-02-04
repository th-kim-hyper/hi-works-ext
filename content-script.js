
console.log('content-script.js loaded');

const config = {
  captchaId: "supreme_court",
  // captchaImageSelector: "#captcha > img",
  // captchaAnswerSelector: "#answer"
  captchaImageSelector: "img.w2image.mr10.pb5",
  captchaAnswerSelector: "input.w2input.inp.w200px.mr10",
}

function img2DataUrl(img) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL('image/png');
}

function dataUrlToBlob(dataUrl) {
  const parts = dataUrl.split(',');
  const byteString = atob(parts[1]);
  const mimeString = parts[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

function downloadDataUrl(dataUrl, filename) {
  const blob = dataUrlToBlob(dataUrl);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function createElementFromHTML(htmlString) {
  const template = document.createElement('template');
  template.innerHTML = htmlString.trim();

  // 스크립트 태그 제거
  const scripts = template.content.querySelectorAll('script');
  scripts.forEach(script => script.remove());

  // 여러 개의 루트 요소를 처리
  if (template.content.childNodes.length > 1) {
    return template.content.childNodes;
  } else {
    return template.content.firstChild;
  }
}

function predictCaptcha(captchaId, captchaImage, answer) {
  captchaImage.value = '';
  captchaImage.style.backgroundColor = 'white';
  const url = (document.location.protocol === 'https:') ? 'https://dev.hyperinfo.co.kr/captcha/api/predict' : 'http://dev.hyperinfo.co.kr:12004/api/predict';
  const dataUrl = img2DataUrl(captchaImage);
  const formData = new FormData();
  formData.append('captcha_id', captchaId);
  formData.append('captcha_data_url', dataUrl);

  const formDataEntries = Array.from(formData.entries());
  const urlEncodedData = formDataEntries.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
  const contentLength = urlEncodedData.length.toString();
  const copyIconId = 'copy-icon';
  
  fetch(url, {
    method: 'POST',
    headers: {
      'Host': 'dev.hyperinfo.co.kr',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': contentLength
    },
    body: urlEncodedData,
  })
  .then(response => response.json())
  .then(data => {
    console.log('Prediction result:', data);
    const pred = data.pred;
    if (answer) {
      answer.focus();
      answer.value = pred;
      answer.style.backgroundColor = 'lightgreen';
      
      const icon = document.createElement('i');
      icon.id = copyIconId;
      icon.className = 'bi bi-clipboard';
      answer.parentElement.appendChild(icon);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

function waitForElm(selector) {
  return new Promise(resolve => {
      if (document.querySelector(selector)) {
          return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver(mutations => {
          if (document.querySelector(selector)) {
              observer.disconnect();
              resolve(document.querySelector(selector));
          }
      });

      // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
      observer.observe(document.body, {
          childList: true,
          subtree: true
      });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('Document is ready');
});

window.addEventListener('load', () => {
  console.log('window load event fired');
  chrome.runtime.sendMessage('content_script_loaded');

  waitForElm(config.captchaImageSelector).then((captchaImage) => {
    console.log(`captcha found: ${document.location.href}`);
    const captchaId = config.captchaId;
    const answer = document.querySelector(config.captchaAnswerSelector);
    const captchaParent = captchaImage.parentElement;
    setTimeout(() => { predictCaptcha(captchaId, captchaImage, answer); }, 500);
    
    const observer = new MutationObserver(() => {
      console.log(`Captcha HTML changed: ${document.location.href}`);
      const reloadedCkaptchaImage = document.querySelector(config.captchaImageSelector);
      reloadedCkaptchaImage.onload = () => { predictCaptcha(captchaId, reloadedCkaptchaImage, answer); };
    });
    observer.observe(captchaParent, { childList: true, subtree: false });
  })
  .catch(error => { console.error('Error:', error); });

});
