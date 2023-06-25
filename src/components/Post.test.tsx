import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Post from './Post';

test('it renders all the components of the post', () => {
  const timestampUTC = '2020-01-01T00:00:00.000Z';
  const post = {
    id: 1,
    url: 'https://example.com/post/1',
    text: 'hello',
    author: {
        id: 2,
        url: 'https://example.com/user/2',
        username: 'susan',
        email: 'susan@example.com',
        avatar_url: 'https://example.com/avatar/susan',
        has_password: true,
        about_me: 'I am Susan',
        first_seen: 'today',
        last_seen: 'today',
        posts_url: 'https://example.com/user/2/posts',
    },
    timestamp: timestampUTC,
  };

  render(
    <BrowserRouter>
      <Post post={post} />
    </BrowserRouter>
  );

  const message = screen.getByText('hello');
  const authorLink = screen.getByText('susan');
  const avatar = screen.getByAltText('susan');
  const timestamp = screen.getByText(/.* ago$/);

  expect(message).toBeInTheDocument();
  expect(authorLink).toBeInTheDocument();
  expect(authorLink).toHaveAttribute('href', '/user/susan');
  expect(avatar).toBeInTheDocument();
  expect(avatar).toHaveAttribute('src', 'https://example.com/avatar/susan&s=48');
  expect(timestamp).toBeInTheDocument();
  expect(timestamp).toHaveAttribute(
    'title', new Date(Date.parse(timestampUTC)).toString());
});