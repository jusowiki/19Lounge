const SUPABASE_URL =

"https://cwxzorwsxyqihfozlgpy.supabase.co";

const SUPABASE_ANON_KEY =

"sb_publishable_mMHqsztDw4BxsSYXR9xFIg_paE4N4P1";

const db = supabase.createClient(

  SUPABASE_URL,

  SUPABASE_ANON_KEY

);

const ADMIN_PASSWORD = "1234";

const menuBtn = document.getElementById("menuBtn");

const sideMenu = document.getElementById("sideMenu");

const overlay = document.getElementById("overlay");

const homeView = document.getElementById("homeView");

const writeView = document.getElementById("writeView");

const detailView = document.getElementById("detailView");

const writeBtn = document.getElementById("writeBtn");

const writeBackBtn = document.getElementById("writeBackBtn");

const detailBackBtn = document.getElementById("detailBackBtn");

const postList = document.getElementById("postList");

const hotPosts = document.getElementById("hotPosts");

const titleInput = document.getElementById("titleInput");

const contentInput = document.getElementById("contentInput");

const categoryInput = document.getElementById("categoryInput");

const nicknameInput = document.getElementById("nicknameInput");

const passwordInput = document.getElementById("passwordInput");

const submitBtn = document.getElementById("submitBtn");

const detailCategory = document.getElementById("detailCategory");

const detailTitle = document.getElementById("detailTitle");

const detailMeta = document.getElementById("detailMeta");

const detailContent = document.getElementById("detailContent");

const likeBtn = document.getElementById("likeBtn");

const likeCount = document.getElementById("likeCount");

const deletePostBtn = document.getElementById("deletePostBtn");

const adminDeleteBtn = document.getElementById("adminDeleteBtn");

const commentInput = document.getElementById("commentInput");

const commentNicknameInput =

document.getElementById("commentNicknameInput");

const commentSubmitBtn =

document.getElementById("commentSubmitBtn");

const commentList = document.getElementById("commentList");

const commentCount = document.getElementById("commentCount");

const categoryButtons =

document.querySelectorAll(".category-tabs button");

let posts = [];

let selectedCategory = "전체";

let currentPost = null;

const randomNames = [

  "새벽남",

  "고독한늑대",

  "현실남",

  "밤의손님",

  "국결준비생",

  "혼술러",

  "무명남",

  "NOX맨"

];

function getSavedNickname(){

  let name = localStorage.getItem("noxNickname");

  if(!name){

    const random =

    randomNames[

      Math.floor(Math.random()*randomNames.length)

    ];

    const number =

    Math.floor(Math.random()*9000)+1000;

    name = `${random}${number}`;

    localStorage.setItem("noxNickname",name);

  }

  return name;

}

function showView(view){

  homeView.classList.add("hidden");

  writeView.classList.add("hidden");

  detailView.classList.add("hidden");

  if(view==="home"){

    homeView.classList.remove("hidden");

    writeBtn.classList.remove("hidden");

  }

  if(view==="write"){

    writeView.classList.remove("hidden");

    writeBtn.classList.add("hidden");

  }

  if(view==="detail"){

    detailView.classList.remove("hidden");

    writeBtn.classList.add("hidden");

  }

  window.scrollTo(0,0);

}

menuBtn.addEventListener("click",()=>{

  sideMenu.classList.add("open");

  overlay.classList.add("show");

});

overlay.addEventListener("click",()=>{

  sideMenu.classList.remove("open");

  overlay.classList.remove("show");

});

writeBtn.addEventListener("click",()=>{

  nicknameInput.value = getSavedNickname();

  showView("write");

});

writeBackBtn.addEventListener("click",()=>{

  showView("home");

});

detailBackBtn.addEventListener("click",()=>{

  showView("home");

});

function escapeHtml(text=""){

  return String(text)

  .replaceAll("&","&amp;")

  .replaceAll("<","&lt;")

  .replaceAll(">","&gt;");

}

async function loadPosts(){

  let query = db

  .from("posts")

  .select("*")

  .order("created_at",{ascending:false});

  if(selectedCategory!=="전체"){

    query = query.eq("category",selectedCategory);

  }

  const {data,error} = await query;

  if(error){

    console.error(error);

    return;

  }

  posts = data || [];

  renderPosts();

  renderHotPosts();

}

function renderHotPosts(){

  const sorted =

  [...posts]

  .sort((a,b)=>(b.likes||0)-(a.likes||0))

  .slice(0,4);

  hotPosts.innerHTML =

  sorted.map((post,index)=>`

    <article

      class="hot-card"

      onclick="openPost(${post.id})"

    >

      <h3>

        <span class="rank">${index+1}</span>

        ${escapeHtml(post.title)}

      </h3>

      <div class="meta">

        <span>${post.category}</span>

        <span>${post.nickname}</span>

      </div>

    </article>

  `).join("");

}

