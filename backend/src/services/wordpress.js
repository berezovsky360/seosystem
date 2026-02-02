import axios from "axios";

function getAuthHeaders({ username, appPassword }) {
  const token = Buffer.from(`${username}:${appPassword}`).toString("base64");
  return {
    Authorization: `Basic ${token}`,
  };
}

export async function checkSiteStatus({ url, username, appPassword }) {
  try {
    await axios.get(`${url}/wp-json/wp/v2/users/me`, {
      headers: getAuthHeaders({ username, appPassword }),
      timeout: 5000,
    });
    return "online";
  } catch (error) {
    if (error.response?.status === 401) {
      return "unauthorized";
    }
    return "offline";
  }
}

export async function fetchPosts(auth) {
  const response = await axios.get(`${auth.url}/wp-json/wp/v2/posts`, {
    headers: getAuthHeaders(auth),
  });
  return response.data.map((post) => ({
    id: post.id,
    title: post.title.rendered,
    status: post.status,
    link: post.link,
    date: post.date,
  }));
}

export async function createDraft(auth, payload) {
  const response = await axios.post(
    `${auth.url}/wp-json/wp/v2/posts`,
    { title: payload.title, content: payload.content, status: "draft" },
    { headers: getAuthHeaders(auth) }
  );
  return response.data;
}

export async function publishPost(auth, postId) {
  const response = await axios.post(
    `${auth.url}/wp-json/wp/v2/posts/${postId}`,
    { status: "publish" },
    { headers: getAuthHeaders(auth) }
  );
  return response.data;
}

export async function syncPost(auth, postId, payload) {
  const response = await axios.post(
    `${auth.url}/wp-json/wp/v2/posts/${postId}`,
    payload,
    { headers: getAuthHeaders(auth) }
  );
  return response.data;
}
