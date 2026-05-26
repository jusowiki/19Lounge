const SUPABASE_URL = "https://cwxzorwsxyqihfozlgpy.supabase.co";

const SUPABASE_ANON_KEY =

  "sb_publishable_mMHqsztDw4BxsSYXR9xFIg_paE4N4P1";

const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ADMIN_PASSWORD = "1234";

const menuBtn = document.getElementById("menuBtn");

const sideMenu = document.getElementById("sideMenu");

const overlay = document.getElementById("overlay");

const sideHome = document.getElementById("sideHome");

const homeLogo = document.getElementById("homeLogo");

const homeView = document.getElementById("homeView");

const writeView = document.getElementById("writeView");

const detailView = document.getElementById("detailView");

const hotPosts = document.getElementById("hotPosts");

const postList = document.getElementById("postList");

const writeBtn = document.getElementById("writeBtn");

const writeBackBtn = document.getElementById("writeBackBtn");

const detailBackBtn = document.getElementById("detailBackBtn");

const submitBtn = document.getElementById("submitBtn");

const titleInput = document.getElementById("titleInput");

const contentInput = document.getElementById("contentInput");

const categoryInput = document.getElementById("categoryInput");

const nicknameInput = document.getElementById("nicknameInput");

const passwordInput = document.getElementById("passwordInput");

const sortSelect = document.getElementById("sortSelect");

const currentCategoryTitle = document.getElementById("currentCategoryTitle");

const categoryButtons = document.querySelectorAll(".category-tabs button");

const detailCategory = document.getElementById("detailCategory");

const detailTitle = document.getElementById("detailTitle");

const detailMeta = document.getElementById("detailMeta");

const detailContent = document.getElementById("detailContent");

const likeBtn = document.getElementById("likeBtn");

const likeCount = document.getElementById("likeCount");

const deletePostBtn = document.getElementById("deletePostBtn");

const adminDeleteBtn = document.getElementById("adminDeleteBtn");

const commentNicknameInput = document.getElementById("commentNicknameInput");

const commentInput = document.getElementById("commentInput");

const commentSubmitBtn = document.getElementById("commentSubmitBtn");

const commentList = document.getElementById("commentList");

const commentCount = document.getElementById("commentCount");

let posts = [];

let selectedCategory = "전체";

let currentPost = null;

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

function showView(viewName) {

  homeView.classList.add("hidden");

  writeView.classList.add("hidden");

  detailView.classList.add("hidden");

  if (viewName === "home") {

    homeView.classList.remove("hidden");

    writeBtn.classList.remove("hidden");

  }

  if (viewName === "write") {

    writeView.classList.remove("hidden");

    writeBtn.classList.add("hidden");

  }

  if (viewName === "detail") {

    detailView.classList.remove("hidden");

    writeBtn.classList.add("hidden");

  }

  window.scrollTo({ top: 0, behavior: "smooth" });

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

homeLogo.addEventListener("click", goHome);

sideHome.addEventListener("click", goHome);

writeBackBtn.addEventListener("click", goHome);

detailBackBtn.addEventListener("click", goHome);

function goHome() {

  closeMenu();

  showView("home");

  loadPosts();

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

    <article class="hot-card" onclick="openPost(${post.id})">

      <h3><span class="rank">${index + 1}</span>${escapeHtml(post.title)}</h3>

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

    <article class="post-item" onclick="openPost(${post.id})">

      <div class="post-top">

        <div>

          <div class="post-title">${escapeHtml(post.title)}</div>

          <div class="post-preview">${escapeHtml(post.content).slice(0, 80)}${post.content.length > 80 ? "..." : ""}</div>

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

  passwordInput.value = "";

  titleInput.value = "";

  contentInput.value = "";

  showView("write");

});

submitBtn.addEventListener("click", async () => {

  const title = titleInput.value.trim();

  const content = contentInput.value.trim();

  const category = categoryInput.value;

  const nickname = nicknameInput.value.trim() || getSavedNickname();

  const password = passwordInput.value.trim();

  if (!title || !content) {

    alert("제목과 내용을 입력하세요.");

    return;

  }

  if (!password) {

    alert("수정/삭제용 비밀번호를 입력하세요.");

    return;

  }

  localStorage.setItem("noxNickname", nickname);

  const { error } = await db

    .from("posts")

    .insert([{

      title,

      content,

      category,

      nickname,

      author_password: password,

      views: 0,

      likes: 0

    }]);

  if (error) {

    console.error(error);

    alert("글 등록에 실패했습니다.");

    return;

  }

  alert("등록되었습니다.");

  goHome();

});

