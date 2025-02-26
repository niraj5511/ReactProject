const productionUrl = "https://dipakshrestha1.com.np";

export const FetchData = async ({ url, token, id }) => {
  const fullUrl = `${productionUrl}/${url}${id ? `/${id}` : ''}`;
  const response = await fetch(fullUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const dataRes = await response.json();
  return dataRes;
};

export const PostData = async ({ url, token, data }) => {
  const fullUrl = `${productionUrl}/${url}`;
  const response = await fetch(fullUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const dataRes = await response.json();
  return dataRes;
};

export const PutData = async ({ url, token, data, id }) => {
  const fullUrl = `${productionUrl}/${url}/${id}`;
  const response = await fetch(fullUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const dataRes = await response.json();
  return dataRes;
};

export const DeleteData = async ({ url, token, id }) => {
  const fullUrl = `${productionUrl}/${url}/${id}`;
  const response = await fetch(fullUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const dataRes = await response.json();
  return dataRes;
};