const users = [{
  id: '1',
  name: 'Kamran',
  email: 'kamran@example.com',
  age: 30
}, {
  id: '2',
  name: 'Sarah',
  email: 'sarah@example.com'
}, {
  id: '3',
  name: 'Mike',
  email: 'mike@example.com'
}
]

const posts = [{
  id: '10',
  title: 'title1',
  body: 'body1',
  published: true,
  author: '1'
}, {
  id: '11',
  title: 'title2',
  body: 'body2',
  published: true,
  author: '1'
}, {
  id: '12',
  title: 'title3',
  body: 'body3',
  published: true,
  author: '2'
}]

const comments = [{
  id: '102',
  text: 'text2',
  author: '3',
  post: '10'
}, {
  id: '103',
  text: 'text3',
  author: '1',
  post: '10'
}, {
  id: '104',
  text: 'text4',
  author: '2',
  post: '11'
}, {
  id: '105',
  text: 'text5',
  author: '1',
  post: '12'
}]

const db = {
  users,
  posts,
  comments
}

export { db as default }