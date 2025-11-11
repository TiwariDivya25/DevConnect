import React from 'react'
import PostList from '../components/PostList';

const Home = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold mt-6 mb-6 flex items-center justify-center">Recent Posts</h2>
      <PostList />
    </div>
  )
}

export default Home
