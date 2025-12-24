const langBtn = document.getElementById("langBtn");
const langDropdown = document.getElementById("langDropdown");
const selectedLang = document.getElementById("selectedLang");
const langBtn1 = document.getElementById("langBtn1");
const langDropdown1 = document.getElementById("langDropdown1");
const selectedLang1 = document.getElementById("selectedLang1");
const startBtn = document.getElementById("startChatBtn");
const chatWindow = document.getElementById("chatWindow");
const closeBtn = document.getElementById("closeChatBtn");

const API_KEY = PASTE YOUR API KEY HERE;
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
const input = document.getElementById("input");
const output = document.getElementById("output");
const sendBtn = document.getElementById("sendBtn");
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
// Header
menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("hidden");
  navLinks.classList.toggle("flex");
});
// --- Toggle Chat UI ---
startBtn.addEventListener("click", () => {
  startBtn.classList.add("hidden");
  chatWindow.classList.remove("hidden");
  output.innerHTML = `<div class='text-center text-gray-400 italic'>👋 Hi! Start chatting...</div>`;
});

closeBtn.addEventListener("click", () => {
  chatWindow.classList.add("hidden");
  startBtn.classList.remove("hidden");
});

// --- Chat Logic ---
async function chatbot(userMessage) {
  if (!userMessage) return;
  output.innerHTML = "";
  // Append user message
  output.innerHTML += `
    <div class="text-right">
      <div class="inline-block bg-green-100 text-gray-800 px-3 py-2 rounded-lg mb-2 max-w-[80%] break-words">
        ${userMessage}
      </div>
    </div>
  `;

  // Add loading indicator
  const loadingId = "loading-" + Date.now();
  output.innerHTML += `
    <div id="${loadingId}" class="text-left">
      <div class="inline-block bg-gray-100 text-gray-600 px-3 py-2 rounded-lg mb-2 italic animate-pulse">
        Typing...
      </div>
    </div>
  `;
  output.scrollTop = output.scrollHeight;
  input.value = "";
  input.disabled = true;
  sendBtn.disabled = true;

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `
You are "BaKhabar Kissan", an agriculture-focused assistant for farmers in Pakistan. 
Strict rules:
1. Only answer questions related to agriculture, farming, crops, weather, livestock, soil, fertilizers, pesticides, irrigation, or agricultural technology.
2. If the user asks about anything unrelated to agriculture, politely refuse and redirect them to agricultural topics.
3. Always reply in a clear, farmer-friendly tone in English or Urdu (depending on user message language).
4. Keep answers short and practical for farmers.

User message: ${userMessage}
                `,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    const botMessage =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Maaf kijiye, is sawal ka data abhi uplabdh nahi hai. 🌾";

    document.getElementById(loadingId)?.remove();

    output.innerHTML += `
      <div class="text-left">
        <div class="inline-block bg-gray-200 text-gray-800 px-3 py-2 rounded-lg mb-2 max-w-[80%] break-words prose prose-sm">
          ${formatMarkdown(botMessage)}
        </div>
      </div>
    `;
  } catch {
    document.getElementById(loadingId)?.remove();
    output.innerHTML += `
      <div class="text-left">
        <div class="inline-block bg-red-100 text-red-700 px-3 py-2 rounded-lg mb-2">
          ❌ Error: Unable to reach API.
        </div>
      </div>
    `;
  } finally {
    output.scrollTop = output.scrollHeight;
    input.disabled = false;
    sendBtn.disabled = false;
    input.focus();
  }
}

function formatMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
    .replace(/\*(.*?)\*/g, "<i>$1</i>")
    .replace(/__(.*?)__/g, "<u>$1</u>")
    .replace(/`(.*?)`/g, "<code class='bg-gray-300 px-1 rounded'>$1</code>")
    .replace(
      /\[(.*?)\]\((.*?)\)/g,
      "<a href='$2' target='_blank' class='text-blue-600 underline'>$1</a>"
    );
}

sendBtn.addEventListener("click", () => chatbot(input.value.trim()));
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") chatbot(input.value.trim());
});

// Toggle dropdown visibility
langBtn.addEventListener("click", () => {
  langDropdown.classList.toggle("hidden");
});
langBtn1.addEventListener("click", () => {
  langDropdown1.classList.toggle("hidden");
});

