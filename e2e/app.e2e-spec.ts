import { YorkeCao.Github.IoPage } from './app.po';

describe('yorke-cao.github.io App', () => {
  let page: YorkeCao.Github.IoPage;

  beforeEach(() => {
    page = new YorkeCao.Github.IoPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
