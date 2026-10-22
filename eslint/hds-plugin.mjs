// eslint-plugin-hds (local) — AGENTS.md의 절대 규칙을 기계로 강제한다.
//
//  hds/no-raw-color       원시 hex · rgb() · hsl() · 색 이름 금지 (style · className 문자열 · CSS-in-JS). 토큰 var(--hds-*)만.
//  hds/no-raw-font-size   style={{ fontSize: 14 }}처럼 글자 크기를 수치로 적지 않는다. 타이포 토큰만.
//  hds/no-native-ui       HDS에 있는 UI를 HTML 요소로 흉내 내지 않는다. <button> <input> <select> <textarea> <dialog> <table> <progress>
//                         꼭 필요하면 루트에 data-hds="custom" + data-hds-reason="…"을 붙인다(규칙 4). 마커가 있으면 통과.
//  hds/no-external-ui     HDS 외 UI 라이브러리 import 금지 (@mui, antd, @chakra-ui, @radix-ui, @headlessui, react-icons, lucide-react …).
//  hds/custom-needs-reason data-hds="custom"에는 data-hds-reason이 꼭 같이 온다.
//
// 모든 규칙은 src/ 안에서만 돈다. 마커가 붙은 커스텀은 `npm run hds:report`가 모아 디자인시스템 백로그로 올린다.

const NATIVE_UI = new Set(['button', 'input', 'select', 'textarea', 'dialog', 'table', 'progress', 'meter', 'details']);
const EXTERNAL_UI = /^(@mui\/|antd$|@ant-design\/|@chakra-ui\/|@radix-ui\/|@headlessui\/|react-icons|lucide-react|@heroicons\/|react-bootstrap|@mantine\/|primereact|@nextui-org\/|@shadcn|daisyui|flowbite)/;
const RAW_COLOR = /#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})\b|\b(?:rgba?|hsla?)\(/i;
const NAMED_COLOR = /^(white|black|red|blue|green|gray|grey|yellow|orange|purple|pink|transparent)$/i;
const COLOR_PROPS = new Set(['color', 'background', 'backgroundColor', 'borderColor', 'border', 'outline', 'outlineColor', 'fill', 'stroke', 'boxShadow', 'textDecorationColor', 'caretColor']);
const FONT_SIZE_PROPS = new Set(['fontSize', 'font', 'lineHeight', 'letterSpacing']);

const hasAttr = (node, name) => node.attributes.some((a) => a.type === 'JSXAttribute' && a.name?.name === name);
const attrValue = (node, name) => {
  const a = node.attributes.find((a) => a.type === 'JSXAttribute' && a.name?.name === name);
  if (!a || !a.value) return undefined;
  if (a.value.type === 'Literal') return a.value.value;
  if (a.value.type === 'JSXExpressionContainer' && a.value.expression.type === 'Literal') return a.value.expression.value;
  return '<expr>';
};
const isCustomMarked = (node) => attrValue(node, 'data-hds') === 'custom';

