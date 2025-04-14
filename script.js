const video = document.getElementById('video');
const canvas = document.getElementById('overlay');
const ctx = canvas.getContext('2d');
const expressionText = document.getElementById('expressionText');
const emojiContainer = document.getElementById('emojiContainer');
const historyList = document.getElementById('historyList');
const musicList = document.getElementById('musicList');
const musicDiv = document.getElementById('musicSuggestion');

ctx.translate(canvas.width, 0);
ctx.scale(-1, 1);


let isVietnamese = true;

const translations = {
  vi: {
    neutral: "Bình thường 😐",
    happy: "Bạn đang vui! 😁",
    sad: "Bạn đang buồn... 🥺",
    angry: "Có vẻ bạn đang tức giận. 😡",
    surprised: "Bạn đang ngạc nhiên! 😲",
    recent: "Lịch sử biểu cảm",
    suggestion: "️🎧 Gợi ý âm nhạc:",
    about: "Về chúng tôi",
    aboutText: 'Dự án “FaceFeel AI” là sản phẩm tiểu luận giữa kỳ của học phần <strong>Lập trình Web và Ứng dụng</strong>, thuộc Khoa Công nghệ Thông tin - Trường Đại học Tôn Đức Thắng.<br><br>Mục tiêu của dự án là xây dựng một hệ thống có khả năng <strong>nhận diện cảm xúc khuôn mặt theo thời gian thực</strong> ngay trên trình duyệt, từ đó đưa ra các <strong>gợi ý âm nhạc phù hợp với trạng thái cảm xúc</strong> của người dùng. Ứng dụng sử dụng các thư viện hiện đại như <strong>face-api.js</strong> kết hợp với giao diện trực quan nhằm nâng cao trải nghiệm và tính tương tác.',
    title: "😊 Hôm nay bạn thế nào?",
  },
  en: {
    neutral: "Neutral 😐",
    happy: "You're happy! 😁",
    sad: "You seem sad... 🥺",
    angry: "You seem angry. 😡",
    surprised: "You look surprised! 😲",
    recent: "Recent Expressions",
    suggestion: "️🎧 Music Suggestions:",
    about: "About Us",
    aboutText: '<strong>FaceFeel AI</strong> is a midterm essay project for the course <strong>Web Programming and Applications</strong>, developed by students from the Faculty of Information Technology - Ton Duc Thang University.<br><br>The goal is to build a browser-based system capable of <strong>real-time facial emotion recognition</strong>, which provides <strong>music suggestions tailored to the user\'s emotional state</strong>. The application utilizes modern libraries such as <strong>face-api.js</strong> and a visually interactive interface to enhance the overall experience.',
    title: "😊 How are you today?",
  }
};

const emojiMap = {
  neutral: "😐",
  happy: "😁",
  sad: "🥺",
  angry: "😡",
  surprised: "😲",
};

const musicSuggestions = {
  happy: [
    { title: "Happy - Pharrell Williams", url: "https://www.youtube.com/watch?v=ZbZSe6N_BXs" },
    { title: "Can't Stop The Feeling! - Justin Timberlake", url: "https://www.youtube.com/watch?v=ru0K8uYEZWw" },
    { title: "As It Was - Harry Styles", url: "https://www.youtube.com/watch?v=H5v3kku4y6Q" },
    { title: "Good As Hell - Lizzo", url: "https://www.youtube.com/watch?v=vuq-VAiW9kw" },
    { title: "Shut Up and Dance - WALK THE MOON", url: "https://www.youtube.com/watch?v=6JCLY0Rlx6Q" }
  ],
  sad: [
    { title: "Let Her Go - Passenger", url: "https://www.youtube.com/watch?v=RBumgq5yVrA" },
    { title: "Jealous - Labrinth", url: "https://www.youtube.com/watch?v=50VWOBi0VFs" },
    { title: "Someone Like You - Adele", url: "https://www.youtube.com/watch?v=hLQl3WQQoQ0" },
    { title: "The Night We Met - Lord Huron", url: "https://www.youtube.com/watch?v=KtlgYxa6BMU" },
    { title: "All I Want - Kodaline", url: "https://www.youtube.com/watch?v=mtf7hC17IBM" }
  ],
  angry: [
    { title: "Lose Yourself - Eminem", url: "https://www.youtube.com/watch?v=_Yhyp-_hX2s" },
    { title: "Stronger - Kanye West", url: "https://www.youtube.com/watch?v=PsO6ZnUZI0g" },
    { title: "Take A Look Around - Limp Bizkit", url: "https://www.youtube.com/watch?v=0UjsXo9l6I8" },
    { title: "You Oughta Know - Alanis Morissette", url: "https://www.youtube.com/watch?v=NPcyTyilmYY" },
    { title: "Gives You Hell - The All-American Rejects", url: "https://www.youtube.com/watch?v=uxUATkpMQ8A" }
  ],
  surprised: [
    { title: "Electric Feel - MGMT", url: "https://www.youtube.com/watch?v=MmZexg8sxyk" },
    { title: "Royals - Lorde", url: "https://www.youtube.com/watch?v=nlcIKh6sBtc" },
    { title: "Bad Guy - Billie Eilish", url: "https://www.youtube.com/watch?v=DyDfgMOUjCI" },
    { title: "Midnight City - M83", url: "https://www.youtube.com/watch?v=dX3k_QDnzHE" },
    { title: "Tongue Tied - Grouplove", url: "https://www.youtube.com/watch?v=1x1wjGKHjBI" }
  ],
  neutral: [
    { title: "Sunflower - Post Malone & Swae Lee", url: "https://www.youtube.com/watch?v=ApXoWvfEYVU" },
    { title: "Location - Khalid", url: "https://www.youtube.com/watch?v=by3yRdlQvzs" },
    { title: "Put Your Records On - Ritt Momney", url: "https://www.youtube.com/watch?v=MtN1YnoL46Q" },
    { title: "Coffee - Beabadoobee", url: "https://www.youtube.com/watch?v=jB8q__WQ5E8" },
    { title: "I'm Yours - Jason Mraz", url: "https://www.youtube.com/watch?v=EkHTsc9PU2A" }
  ]
};