function renderPosts(){

  postList.innerHTML =

  posts.map(post=>`

    <article

      class="post-item"

      onclick="openPost(${post.id})"

    >

      <div class="post-title">

        ${escapeHtml(post.title)}

      </div>

      <div class="post-preview">

        ${escapeHtml(post.content).slice(0,80)}

      </div>

      <div class="meta">

        <span>${post.nickname}</span>

        <span>${post.category}</span>

        <span>조회 ${post.views||0}</span>

        <span>추천 ${post.likes||0}</span>

      </div>

    </article>

  `).join("");

}

categoryButtons.forEach(button=>{

  button.addEventListener("click",async()=>{

    categoryButtons.forEach(btn=>{

      btn.classList.remove("active");

    });

    button.classList.add("active");

    selectedCategory = button.dataset.category;

    await loadPosts();

  });

});

submitBtn.addEventListener("click",async()=>{

  const title = titleInput.value.trim();

  const content = contentInput.value.trim();

  const category = categoryInput.value;

  const nickname =

  nicknameInput.value.trim() || getSavedNickname();

  const password = passwordInput.value.trim();

  if(password.length!==5){

    alert("비밀번호는 숫자 5자리입니다.");

    return;

  }

  const {error} = await db

  .from("posts")

  .insert([{

    title,

    content,

    category,

    nickname,

    author_password:password,

    views:0,

    likes:0

  }]);

  if(error){

    console.error(error);

    alert("등록 실패");

    return;

  }

  localStorage.setItem("noxNickname",nickname);

  titleInput.value="";

  contentInput.value="";

  passwordInput.value="";

  alert("등록 완료");

  showView("home");

  loadPosts();

});

window.openPost = async function(postId){

  const {data,error} = await db

  .from("posts")

  .select("*")

  .eq("id",postId)

  .single();

  if(error){

    return;

  }

  currentPost = data;

  detailCategory.textContent =

  currentPost.category;

  detailTitle.textContent =

  currentPost.title;

  detailContent.textContent =

  currentPost.content;

  detailMeta.innerHTML = `

    <span>${currentPost.nickname}</span>

    <span>조회 ${currentPost.views||0}</span>

    <span>추천 ${currentPost.likes||0}</span>

  `;

  likeCount.textContent =

  currentPost.likes||0;

  showView("detail");

  loadComments(postId);

};

likeBtn.addEventListener("click",async()=>{

  if(!currentPost) return;

  const newLikes =

  (currentPost.likes||0)+1;

  await db

  .from("posts")

  .update({likes:newLikes})

  .eq("id",currentPost.id);

  currentPost.likes = newLikes;

  likeCount.textContent = newLikes;

});

deletePostBtn.addEventListener("click",async()=>{

  if(!currentPost) return;

  const pw = prompt("비밀번호 입력");

  if(pw!==currentPost.author_password){

    alert("비밀번호 불일치");

    return;

  }

  await db

  .from("posts")

  .delete()

  .eq("id",currentPost.id);

  alert("삭제 완료");

  showView("home");

  loadPosts();

});

adminDeleteBtn.addEventListener("click",async()=>{

  const pw = prompt("관리자 비밀번호");

  if(pw!==ADMIN_PASSWORD){

    alert("실패");

    return;

  }

  await db

  .from("posts")

  .delete()

  .eq("id",currentPost.id);

  alert("관리자 삭제 완료");

  showView("home");

  loadPosts();

});

async function loadComments(postId){

  const {data,error} = await db

  .from("comments")

  .select("*")

  .eq("post_id",postId)

  .order("created_at",{ascending:true});

  if(error){

    return;

  }

  renderComments(data||[]);

}

function renderComments(comments){

  commentCount.textContent =

  comments.length;

  commentList.innerHTML =

  comments.map(comment=>`

    <article class="comment-item">

      <div class="meta">

        <span>${comment.nickname}</span>

      </div>

      <div class="comment-content">

        ${escapeHtml(comment.content)}

      </div>

    </article>

  `).join("");

}

commentSubmitBtn.addEventListener("click",async()=>{

  if(!currentPost) return;

  const content =

  commentInput.value.trim();

  const nickname =

  commentNicknameInput.value.trim()

  || getSavedNickname();

  if(!content){

    return;

  }

  await db

  .from("comments")

  .insert([{

    post_id:currentPost.id,

    content,

    nickname

  }]);

  commentInput.value="";

  loadComments(currentPost.id);

});

commentNicknameInput.value =

getSavedNickname();

loadPosts();