import React from 'react'
import PostDetail from '../components/PostDetail';
import { useParams } from 'react-router-dom';

const PostPage = () => {

  const { id } = useParams<{ id: string }>();
  return (
    <div>
      <PostDetail postId={Number(id)} />
    </div>
  )
}

export default PostPage
