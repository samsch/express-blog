function handleResponse (res) {
  if (res.headers.get('content-type').includes('application/json')) {
    return res.json().then(data => ({ res, data }));
  } else {
    return res.text().then(data => ({ res, data }));
  }
}

function getOptions (options = {}) {
  return {
    credentials: 'same-origin',
    ...options,
    headers: {
      'Accept': 'application/json',
      ...options.headers,
    },
  };
}

export const get = (url) => {
  return fetch(url, getOptions())
    .then(handleResponse);
};

export const post = (url, body) => {
  return fetch(url, getOptions({
    method: 'post',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  }))
    .then(handleResponse);
};

export const put = (url, id, body) => {
  return fetch(`${url}/${id}`, getOptions({
    method: 'put',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  }))
    .then(handleResponse);
};

export const del = (url, id) => {
  return fetch(`${url}/${id}`, getOptions({
    method: 'delete',
  }))
    .then(handleResponse);
};