window.openPost = async function(postId) {

  const { data, error } = await db

    .from("posts")

    .select("*")

    .eq("id", postId)

    .single();

  if (error) {

    console.error(error);

    alert("게시글을 불러오지 못했습니다.");

    return;

  }

  currentPost = data;

  await db

    .from("posts")

    .update({ views: (data.views || 0) + 1 })

    .eq("id", data.id);

  currentPost.views = (currentPost.views || 0) + 1;

  renderDetail();

  await loadComments(currentPost.id);

  showView("detail");

};

function renderDetail() {

  detailCategory.textContent = currentPost.category || "라운지";

  detailTitle.textContent = currentPost.title;

  detailMeta.innerHTML = `

    <span>${escapeHtml(currentPost.nickname || "익명")}</span>

    <span>${formatDate(currentPost.created_at)}</span>

    <span>조회 ${currentPost.views || 0}</span>

    <span>추천 ${currentPost.likes || 0}</span>

  `;

  detailContent.textContent = currentPost.content;

  likeCount.textContent = currentPost.likes || 0;

}

likeBtn.addEventListener("click", async () => {

  if (!currentPost) return;

  const newLikes = (currentPost.likes || 0) + 1;

  const { error } = await db

    .from("posts")

    .update({ likes: newLikes })

    .eq("id", currentPost.id);

  if (error) {

    alert("추천 실패");

    return;

  }

  currentPost.likes = newLikes;

  renderDetail();

});

deletePostBtn.addEventListener("click", async () => {

  if (!currentPost) return;

  const pw = prompt("글 비밀번호를 입력하세요.");

  if (!pw) return;

  if (pw !== currentPost.author_password) {

    alert("비밀번호가 다릅니다.");

    return;

  }

  const { error } = await db

    .from("posts")

    .delete()

    .eq("id", currentPost.id);

  if (error) {

    alert("삭제 실패");

    return;

  }

  alert("삭제되었습니다.");

  goHome();

});

adminDeleteBtn.addEventListener("click", async () => {

  if (!currentPost) return;

  const pw = prompt("관리자 비밀번호를 입력하세요.");

  if (pw !== ADMIN_PASSWORD) {

    alert("관리자 비밀번호가 다릅니다.");

    return;

  }

  const { error } = await db

    .from("posts")

    .delete()

    .eq("id", currentPost.id);

  if (error) {

    alert("관리자 삭제 실패");

    return;

  }

  alert("관리자 삭제 완료");

  goHome();

});

async function loadComments(postId) {

  const { data, error } = await db

    .from("comments")

    .select("*")

    .eq("post_id", postId)

    .order("created_at", { ascending: true });

  if (error) {

    console.error(error);

    alert("댓글을 불러오지 못했습니다.");

    return;

  }

  renderComments(data || []);

}

function renderComments(comments) {

  commentCount.textContent = comments.length;

  if (!comments.length) {

    commentList.innerHTML = `

      <article class="comment-item">

        <div class="meta">아직 댓글이 없습니다.</div>

        <div class="comment-content">첫 댓글을 남겨보세요.</div>

      </article>

    `;

    return;

  }

  commentList.innerHTML = comments.map(comment => `

    <article class="comment-item">

      <div class="meta">

        <span>${escapeHtml(comment.nickname || "익명")}</span>

        <span>${formatDate(comment.created_at)}</span>

      </div>

      <div class="comment-content">${escapeHtml(comment.content)}</div>

    </article>

  `).join("");

}

commentSubmitBtn.addEventListener("click", async () => {

  if (!currentPost) return;

  const nickname = commentNicknameInput.value.trim() || getSavedNickname();

  const content = commentInput.value.trim();

  if (!content) {

    alert("댓글을 입력하세요.");

    return;

  }

  localStorage.setItem("noxNickname", nickname);

  const { error } = await db

    .from("comments")

    .insert([{

      post_id: currentPost.id,

      content,

      nickname

    }]);

  if (error) {

    console.error(error);

    alert("댓글 등록 실패");

    return;

  }

  commentInput.value = "";

  await loadComments(currentPost.id);

});

commentNicknameInput.value = getSavedNickname();

loadPosts();