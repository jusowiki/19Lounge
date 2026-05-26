const SUPABASE_URL = "https://cwxzorwsxyqihfozlgpy.supabase.co";

const SUPABASE_ANON_KEY =

"sb_publishable_mMHqsztDw4BxsSYXR9xFIg_paE4N4P1";

const supabaseClient = supabase.createClient(

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

menuBtn.addEventListener("click", () => {

  sideMenu.classList.add("open");

  overlay.classList.add("show");

});

overlay.addEventListener("click", closeMenu);

function closeMenu() {

  sideMenu.classList.remove("open");

  overlay.classList.remove("show");

}

const posts = [

  {

    title: "처음 온 사람들을 위한 이용규칙 정리",

    content: "불법촬영물, 미성년자 관련 내용, 개인정보 유출은 절대 금지입니다.",

    category: "공지",

    nickname: "관리자",

    views: 1284,

    comments: 42,

    likes: 88,

    time: "방금 전"

  },

  {

    title: "요즘 모바일 커뮤니티는 다크모드가 편하긴 하다",

    content: "밤에 보기 편하고 글목록 집중도도 높은 편입니다.",

    category: "자유",

    nickname: "익명",

    views: 532,

    comments: 18,

    likes: 21,

    time: "5분 전"

  },

  {

    title: "익명게시판은 글쓰기 버튼이 바로 보여야 좋음",

    content: "복잡한 절차 없이 빠르게 쓰는 흐름이 중요합니다.",

    category: "익명",

    nickname: "익명",

    views: 421,

    comments: 9,

    likes: 13,

    time: "11분 전"

  },

  {

    title: "후기 게시판은 인증 없이 운영하면 관리가 힘들 듯",

    content: "신고 버튼, 관리자 삭제 기능은 처음부터 필요해 보입니다.",

    category: "후기",

    nickname: "익명",

    views: 804,

    comments: 31,

    likes: 39,

    time: "23분 전"

  },

  {

    title: "광고는 처음부터 너무 많이 넣으면 이탈 심함",

    content: "초반엔 커뮤니티 느낌을 먼저 만들고 광고는 나중이 나을 듯.",

    category: "자유",

    nickname: "익명",

    views: 257,

    comments: 7,

    likes: 10,

    time: "34분 전"

  }

];

function renderHotPosts() {

  const sorted = [...posts].sort((a, b) => b.likes - a.likes).slice(0, 4);

  hotPosts.innerHTML = sorted.map((post, index) => `

    <article class="hot-card">

      <h3><span class="rank">${index + 1}</span>${post.title}</h3>

      <div class="meta">

        <span>${post.category}</span>

        <span>조회 ${post.views}</span>

        <span>댓글 ${post.comments}</span>

      </div>

    </article>

  `).join("");

}

function renderPosts() {

  postList.innerHTML = posts.map(post => `

    <article class="post-item">

      <div class="post-top">

        <div>

          <div class="post-title">${post.title}</div>

          <div class="post-preview">${post.content}</div>

        </div>

        <span class="badge">${post.category}</span>

      </div>

      <div class="meta">

        <span>${post.nickname}</span>

        <span>${post.time}</span>

        <span>조회 ${post.views}</span>

        <span>댓글 ${post.comments}</span>

        <span>추천 ${post.likes}</span>

      </div>

    </article>

  `).join("");

}

writeBtn.addEventListener("click", () => {

  writeModal.classList.add("show");

});

cancelBtn.addEventListener("click", () => {

  writeModal.classList.remove("show");

});

submitBtn.addEventListener("click", () => {

  const title = titleInput.value.trim();

  const content = contentInput.value.trim();

  if (!title || !content) {

    alert("제목과 내용을 입력하세요.");

    return;

  }

  posts.unshift({

    title,

    content,

    category: "익명",

    nickname: "익명",

    views: 0,

    comments: 0,

    likes: 0,

    time: "방금 전"

  });

  titleInput.value = "";

  contentInput.value = "";

  writeModal.classList.remove("show");

  renderHotPosts();

  renderPosts();

});

renderHotPosts();

renderPosts();
async function testConnection() {

  const { data, error } = await supabaseClient

    .from("posts")

    .select("*");

  console.log(data);

  console.log(error);

}

testConnection();