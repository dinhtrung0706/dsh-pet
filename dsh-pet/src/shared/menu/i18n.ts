/**
 * 右键菜单轻量 i18n：两端共用同一套字典，默认显示越南语（vi）。
 *
 * 仅负责菜单文案翻译；设置页走独立的 `client/settings/locales` 字典，不在此处覆盖。
 * 它同时是表情包语言变体的语言源：`shared/meme-locale` 按当前值决定是否请求 `.vi.png`。
 * @module dsh-pet/src/shared/menu/i18n
 */

export type MenuLocale = 'zh-CN' | 'vi';

let currentLocale: MenuLocale = 'vi';

/** 切换菜单语言；默认 'vi'。供宿主/设置页在以后接入语言选择器时调用。 */
export function setMenuLocale(locale: MenuLocale): void {
  currentLocale = locale;
}

export function getMenuLocale(): MenuLocale {
  return currentLocale;
}

/** 翻译键 → 文案。缺键时回退中文，再回退键名本身。 */
export function t(key: string): string {
  const dict = DICTS[currentLocale];
  const translated = dict?.[key];
  if (translated !== undefined) return translated;
  return DICTS['zh-CN'][key] ?? key;
}

/** 越南语字典（默认语言）。 */
const VI: Record<string, string> = {
  'menu.display': 'Vị trí hiển thị',
  'display.web': 'Chỉ trên web',
  'display.desktop': 'Chỉ trên App',
  'display.both': 'Cả hai',
  'display.none': 'Không hiển thị',
  'menu.more': 'Thêm',
  'menu.actions': 'Hành động',
  'group.idle': 'Chờ cast',
  'group.turn': 'Quay hướng',
  'group.drag': 'Kéo thả',
  'group.clicks': 'Phản hồi nhấp',
  'group.moves': 'Di chuyển',
  'event.balance': 'Số dư',
  'event.whisper': 'Thì thầm',
  'event.workStatus': 'Trạng thái làm việc',
  'meme.branch': 'Hình minh họa',
  'meme.chat': 'Hình minh họa trong cuộc trò chuyện',
  'meme.other': 'Khác',
  'tool.balance': 'Xem số dư',
  'tool.environment': 'Tra cứu thời tiết',
  'tool.todo': 'Công việc cần làm',
  'tool.whisper': 'Thì thầm',
  'tool.chat': 'Cuộc trò chuyện',
  'tool.sleep': 'Ngủ',
  'tool.wake': 'Dậy',
  'tool.home': 'Trở về chỗ ban đầu',
  'tool.reload': 'Tải lại cấu hình',
  'open.desktop': 'Mở phần mềm',
  'open.standalone': 'Mở cài đặt AI',
  'open.web': 'Mở trang web',
  // 余额气泡文案（点「查看余额」后显示）
  'balance.unsupported': 'Cái này lạ quá hong xem được số dư',
  'balance.provider': 'Dịch vụ hiện tại: ',
  'balance.no-credential': 'Thiếu thông tin xác thực tra cứu số dư',
  'balance.failed': 'Tra cứu số dư thất bại',
  'balance.label': 'Số dư',
  'balance.open-paren': ' (',
  'balance.close-paren': ') ',
  'tier.peak': 'Đắt time',
  'tier.valley': 'Rẻ time',
  'window.weekly': 'Tuần',
  'window.monthly': 'Tháng',
  'window.rolling-default': '5h',
  'window.reset-done': 'Đã đặt lại',
  'window.reset-day': ' ngày',
  'window.reset-hour': ' giờ',
  'window.reset-unknown': 'Không rõ thời gian đặt lại',
  'window.reset-phrase': ' đặt lại',
  'window.no-data': 'Dữ liệu hạn mức không khả dụng',
  'window.used': ' hạn mức đã dùng ',
  'token.in': ' vào',
  'token.out': ' ra',
  'token.period': 'Kỳ này ',
  'token.times': ' lần',
  'points.no-data': 'Dữ liệu điểm không khả dụng',
  'points.label': 'Số dư',
};

/** 中文字典（回退）。 */
const ZH: Record<string, string> = {
  'menu.display': '显示位置',
  'display.web': '仅网页',
  'display.desktop': '仅桌面',
  'display.both': '两者',
  'display.none': '都不',
  'menu.more': '更多',
  'menu.actions': '动作',
  'group.idle': '待机',
  'group.turn': '转向',
  'group.drag': '拖拽',
  'group.clicks': '点击回应',
  'group.moves': '移动',
  'event.balance': '余额档位',
  'event.whisper': '碎碎念',
  'event.workStatus': '工作状态',
  'meme.branch': '配图',
  'meme.chat': '纳入对话的配图',
  'meme.other': '其他',
  'tool.balance': '查看余额',
  'tool.environment': '查询天气',
  'tool.todo': '待办事项',
  'tool.whisper': '碎碎念',
  'tool.chat': '对话',
  'tool.sleep': '睡觉',
  'tool.wake': '起来',
  'tool.home': '回到初始位置',
  'tool.reload': '重载配置',
  'open.desktop': '打开软件',
  'open.standalone': '打开 AI 设置',
  'open.web': '打开网站',
  // 余额气泡文案（点「查看余额」后显示）
  'balance.unsupported': '当前服务商暂不支持余额查询',
  'balance.provider': '当前服务商：',
  'balance.no-credential': '缺少余额查询凭证',
  'balance.failed': '余额查询失败',
  'balance.label': '余额',
  'balance.open-paren': '（',
  'balance.close-paren': '）',
  'tier.peak': '峰',
  'tier.valley': '谷',
  'window.weekly': '周',
  'window.monthly': '月',
  'window.rolling-default': '5h',
  'window.reset-done': '已重置',
  'window.reset-day': ' 天',
  'window.reset-hour': ' 小时',
  'window.reset-unknown': '重置时间未知',
  'window.reset-phrase': '重置',
  'window.no-data': '额度数据不可用',
  'window.used': '额度已用 ',
  'token.in': ' 入',
  'token.out': ' 出',
  'token.period': '本期 ',
  'token.times': ' 次',
  'points.no-data': '积分数据不可用',
  'points.label': '余额',
};

const DICTS: Record<MenuLocale, Record<string, string>> = {
  'zh-CN': ZH,
  vi: VI,
};
