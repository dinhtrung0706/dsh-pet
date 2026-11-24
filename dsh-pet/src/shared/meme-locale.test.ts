/**
 * 表情包文件名本地化（src/shared/meme-locale.ts）的契约测试：
 * 默认菜单语言 vi 追加 `.vi`，zh-CN 用基础名；后缀只加在文件名主干上，编码交给各 URL 构造器。
 */
import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { localizedMemeStem } from './meme-locale.ts';
import { setMenuLocale } from './menu/i18n.ts';

afterEach(() => setMenuLocale('vi'));

describe('localizedMemeStem —— 按菜单语言选文件名', () => {
  test('默认 vi：名称追加 .vi 后缀', () => {
    setMenuLocale('vi');
    assert.equal(localizedMemeStem('可爱'), '可爱.vi');
  });

  test('zh-CN：用基础图名，不追加后缀', () => {
    setMenuLocale('zh-CN');
    assert.equal(localizedMemeStem('可爱'), '可爱');
  });

  test('名称里的点与空格原样保留（只追加后缀，不做编码）', () => {
    setMenuLocale('vi');
    assert.equal(localizedMemeStem('大的 要来啦.v2'), '大的 要来啦.v2.vi');
  });
});
