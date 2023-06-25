import { memo } from 'react';
import Stack from 'react-bootstrap/Stack';
import Image from 'react-bootstrap/Image';
import { Link } from 'react-router-dom';
import TimeAgo from './TimeAgo';
import { PostSchema } from '../Schemas';

type PostProps = {
    post: PostSchema;
}

export default memo(function Post({ post }: PostProps) {
  return (
    <Stack direction="horizontal" gap={3} className="Post">
      <Image src={post.author.avatar_url + '&s=48'}
             alt={post.author.username} roundedCircle />
      <div>
        <p>
          <Link to={'/user/' + post.author.username}>
            {post.author.username}
          </Link>
          &nbsp;&mdash;&nbsp;
          <TimeAgo isoDate={post.timestamp} />:
        </p>
        <p>{post.text}</p>
      </div>
    </Stack>
  );
});