const noRawColor = {
  meta: { type: 'problem', docs: { description: 'HDS 토큰 대신 원시 색을 쓰지 않는다' }, messages: { raw: '원시 색 `{{v}}` 금지 — var(--hds-bg-*/--hds-fg-*/--hds-stroke-*) 토큰을 쓴다 (AGENTS.md 규칙 2)' } },
  create(ctx) {
    const check = (node, text) => {
      if (typeof text !== 'string') return;
      if (RAW_COLOR.test(text) || NAMED_COLOR.test(text.trim())) ctx.report({ node, messageId: 'raw', data: { v: text.length > 40 ? text.slice(0, 40) + '…' : text } });
    };
    return {
      Property(node) {
        const key = node.key.type === 'Identifier' ? node.key.name : node.key.value;
        if (!COLOR_PROPS.has(key)) return;
        if (node.value.type === 'Literal') check(node.value, String(node.value.value));
        if (node.value.type === 'TemplateLiteral') check(node.value, node.value.quasis.map((q) => q.value.raw).join(''));
      },
      TemplateLiteral(node) {
        // styled/css`` 블록 · 인라인 <style> 문자열
        const raw = node.quasis.map((q) => q.value.raw).join('');
        if (/\b(color|background|border|fill|stroke|shadow)\b[^;]*?(#[0-9a-f]{3,8}\b|\b(rgba?|hsla?)\()/i.test(raw)) check(node, raw.match(/#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?)\([^)]*\)/i)?.[0] ?? raw);
      },
    };
  },
};

const noRawFontSize = {
  meta: { type: 'problem', docs: { description: '글자 크기를 수치로 적지 않는다' }, messages: { raw: '`{{k}}: {{v}}` 금지 — 타이포 토큰(var(--hds-body-md-size) 등)을 쓴다 (AGENTS.md 규칙 2)' } },
  create(ctx) {
    return {
      Property(node) {
        const key = node.key.type === 'Identifier' ? node.key.name : node.key.value;
        if (!FONT_SIZE_PROPS.has(key)) return;
        const v = node.value;
        if (v.type === 'Literal' && (typeof v.value === 'number' || /^\d+(\.\d+)?(px|rem|em|pt)?$/.test(String(v.value)))) ctx.report({ node, messageId: 'raw', data: { k: key, v: String(v.value) } });
      },
    };
  },
};

const noNativeUi = {
  meta: { type: 'problem', docs: { description: 'HDS 컴포넌트가 있는 UI를 HTML로 흉내 내지 않는다' }, messages: { native: '`<{{tag}}>` 직접 사용 금지 — HDS 컴포넌트({{alt}})를 쓴다. 정말 필요하면 data-hds="custom" data-hds-reason="…"을 붙인다 (AGENTS.md 규칙 1 · 4)' } },
  create(ctx) {
    const ALT = { button: 'Button · IconButton · FieldButton', input: 'TextInput · Search · Checkbox · Radio · ToggleSwitch · Slider', select: 'Select', textarea: 'TextInput(multiline)', dialog: 'Dialog · AlertDialog · BottomSheet', table: 'Table', progress: 'ProgressCircle · Skeleton', meter: 'ProgressCircle', details: 'Accordion' };
    return {
      JSXOpeningElement(node) {
        if (node.name.type !== 'JSXIdentifier') return;
        const tag = node.name.name;
        if (!NATIVE_UI.has(tag)) return;
        if (isCustomMarked(node)) return;
        // <input type="hidden"> 는 UI가 아니다
        if (tag === 'input' && attrValue(node, 'type') === 'hidden') return;
        ctx.report({ node, messageId: 'native', data: { tag, alt: ALT[tag] } });
      },
    };
  },
};

const noExternalUi = {
  meta: { type: 'problem', docs: { description: 'HDS 외 UI 라이브러리를 들이지 않는다' }, messages: { ext: '`{{m}}` import 금지 — UI는 @aliceblue567/hds-react만 쓴다. 아이콘도 HDS Foundation 아이콘(427개)만 (AGENTS.md 규칙 1 · 3)' } },
  create(ctx) {
    return {
      ImportDeclaration(node) {
        const m = node.source.value;
        if (typeof m === 'string' && EXTERNAL_UI.test(m)) ctx.report({ node, messageId: 'ext', data: { m } });
      },
    };
  },
};

const customNeedsReason = {
  meta: { type: 'problem', docs: { description: 'data-hds="custom"에는 이유가 있어야 한다' }, messages: { reason: 'data-hds="custom"에는 data-hds-reason="왜 HDS로 안 되는지"를 함께 적는다 (AGENTS.md 규칙 4)' } },
  create(ctx) {
    return {
      JSXOpeningElement(node) {
        if (!isCustomMarked(node)) return;
        const r = attrValue(node, 'data-hds-reason');
        if (!r || (typeof r === 'string' && r.trim().length < 4)) ctx.report({ node, messageId: 'reason' });
      },
    };
  },
};

const plugin = {
  meta: { name: 'eslint-plugin-hds', version: '0.1.0' },
  rules: {
    'no-raw-color': noRawColor,
    'no-raw-font-size': noRawFontSize,
    'no-native-ui': noNativeUi,
    'no-external-ui': noExternalUi,
    'custom-needs-reason': customNeedsReason,
  },
};
export default plugin;
