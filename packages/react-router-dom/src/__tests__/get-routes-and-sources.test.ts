import { sync } from 'fast-glob';
import { getRoutesAndSources } from '../get-routes-and-sources';
import { fastGlobReturnStub } from '../__stubs__/fastGlob';

const syncMock = sync as unknown as jest.Mock<typeof sync>;

jest.mock('fast-glob', () => ({
  sync: jest.fn(),
}));

describe('does something', () => {
  it('does something', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    syncMock.mockReturnValue(fastGlobReturnStub as any);

    expect(
      getRoutesAndSources({
        originFile: 'react-file-based-routing/src/index.ts',
        relativeTargetLocation: './pages',
      })
    ).toEqual([
      {
        routerPath: '',
        importSpecifierName: 'RFBR_pages_index',
        targetRelativeToSource: './pages/index.tsx',
      },
      {
        routerPath: 'contact',
        importSpecifierName: 'RFBR_pages_contact',
        targetRelativeToSource: './pages/contact.tsx',
      },
      {
        routerPath: 'home',
        importSpecifierName: 'RFBR_pages_home',
        targetRelativeToSource: './pages/home.jsx',
      },
      {
        routerPath: 'some/nested',
        importSpecifierName: 'RFBR_pages_some_nested_index',
        targetRelativeToSource: './pages/some/nested/index.tsx',
      },
      {
        routerPath: 'some/deeper/nested/file',
        importSpecifierName: 'RFBR_pages_some_deeper_nested_file',
        targetRelativeToSource: './pages/some/deeper/nested/file.tsx',
      },
      {
        routerPath: 'blog/:slug',
        importSpecifierName: 'RFBR_pages_blog_slug',
        targetRelativeToSource: './pages/blog/[slug].tsx',
      },
      {
        routerPath: 'blog/:slug/:author/:profile',
        importSpecifierName: 'RFBR_pages_blog_slug_author_profile',
        targetRelativeToSource: './pages/blog/[slug]/[author]/[profile].tsx',
      },
      {
        routerPath: 'blog/:username/settings',
        importSpecifierName: 'RFBR_pages_blog_username_settings',
        targetRelativeToSource: './pages/blog/[username]/settings.tsx',
      },
      {
        routerPath: 'post/*',
        importSpecifierName: 'RFBR_pages_post_all',
        targetRelativeToSource: './pages/post/[...all].tsx',
      },
      {
        routerPath: 'page',
        importSpecifierName: 'RFBR_pages_with_dash_page',
        targetRelativeToSource: './pages-with-dash/page.js',
      },
    ]);
  });
});
