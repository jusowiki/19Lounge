const SUPABASE_URL =

"https://cwxzorwsxyqihfozlgpy.supabase.co";

const SUPABASE_ANON_KEY =

"sb_publishable_mMHqsztDw4BxsSYXR9xFIg_paE4N4P1";

const db = supabase.createClient(

  SUPABASE_URL,

  SUPABASE_ANON_KEY

);

const homeView = document.getElementById("homeView");

const writeView = document.getElementById("writeView");

const detailView = document.getElementById("detailView");

const writeBtn = document.getElementById("writeBtn");

const writeBackBtn = document.getElementById("writeBackBtn");

const detailBackBtn = document.getElementById("detailBackBtn");

const postList = document.getElementById("postList");

const submitBtn = document.getElementById("submitBtn");

const titleInput = document.getElementById("titleInput");

const contentInput = document.getElementById("contentInput");

const categoryInput = document.getElementById("categoryInput");

const nicknameInput = document.getElementById("nicknameInput");

const passwordInput = document.getElementById("passwordInput");

const detailCategory = document.getElementById("detailCategory");

const detailTitle = document.getElementById("detailTitle");

const detailMeta = document.getElementById("detailMeta");

const detailContent = document.getElementById("detailContent");

const likeBtn = document.getElementById("likeBtn");

const likeCount = document.getElementById("likeCount");

const deletePostBtn =

document.getElementById("deletePostBtn");

const commentNicknameInput =

document.getElementById("commentNicknameInput");

const commentInput =

document.getElementById("commentInput");

const commentSubmitBtn =

document.getElementById("commentSubmitBtn");

const commentList =

document.getElementById("commentList");

let posts = [];

let currentPost = null;

const randomNames = [

  "새벽남","현실남","고독한늑대",

  "무명남","혼술러","NOX맨"

];

function getNickname(){

  let saved =

  localStorage.getItem("noxNickname");

  if(saved) return saved;

  const random =

  randomNames[

    Math.floor(Math.random()*randomNames.length)

  ];

  const number =

  Math.floor(Math.random()*9000)+1000;

  const name = `${random}${number}`;

  localStorage.setItem("noxNickname",name);

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

writeBtn.addEventListener("click",()=>{

  nicknameInput.value = getNickname();

  showView("write");

});

writeBackBtn.addEventListener("click",()=>{

  showView("home");

});

detailBackBtn.addEventListener("click",()=>{

  showView("home");

});

async function loadPosts(){

  const {data,error} = await db

  .from("posts")

  .select("*")

  .order("created_at",{ascending:false});

  if(error){

    alert("게시글 불러오기 실패");

    return;

  }

  posts = data || [];

  renderPosts();

}

function renderPosts(){

  if(!posts.length){

    postList.innerHTML = `

      <div class="post-item">

        게시글이 없습니다.

      </div>

    `;

    return;

  }

  postList.innerHTML = posts.map(post=>`

    <article

      class="post-item"

      data-id="${post.id}"

    >

      <div class="post-title">

        ${post.title}

      </div>

      <div class="post-preview">

        ${post.content.slice(0,80)}

      </div>

      <div class="meta">

        <span>${post.nickname}</span>

        <span>${post.category}</span>

        <span>조회 ${post.views || 0}</span>

        <span>추천 ${post.likes || 0}</span>

      </div>

    </article>

  `).join("");

  document

  .querySelectorAll(".post-item")

  .forEach(item=>{

    item.addEventListener("click",()=>{

      openPost(item.dataset.id);

    });

  });

}

submitBtn.addEventListener("click",async()=>{

  const title = titleInput.value.trim();

  const content = contentInput.value.trim();

  const category = categoryInput.value;

  const nickname =

  nicknameInput.value.trim() || getNickname();

  const password =

  passwordInput.value.trim();

  if(!title || !content){

    alert("제목과 내용을 입력하세요.");

    return;

  }

  if(!/^\d{5}$/.test(password)){

    alert("비밀번호는 숫자 5자리입니다.");

    return;

  }

  localStorage.setItem(

    "noxNickname",

    nickname

  );

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

    alert("등록 실패");

    return;

  }

  alert("등록 완료");

  titleInput.value = "";

  contentInput.value = "";

  passwordInput.value = "";

  await loadPosts();

  showView("home");

});

async function openPost(id){

  const {data,error} = await db

  .from("posts")

  .select("*")

  .eq("id",id)

  .single();

  if(error){

    alert("게시글 오류");

    return;

  }

  currentPost = data;

  await db

  .from("posts")

  .update({

    views:(data.views||0)+1

  })

  .eq("id",id);

  detailCategory.textContent =

  data.category;

  detailTitle.textContent =

  data.title;

  detailMeta.innerHTML = `

    <span>${data.nickname}</span>

    <span>조회 ${(data.views||0)+1}</span>

    <span>추천 ${data.likes||0}</span>

  `;

  detailContent.textContent =

  data.content;

  likeCount.textContent =

  data.likes || 0;

  await loadComments(id);

  showView("detail");

}

likeBtn.addEventListener("click",async()=>{

  if(!currentPost) return;

  const likes =

  (currentPost.likes||0)+1;

  await db

  .from("posts")

  .update({likes})

  .eq("id",currentPost.id);

  currentPost.likes = likes;

  likeCount.textContent = likes;

});

deletePostBtn.addEventListener("click",async()=>{

  if(!currentPost) return;

  const pw =

  prompt("비밀번호 5자리 입력");

  if(

    pw !== currentPost.author_password

  ){

    alert("비밀번호 불일치");

    return;

  }

  await db

  .from("posts")

  .delete()

  .eq("id",currentPost.id);

  alert("삭제 완료");

  await loadPosts();

  showView("home");

});

async function loadComments(postId){

  const {data,error} = await db

  .from("comments")

  .select("*")

  .eq("post_id",postId)

  .order("created_at",{ascending:true});

  if(error){

    alert("댓글 불러오기 실패");

    return;

  }

  renderComments(data||[]);

}

function renderComments(comments){

  if(!comments.length){

    commentList.innerHTML = `

      <div class="comment-item">

        댓글이 없습니다.

      </div>

    `;

    return;

  }

  commentList.innerHTML = comments.map(c=>`

    <div class="comment-item">

      <div class="meta">

        <span>${c.nickname}</span>

      </div>

      <div class="detail-content">

        ${c.content}

      </div>

    </div>

  `).join("");

}

commentNicknameInput.value =

getNickname();

commentSubmitBtn.addEventListener(

"click",

async()=>{

  if(!currentPost) return;

  const nickname =

  commentNicknameInput.value.trim()

  || getNickname();

  const content =

  commentInput.value.trim();

  if(!content){

    alert("댓글 입력");

    return;

  }

  await db

  .from("comments")

  .insert([{

    post_id:currentPost.id,

    nickname,

    content

  }]);

  commentInput.value = "";

  await loadComments(currentPost.id);

});

loadPosts();