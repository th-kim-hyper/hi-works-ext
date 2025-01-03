const meta = document.createElement('meta');
meta.httpEquiv = 'Content-Security-Policy';
meta.content = 'upgrade-insecure-requests';
document.getElementsByTagName('head')[0].appendChild(meta);

const captcha = document.querySelector('#captcha');

function img2DataUrl(img) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL('image/png');
}

if (captcha) {
  console.log('captcha found:', document.location.href);
  const captchaImage = captcha.querySelector('img');
  
  if (captchaImage) {
    const dataUrl = img2DataUrl(captchaImage);
    const formData = new FormData();
    formData.append('captcha_id', 'supreme_court');
    formData.append('captcha_data_url', dataUrl);

    url = 'http://dev.hyperinfo.co.kr:12004/api/predict';

    if (document.location.protocol === 'https:') {
      url = 'https://dev.hyperinfo.co.kr/captcha/api/predict';
    }

    // Convert FormData to URL-encoded string
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
      // mode: 'no-cors'
    })
    .then(response => response.json())
    .then(data => {
      console.log('Prediction result:', data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  } else {
    console.log('No captcha image found');
  }
} else {
  console.log('No captcha found');
}
// const imageIds = ['test2', 'test4'];

// const loadButton = document.createElement('button');
// loadButton.innerText = 'Load images';
// loadButton.addEventListener('click', handleLoadRequest);

// document.querySelector('body').append(loadButton);

// function handleLoadRequest() {
//   for (const id of imageIds) {
//     const element = document.getElementById(id);
//     element.src = chrome.runtime.getURL(`${id}.png`);
//   }
// }
