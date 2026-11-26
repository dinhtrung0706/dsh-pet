import { useState, useEffect, useRef, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { jsx } from 'react/jsx-runtime';
import { makePetConfigSection, petBridge, en, zh } from '../../src/client/settings.ts';

petBridge.current = window.initialConfig.main.pets;
petBridge.template = petBridge.current[0];
const dictionary = new URLSearchParams(location.search).get('lang') === 'zh' ? zh : en;
const Section = makePetConfigSection(
  {
    h: jsx,
    useState,
    useEffect,
    useRef,
    useCallback,
    t: (key) => dictionary[key] ?? key,
  },
  // 快捷键服务缺席的最小上下文：卡片退回默认键帽，不依赖宿主。
  { get: () => undefined },
);
createRoot(document.getElementById('root')).render(jsx(Section, {}));
