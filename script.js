const SUPABASE_URL = "여기에_URL";

const SUPABASE_KEY = "여기에_KEY";

const supabaseClient = supabase.createClient(

  SUPABASE_URL,

  SUPABASE_KEY

);

const categoryButtons = document.querySelectorAll(

  ".category-tabs button"

);

const rateBoard = document.getElementById("rateBoard");

const postList = document.getElementById("postList");

const currentCategoryTitle = document.getElementById(

  "currentCategoryTitle"

);

const searchInput = document.getElementById("searchInput");

const searchBtn = document.getElementById("searchBtn");

let selectedCategory = "전체";

const demoPosts = [

  {

    category: "반도체현장",

    title: "평택 배관 조공 숙식X 18준다",

    nickname: "평택조공47",

    created_at: "2026-05-28"

  },

  {

    category: "공수자랑",

    title: "이번달 620 찍혔다",

    nickname: "노가다형12",

    created_at: "2026-05-28"

  },

  {

    category: "숙소생활",

    title: "고덕 숙소 여기 괜찮냐",

    nickname: "숙노중88",

    created_at: "2026-05-28"

  }

];

async function loadPosts() {

  postList.innerHTML = "";

  let filteredPosts = demoPosts;

  if (selectedCategory !== "전체") {

    filteredPosts = filteredPosts.filter(

      post => post.category === selectedCategory

    );

  }

  const keyword = searchInput.value.trim();

  if (keyword) {

    filteredPosts = filteredPosts.filter(post =>

      post.title.includes(keyword)

    );

  }

  filteredPosts.forEach(post => {

    const card = document.createElement("div");

    card.className = "post-card";

    card.innerHTML = `

      <div class="post-title">

        ${post.title}

      </div>

      <div class="post-meta">

        <span>${post.category}</span>

        <span>${post.nickname}</span>

        <span>${post.created_at}</span>

      </div>

    `;

    postList.appendChild(card);

  });

}

categoryButtons.forEach(button => {

  button.addEventListener("click", async () => {

    categoryButtons.forEach(btn =>

      btn.classList.remove("active")

    );

    button.classList.add("active");

    selectedCategory = button.dataset.category;

    currentCategoryTitle.textContent =

      selectedCategory;

    if (selectedCategory === "단가표") {

      rateBoard.classList.remove("hidden");

      postList.classList.add("hidden");

    } else {

      rateBoard.classList.add("hidden");

      postList.classList.remove("hidden");

      await loadPosts();

    }

  });

});

searchBtn.addEventListener("click", async () => {

  currentCategoryTitle.textContent = "검색 결과";

  await loadPosts();

});

searchInput.addEventListener("keydown", async e => {

  if (e.key === "Enter") {

    currentCategoryTitle.textContent = "검색 결과";

    await loadPosts();

  }

});

loadPosts();