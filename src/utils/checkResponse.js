export function checkResponse(res) {
  if (!res.ok) {
    return res.json().then((error) => {
      return Promise.reject(`Ошибка: ${error.message || res.statusText}`);
    });
  }
  return res.json();
}