// Change language
function changeLanguage(lang) {
  selectedLang.textContent = lang;
  langDropdown.classList.add("hidden");
}
function changeLanguage(lang) {
  selectedLang1.textContent = lang;
  langDropdown1.classList.add("hidden");
}

// Close dropdown when clicking outside
window.addEventListener("click", (e) => {
  if (!langBtn.contains(e.target) && !langDropdown.contains(e.target)) {
    langDropdown.classList.add("hidden");
  }
});
window.addEventListener("click", (e) => {
  if (!langBtn1.contains(e.target) && !langDropdown1.contains(e.target)) {
    langDropdown1.classList.add("hidden");
  }
});

async function kitchen() {
  try {
    const response = await fetch("./js/kitchen.json");
    const data = await response.json();

    const section1 = document.getElementById("Kitchen-cards-1");
    const slider = document.getElementById("Kitchen-slider");
    const counter = document.getElementById("sliderCounter");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    // 🔹 Card generator
    function createCard(item, withBorder = false) {
      const bgColor =
        item.saleSoldout === "Sale"
          ? "bg-green-600"
          : item.saleSoldout === "Sold Out"
          ? "bg-red-600"
          : "hidden";

      const borderClass = withBorder ? "border border-gray-300" : "";

      let priceHTML = "";
      if (item.price === "No Discount" || !item.discountPrice) {
        priceHTML = `<span class="text-[16px] text-[#020912]">${
          item.discountPrice || item.price
        }</span>`;
      } else {
        priceHTML = `
          <span class="line-through text-[13px] text-[#020912bf]">${item.price}</span>
          <span class="text-[16px] text-[#020912] ml-4">${item.discountPrice}</span>
        `;
      }

      return `
        <div class="w-[300px] flex-shrink-0 pb-6 relative">
          <img src="${item.image}" alt="${item.name}" class="w-full h-[300px] object-cover mb-4 ${borderClass}">
          <span class="absolute top-4 left-2 text-[12px] ${bgColor} text-white px-2 rounded-full">${item.saleSoldout}</span>
          <div class="px-3">
            <a class="text-[16.25px] font-[600] text-black hover:underline underline-offset-4" href="#">
              ${item.name}
            </a>
            <h6 class="text-[10px] font-[500] uppercase text-gray-600 tracking-[1px] mt-2">
              BaKhabar Kissan
            </h6>
            <div class="mt-4">${priceHTML}</div>
          </div>
        </div>
      `;
    }

    // 🔸 Section 1 (Grid)
    section1.innerHTML = "";
    data[0].forEach((item) => (section1.innerHTML += createCard(item)));

    // 🔸 Section 2 (Slider)
    const sliderItems = data[1];
    slider.innerHTML = "";

    // Clone for infinite loop
    sliderItems.forEach((item) => (slider.innerHTML += createCard(item, true)));
    sliderItems.forEach((item) => (slider.innerHTML += createCard(item, true))); // duplicate all for smooth looping

    const total = sliderItems.length;
    const cardWidth = 300;
    let currentIndex = 0;
    let autoSlide;

    function updateSlider(animate = true) {
      slider.style.transition = animate ? "transform 0.6s ease-in-out" : "none";
      slider.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
      const slideNum = (currentIndex % total) + 1;
      counter.textContent = `${slideNum} / ${total}`;
    }

    function nextSlide() {
      currentIndex++;
      updateSlider();

      // 🔁 When reach end of first batch, reset smoothly to start
      if (currentIndex >= total) {
        setTimeout(() => {
          slider.style.transition = "none";
          currentIndex = 0;
          updateSlider(false);
        }, 600);
      }
    }

    function prevSlide() {
      if (currentIndex === 0) {
        currentIndex = total;
        slider.style.transition = "none";
        updateSlider(false);
      }
      currentIndex--;
      updateSlider();
    }

    nextBtn.addEventListener("click", nextSlide);
    prevBtn.addEventListener("click", prevSlide);

    // Auto slide
    function startAutoSlide() {
      autoSlide = setInterval(nextSlide, 3000);
    }

    function stopAutoSlide() {
      clearInterval(autoSlide);
    }

    slider.parentElement.addEventListener("mouseenter", stopAutoSlide);
    slider.parentElement.addEventListener("mouseleave", startAutoSlide);

    updateSlider(false);
    startAutoSlide();
  } catch (error) {
    console.error("Error loading kitchen data:", error);
  }
}
kitchen();
document.addEventListener("DOMContentLoaded", kitchen);

