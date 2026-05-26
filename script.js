const SUPABASE_URL = "https://cwxzorwsxyqihfozlgpy.supabase.co";

const SUPABASE_ANON_KEY =

  "sb_publishable_mMHqsztDw4BxsSYXR9xFIg_paE4N4P1";

const db = supabase.createClient(

  SUPABASE_URL,

  SUPABASE_ANON_KEY

);

const menuBtn = document.getElementById("menuBtn");

const sideMenu = document.getElementById("sideMenu");

const overlay = document.getElementById("overlay");

const hotPosts = document.getElementById("hotPosts");

const postList = document.getElementById("postList");

const writeBtn = document.getElementById("writeBtn");

const writeModal = document.getElementById("writeModal");

const cancelBtn = document.getElementById("cancelBtn");

const submitBtn = document.getElementById("submitBtn");

const titleInput = document.getElementById("titleInput");

const contentInput = document.getElementById("contentInput");

const categoryInput = document.getElementById("categoryInput");

const nicknameInput = document.getElementById("nicknameInput");

const sortSelect = document.getElementById("sortSelect");

const currentCategoryTitle = document.getElementById("currentCategoryTitle");

const categoryButtons = document.querySelectorAll(".category-tabs button");

let posts = [];

let selectedCategory = "전체";

const randomNames = [

  "새벽남", "고독한늑대", "현실남", "밤의손님", "노멀맨",

  "국결준비생", "라운지남", "혼술러", "무명남", "NOX맨"

];

function getSavedNickname() {

  let name = localStorage.getItem("noxNickname");

  if (!name) {

    const random = randomNames[Math.floor(Math.random() * randomNames.length)];

    const number = Math.floor(Math.random() * 9000) + 1000;

    name = `${random}${number}`;

    localStorage.setItem("noxNickname", name);

  }

  return name;

}

menuBtn.addEventListener("click", () => {

  sideMenu.classList.add("open");

  overlay.classList.add("show");

});

overlay.addEventListener("click", closeMenu);

function closeMenu() {

  sideMenu.classList.remove("open");

  overlay.classList.remove("show");

}

function escapeHtml(text = "") {

  return String(text)

    .replaceAll("&", "&amp;")

    .replaceAll("<", "&lt;")

    .replaceAll(">", "&gt;")

    .replaceAll('"', "&quot;")

    .replaceAll("'", "&#039;");

}

function formatDate(value) {

  if (!value) return "방금 전";

  const date = new Date(value);

  return date.toLocaleString("ko-KR", {

    month: "2-digit",

    day: "2-digit",

    hour: "2-digit",

    minute: "2-digit"

  });

}

async function loadPosts() {

  let query = db

    .from("posts")

    .select("*")

    .order("created_at", { ascending: false });

  if (selectedCategory !== "전체") {

    query = query.eq("category", selectedCategory);

  }

  const { data, error } = await query;

  if (error) {

    console.error(error);

    alert("게시글을 불러오지 못했습니다.");

    return;

  }

  posts = data || [];

  renderHotPosts();

  renderPosts();

}

function renderHotPosts() {

  const sorted = [...posts]

    .sort((a, b) => (b.likes || 0) - (a.likes || 0))

    .slice(0, 4);

  if (!sorted.length) {

    hotPosts.innerHTML = "";

    return;

  }

  hotPosts.innerHTML = sorted.map((post, index) => `

    <article class="hot-card">

      <h3>

        <span class="rank">${index + 1}</span>

        ${escapeHtml(post.title)}

      </h3>

      <div class="meta">

        <span>${escapeHtml(post.category || "라운지")}</span>

        <span>${escapeHtml(post.nickname || "익명")}</span>

        <span>조회 ${post.views || 0}</span>

        <span>추천 ${post.likes || 0}</span>

      </div>

    </article>

  `).join("");

}

function renderPosts() {

  if (!posts.length) {

    postList.innerHTML = `

      <article class="post-item">

        <div class="post-title">아직 게시글이 없습니다.</div>

        <div class="post-preview">첫 글을 작성해보세요.</div>

      </article>

    `;

    return;

  }

  postList.innerHTML = posts.map(post => `

    <article class="post-item">

      <div class="post-top">

        <div>

          <div class="post-title">${escapeHtml(post.title)}</div>

          <div class="post-preview">${escapeHtml(post.content)}</div>

        </div>

        <span class="badge">${escapeHtml(post.category || "라운지")}</span>

      </div>

      <div class="meta">

        <span>${escapeHtml(post.nickname || "익명")}</span>

        <span>${formatDate(post.created_at)}</span>

        <span>조회 ${post.views || 0}</span>

        <span>추천 ${post.likes || 0}</span>

      </div>

    </article>

  `).join("");

}

categoryButtons.forEach(button => {

  button.addEventListener("click", async () => {

    categoryButtons.forEach(btn => btn.classList.remove("active"));

    button.classList.add("active");

    selectedCategory = button.dataset.category;

    currentCategoryTitle.textContent =

      selectedCategory === "전체" ? "최신글" : `${selectedCategory} 게시판`;

    await loadPosts();

  });

});

sortSelect.addEventListener("change", () => {

  if (sortSelect.value === "popular") {

    posts.sort((a, b) => (b.likes || 0) - (a.likes || 0));

  } else {

    posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  }

  renderPosts();

});

writeBtn.addEventListener("click", () => {

  nicknameInput.value = getSavedNickname();

  writeModal.classList.add("show");

});

cancelBtn.addEventListener("click", () => {

  writeModal.classList.remove("show");

});

submitBtn.addEventListener("click", async () => {

  const title = titleInput.value.trim();

  const content = contentInput.value.trim();

  const category = categoryInput.value;

  const nickname = nicknameInput.value.trim() || getSavedNickname();

  if (!title || !content) {

    alert("제목과 내용을 입력하세요.");

    return;

  }

  localStorage.setItem("noxNickname", nickname);

  const { error } = await db

    .from("posts")

    .insert([

      {

        title,

        content,

        category,

        nickname,

        views: 0,

        likes: 0

      }

    ]);

  if (error) {

    console.error(error);

    alert("글 등록에 실패했습니다.");

    return;

  }

  titleInput.value = "";

  contentInput.value = "";

  writeModal.classList.remove("show");

  selectedCategory = "전체";

  categoryButtons.forEach(btn => {

    btn.classList.toggle("active", btn.dataset.category === "전체");

  });

  currentCategoryTitle.textContent = "최신글";

  await loadPosts();

});

loadPosts();