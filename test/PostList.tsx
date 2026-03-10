
export default function PostList({ posts }: { posts: any[] }) {
  return <ul>{posts.map(p => <li>{p.title}</li>)}</ul>
}