async function planters() {
  try {
    const response = await fetch("./js/planters.json");
    const data = await response.json();

    // 🔹 Create individual card
    function createCard(item, withBorder = false) {
      const bgColor =
        item.saleSoldout === "Sale"
          ? "bg-green-600"
          : item.saleSoldout === "Sold Out"
          ? "bg-red-600"
          : "hidden";

      let priceHTML = "";
      if (item.price === "No Discount" || !item.discountPrice) {
        priceHTML = `<span class="text-[16px] text-[#020912]">${
          item.discountPrice || item.price
        }</span>`;
      } else {
        priceHTML = `
          <span class="line-through text-[13px] text-[#020912bf]">${item.price}</span>
          <span class="text-[16px] text-[#020912] ml-4">${item.discountPrice}</span>
        `;
      }

      return `
        <div class="w-[300px] flex-shrink-0 pb-6 relative">
          <img src="${item.image}" alt="${item.name}" class="w-full ${item.height} object-cover mb-4 border border-gray-300">
          <span class="absolute top-4 left-2 text-[12px] ${bgColor} text-white px-2 rounded-full">${item.saleSoldout}</span>
          <div class="px-3">
            <a class="text-[16.25px] font-[600] text-black hover:underline underline-offset-4" href="#">
              ${item.name}
            </a>
            <h6 class="text-[10px] font-[500] uppercase text-gray-600 tracking-[1px] mt-2">
              BaKhabar Kissan
            </h6>
            <div class="mt-4">${priceHTML}</div>
          </div>
        </div>
      `;
    }

    // 🔁 Slider setup (reusable)
    function createSlider(
      sliderId,
      counterId,
      prevBtnId,
      nextBtnId,
      items,
      withBorder = false
    ) {
      const slider = document.getElementById(sliderId);
      const counter = document.getElementById(counterId);
      const prevBtn = document.getElementById(prevBtnId);
      const nextBtn = document.getElementById(nextBtnId);

      // Duplicate items for infinite effect
      slider.innerHTML = "";
      items.forEach(
        (item) => (slider.innerHTML += createCard(item, withBorder))
      );
      items.forEach(
        (item) => (slider.innerHTML += createCard(item, withBorder))
      );

      const total = items.length;
      const cardWidth = 300;
      let currentIndex = 0;
      let autoSlide;

      function updateSlider(animate = true) {
        slider.style.transition = animate
          ? "transform 0.6s ease-in-out"
          : "none";
        slider.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        counter.textContent = `${(currentIndex % total) + 1} / ${total}`;
      }

      function nextSlide() {
        currentIndex++;
        updateSlider();
        if (currentIndex >= total) {
          setTimeout(() => {
            slider.style.transition = "none";
            currentIndex = 0;
            updateSlider(false);
          }, 600);
        }
      }

      function prevSlide() {
        if (currentIndex === 0) {
          currentIndex = total;
          slider.style.transition = "none";
          updateSlider(false);
        }
        currentIndex--;
        updateSlider();
      }

      nextBtn.addEventListener("click", nextSlide);
      prevBtn.addEventListener("click", prevSlide);

      function startAutoSlide() {
        autoSlide = setInterval(nextSlide, 3000);
      }

      function stopAutoSlide() {
        clearInterval(autoSlide);
      }

      slider.parentElement.addEventListener("mouseenter", stopAutoSlide);
      slider.parentElement.addEventListener("mouseleave", startAutoSlide);

      updateSlider(false);
      startAutoSlide();
    }

    // 🪴 Initialize sliders
    data.forEach((array, index) => {
      const sliderNum = index + 1;
      createSlider(
        `Planters-slider-${sliderNum}`,
        `planterCounter${sliderNum}`,
        `prevPlanterBtn${sliderNum}`,
        `nextPlanterBtn${sliderNum}`,
        array,
        sliderNum % 1 === 0 // every even slider has border
      );
    });
  } catch (error) {
    console.error("Error loading planters data:", error);
  }
}
planters();
document.addEventListener("DOMContentLoaded", planters);