function spawnEmoji(emoji) {
  const el = document.createElement('div');
  el.className = 'emoji';
  el.textContent = emoji;
  el.style.left = Math.random() * 90 + '%';
  el.style.top = '80%';
  emojiContainer.appendChild(el);
  setTimeout(() => emojiContainer.removeChild(el), 2000);
}

function showExpression(expression, confidence) {
  const lang = isVietnamese ? "vi" : "en";
  const message = translations[lang][expression] || "";
  const emoji = emojiMap[expression] || "🙂";
  const percent = `${(confidence * 100).toFixed(1)}%`;

  expressionText.textContent = `${emoji} ${message}\n(${percent})`;
  expressionText.dataset.expression = expression;
  expressionText.dataset.confidence = confidence;
  spawnEmoji(emoji);

  musicList.innerHTML = "";
  musicSuggestions[expression].forEach(track => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${track.url}" target="_blank">${track.title}</a>`;
    musicList.appendChild(li);
  });

  musicDiv.classList.remove("hidden");

  const timestamp = new Date().toLocaleTimeString();
  const li = document.createElement("li");
  li.textContent = `${timestamp}: ${message} (${percent})`;
  historyList.prepend(li);
  if (historyList.children.length > 6) {
    historyList.removeChild(historyList.lastChild);
  }
}

function updateLanguageUI() {
  const lang = isVietnamese ? "vi" : "en";
  document.querySelector(".navbar h1").textContent = translations[lang].title;
  document.querySelector("#history h3").textContent = translations[lang].recent;
  document.querySelector("#musicSuggestion h3").textContent = translations[lang].suggestion;
  document.getElementById("aboutTitle").textContent = translations[lang].about;
  document.getElementById("aboutContent").innerHTML = translations[lang].aboutText;
  document.getElementById("langToggle").textContent = isVietnamese ? "🇻🇳" : "🇺🇸";

  const exp = expressionText.dataset.expression;
  const conf = expressionText.dataset.confidence;
  if (exp && conf) showExpression(exp, parseFloat(conf));
}

document.getElementById("langToggle").addEventListener("click", () => {
  isVietnamese = !isVietnamese;
  updateLanguageUI();
});

async function startVideo() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
}

async function onPlay() {
  const displaySize = {
    width: video.videoWidth,
    height: video.videoHeight
  };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (detections.length > 0) {
      const resized = faceapi.resizeResults(detections, displaySize);
      faceapi.draw.drawDetections(canvas, resized);

      const expressions = detections[0].expressions;
      const best = Object.entries(expressions).sort((a, b) => b[1] - a[1])[0];
      const [expression, confidence] = best;

      showExpression(expression, confidence);
    }
  }, 500);
}

async function run() {
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('models'),
    faceapi.nets.faceExpressionNet.loadFromUri('models')
  ]);
  await startVideo();
  video.addEventListener('play', onPlay);
}

run();
