import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { useState, useEffect } from 'react';
import FlashProvider from './FlashProvider';
import ApiProvider from './ApiProvider';
import UserProvider from './UserProvider';
import { useUser } from './UserProvider';

const realFetch = global.fetch;

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  global.fetch = realFetch;
  localStorage.clear();
});

test('logs user in', async () => {
  const urls: string[] = [];

  const mockedFetch = global.fetch as jest.MockedFunction<typeof realFetch>;
  mockedFetch
    .mockImplementationOnce(url => {
      urls.push(url.toString());
      return Promise.resolve({
        status: 200,
        ok: true,
        json: () => Promise.resolve({access_token: '123'}),
      } as Response);
    })
    .mockImplementationOnce(url => {
      urls.push(url.toString());
      return Promise.resolve({
        status: 200,
        ok: true,
        json: () => Promise.resolve({username: 'susan'}),
      } as Response);
    });

  const Test = () => {
    const { login, user } = useUser();
    useEffect(() => {
      (async () => await login('username', 'password'))();
    }, [login]);
    return user ? <p>{user.username}</p> : null;
  };

  render(
    <FlashProvider>
      <ApiProvider>
        <UserProvider>
          <Test />
        </UserProvider>
      </ApiProvider>
    </FlashProvider>
  );

  const element = await screen.findByText('susan');
  expect(element).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledTimes(2);
  expect(urls).toHaveLength(2);
  expect(urls[0]).toMatch(/^http.*\/api\/tokens$/);
  expect(urls[1]).toMatch(/^http.*\/api\/me$/);
});

test('logs user in with bad credentials', async () => {
  const urls: string[] = [];

  const mockedFetch = global.fetch as jest.MockedFunction<typeof realFetch>;
  mockedFetch
    .mockImplementationOnce(url => {
      urls.push(url.toString());
      return Promise.resolve({
        status: 401,
        ok: false,
        json: () => Promise.resolve({}),
      } as Response);
    });

  const Test = () => {
    const [result, setResult] = useState<'ok' | 'error' | 'fail' | null>(null);
    const { login, user } = useUser();
    useEffect(() => {
      (async () => {
        setResult(await login('username', 'password'));
      })();
    }, [login]);
    return <>{result}</>;
  };

  render(
    <FlashProvider>
      <ApiProvider>
        <UserProvider>
          <Test />
        </UserProvider>
      </ApiProvider>
    </FlashProvider>
  );

  const element = await screen.findByText('fail');
  expect(element).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(urls).toHaveLength(1);
  expect(urls[0]).toMatch(/^http.*\/api\/tokens$/);
});

test('logs user out', async () => {
  const mockedFetch = global.fetch as jest.MockedFunction<typeof realFetch>;
  mockedFetch
    .mockImplementationOnce(url => {
      return Promise.resolve({
        status: 200,
        ok: true,
        json: () => Promise.resolve({username: 'susan'}),
      } as Response);
    })
    .mockImplementationOnce(url => {
      return Promise.resolve({
        status: 204,
        ok: true,
        json: () => Promise.resolve({}),
      } as Response);
    });

  localStorage.setItem('accessToken', '123');

  const Test = () => {
    const { user, logout } = useUser();
    if (user) {
      return (
        <>
          <p>{user.username}</p>
          <button onClick={logout}>logout</button>
        </>
      );
    }
    else if (user === null) {
      return <p>logged out</p>;
    }
    else {
      return null;
    }
  };

  render(
    <FlashProvider>
      <ApiProvider>
        <UserProvider>
          <Test />
        </UserProvider>
      </ApiProvider>
    </FlashProvider>
  );

  const element = await screen.findByText('susan');
  const button = await screen.findByRole('button');
  expect(element).toBeInTheDocument();
  expect(button).toBeInTheDocument();

  userEvent.click(button);
  const element2 = await screen.findByText('logged out');
  expect(element2).toBeInTheDocument();
  expect(localStorage.getItem('accessToken')).toBeNull();
});