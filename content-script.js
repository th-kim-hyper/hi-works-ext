
const config = {
  captchaId: "supreme_court",
  captchaImageSelector: "#captcha > img",
  captchaAnswerSelector: "#answer"
}

function img2DataUrl(img) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL('image/png');
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

function predictCaptcha(captchaId ,captchaImage, answer) {
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
      // const event = new KeyboardEvent('keypress', {
      //   bubbles: true,
      //   cancelable: true,
      //   key: 'Enter',
      //   code: 'Enter',
      //   keyCode: 13
      // });
      // answer.dispatchEvent(event);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

const captchaImage = document.querySelector(config.captchaImageSelector);
if (captchaImage) {
  chrome.runtime.sendMessage('content_script_loaded');
  console.log(`captcha found: ${document.location.href}`);
  const captchaId = config.captchaId;
  const answer = document.querySelector(config.captchaAnswerSelector);
  const captchaParent = captchaImage.parentElement;

  predictCaptcha(captchaId, captchaImage, answer);
  
  const observer = new MutationObserver(() => {
    console.log(`Captcha HTML changed: ${document.location.href}`);
    const reloadedCkaptchaImage = document.querySelector(config.captchaImageSelector);
    reloadedCkaptchaImage.onload = () => { predictCaptcha(captchaId, reloadedCkaptchaImage, answer); };
  }); 
  observer.observe(captchaParent, { childList: true, subtree: false });
} else {
  console.log('No captcha image found');
}
