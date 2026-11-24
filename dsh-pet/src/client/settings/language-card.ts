/**
 * 菜单语言选择卡：切换右键菜单的显示语言（vi / zh-CN）。
 * 同时决定表情包配图优先取 `.vi.png` 变体还是基础图；只改本地内存状态，不随「保存」写盘——重刷页面后恢复默认 vi。
 * @module dsh-pet/src/client/settings/language-card
 */
import type { FunctionComponent } from 'react';
import type { SettingsRuntime } from './runtime.ts';
import { makeUiKit } from './ui.ts';
import { setMenuLocale, getMenuLocale, type MenuLocale } from '../../shared/menu.ts';

/** 可选语言：值 → 显示名。 */
const LANGUAGES: Array<{ value: MenuLocale; label: string }> = [
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'zh-CN', label: '中文（简体）' },
];

/** 菜单语言卡的输入。 */
export interface LanguageCardProps {
  /** 保存中或配置未就绪时禁用。 */
  busy: boolean;
}

/** 造菜单语言选择卡。 */
export function makeLanguageCard(rt: SettingsRuntime): FunctionComponent<LanguageCardProps> {
  const { h, useState, t } = rt;
  const { field } = makeUiKit({ h, t });

  return function LanguageCard(props: LanguageCardProps) {
    const [locale, setLocale] = useState<MenuLocale>(getMenuLocale());

    const onChange = (e: Event): void => {
      const target = e.target as HTMLSelectElement;
      const next = target.value as MenuLocale;
      setMenuLocale(next);
      setLocale(next);
    };

    return h('div', {
      className: 'dsh-pet-cfg__card',
      children: [
        h('div', {
          className: 'dsh-pet-cfg__cardHead',
          children: [h('span', { className: 'dsh-pet-cfg__cardTitle', children: 'Ngôn ngữ菜单' })],
        }),
        field(
          'Menu language',
          h('select', {
            className: 'dsh-pet-cfg__inp',
            disabled: props.busy,
            value: locale,
            onChange,
            children: LANGUAGES.map((lang) => h('option', { value: lang.value, children: lang.label })),
          }),
          'Chọn ngôn ngữ hiển thị cho menu chuột phải và ảnh meme (không ảnh hưởng trang cài đặt).',
        ),
      ],
    });
  };
}
