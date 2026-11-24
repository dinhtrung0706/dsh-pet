/**
 * 表情包文件名的语言变体：菜单语言为 vi 时优先 `<名>.vi.png`，其余语言用 `<名>.png`。
 * 只拼名字、不查盘；`.vi.png` 缺失时由宿主 `/pic/memes` 路由回退到基础图。
 */
import { getMenuLocale } from './menu/i18n.ts';

/**
 * 配置里的表情包键 → 当前语言应请求的文件名主干（不含扩展名）。
 *
 * @param name - 配置 `memes` 的键（= 基础图文件名去扩展名）。
 * @returns vi 语言下追加 `.vi`，其余语言原样返回。
 */
export function localizedMemeStem(name: string): string {
  return getMenuLocale() === 'vi' ? name + '.vi' : name;
}
