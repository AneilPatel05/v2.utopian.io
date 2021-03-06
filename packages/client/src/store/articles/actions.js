import API from 'src/plugins/api'

export const saveArticle = async (context, data) => {
  return API.call({
    context,
    method: 'post',
    url: '/v1/article',
    data
  })
}

export const updateArticle = async (context, article) => {
  const { _id, ...data } = article
  return API.call({
    context,
    method: 'post',
    url: `/v1/article/${_id}`,
    data
  })
}

export const fetchArticle = async (context, { author, slug }) => {
  return API.call({
    context,
    method: 'get',
    url: `/v1/article/${author}/${slug}`
  })
}
