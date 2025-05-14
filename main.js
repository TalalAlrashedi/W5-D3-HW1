const apiUrl = "https://68219a1b259dad2655afc217.mockapi.io/api";

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (currentUser) {
  document.getElementById("logout-link").className =
    "d-flex btn btn-outline-danger";
} else {
  document.getElementById("login-link").className = "d-flex btn btn-success";
}

function logout() {
  localStorage.removeItem("currentUser");
  appendAlert("تم تسجيل الخروج بنجاح", "warning");

  setTimeout(() => {
    window.location.reload();

    window.location.href = "/login.html";
  }, 2000);
}
const imageUrl = document.getElementById("imageUrl");
const postText = document.getElementById("postText");
const button = document.getElementById("submit");

button.addEventListener("click", async () => {
  if (!currentUser) {
    alert("يجب تسجيل الدخول لإنشاء منشور");
    return;
  }

  await fetch(`${apiUrl}/post`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      imageUrl: imageUrl.value,
      text: postText.value,
      comment: [],
      userId: currentUser.id,
      username: currentUser.username,
    }),
  });

  getPosts();
});

async function getPosts() {
  const res = await fetch(`${apiUrl}/post`);
  const posts = await res.json();
  dsipalyPosts(posts);
}

function dsipalyPosts(posts) {
  const container = document.getElementById("posts-container");
  container.innerHTML = "";

  posts.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = item.imageUrl;

    const title = document.createElement("h4");
    title.innerText = item.text;

    const usernameNav = document.getElementById("navbar-name");
    usernameNav.innerText = `مرحبا ${item.username}`;
    const owner = document.createElement("p");
    owner.innerText = `@${item.username}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = " حذف المنشور";
    deleteBtn.className = "deleteBtn";
    deleteBtn.style.fontSize = "1rem";
    deleteBtn.onclick = async () => {
      let isConfirm = confirm("هل تريد حذف المنشور؟");
      if (!isConfirm) {
        return;
      }
      if (currentUser && item.userId === currentUser.id) {
        await fetch(`${apiUrl}/post/${item.id}`, {
          method: "DELETE",
        });
        getPosts();
      } else {
        alert("المنشور ليس لك !!");
      }
    };

    let commentList = document.createElement("ul");
    commentList.className = "commentContainer";
    let comments = item.comment;

    for (let i = 0; i < comments.length; i++) {
      let comment = comments[i];

      let commentItem = document.createElement("li");
      commentItem.innerText = currentUser.username + ": " + comment.text;

      if (currentUser && comment.userId === currentUser.id) {
        let deleteButton = document.createElement("button");
        deleteButton.className = "deleteBtn";
        deleteButton.innerText = "حذف التعليق";

        deleteButton.onclick = async function () {
          comments.splice(i, 1);

          await fetch(`${apiUrl}/post/${item.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ comment: comments }),
          });

          getPosts();
        };

        commentItem.appendChild(deleteButton);
      }

      commentList.appendChild(commentItem);
    }

    const commentInput = document.createElement("input");
    commentInput.placeholder = "أضف تعليق";

    const commentBtn = document.createElement("button");
    commentBtn.className = "addComment";
    commentBtn.innerText = " نشر تعليق";
    commentBtn.onclick = async () => {
      if (!currentUser) {
        alert("يجب تسجيل الدخول لإضافة تعليق");
        return;
      }

      const text = commentInput.value.trim();
      if (text === "") return;

      const updatedComments = [
        ...(item.comment || []),
        {
          userId: currentUser.id,
          name: currentUser.name,
          text: text,
        },
      ];

      await fetch(`${apiUrl}/post/${item.id}`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ comment: updatedComments }),
      });

      getPosts();
    };

    card.appendChild(owner);
    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(deleteBtn);
    card.appendChild(commentList);
    card.appendChild(commentInput);
    card.appendChild(commentBtn);

    container.appendChild(card);
  });
}

getPosts();
