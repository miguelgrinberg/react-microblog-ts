import { useState, useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { useApi } from '../contexts/ApiProvider';
import Write from './Write';
import Post from './Post';
import More from './More';
import { Pagination, Paginated, PostSchema } from '../Schemas';

type PostsProps = {
    content?: string;
    write?: boolean;
}

export default function Posts({ content, write }: PostsProps) {
  const [posts, setPosts] = useState<Array<PostSchema> | null | undefined>();

  const [pagination, setPagination] = useState<Pagination | undefined>();
  const api = useApi();

  let url = '';
  switch (content) {
    case 'feed':
    case undefined:
      url = '/feed';
      break;
    case 'explore':
      url = '/posts';
      break
    default:
      url = `/users/${content}/posts`;
      break;
  }

  useEffect(() => {
    (async () => {
      const response = await api.get<Paginated<PostSchema>>(url);
      if (response.ok && response.body) {
        setPosts(response.body.data);
        setPagination(response.body.pagination);
      }
      else {
        setPosts(null);
      }
    })();
  }, [api, url]);

  const loadNextPage = async () => {
    const oldPosts = posts || [];
    const response = await api.get<Paginated<PostSchema>>(url, {
      after: oldPosts[oldPosts.length - 1].timestamp
    });
    if (response.ok && response.body) {
      setPosts([...oldPosts, ...response.body.data]);
      setPagination(response.body.pagination);
    }
  };

  const showPost = (newPost: PostSchema) => {
    const oldPosts = posts || [];
    setPosts([newPost, ...oldPosts]);
  };

  return (
    <>
      {write && <Write showPost={showPost} />}
      {posts === undefined ?
        <Spinner animation="border" />
      :
        <>
          {posts === null ?
            <p>Could not retrieve blog posts.</p>
          :
            <>
              {posts.length === 0 ?
                <p>There are no blog posts.</p>
              :
                posts.map(post => <Post key={post.id} post={post} />)
              }
            </>
          }
        </>
      }
      {pagination && <More pagination={pagination} loadNextPage={loadNextPage} />}
    </>
  );
}