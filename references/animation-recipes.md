# Animation Recipes 动画食谱 | Ready-to-Use GSAP Patterns

> Agent 写 HTML 时直接复制下面的代码块，替换选择器即可。

---

## 📝 文字动画 | Text Animations

### 逐字弹出（适合标题）
```js
// 每个字符依次弹入
gsap.from(".title-char", {
  scale: 0, opacity: 0, duration: 0.3,
  stagger: 0.04, ease: "back.out(2)"
});
```
```html
<!-- 需要把文字拆成 <span class="title-char"> -->
<h1>
  <span class="title-char">N</span><span class="title-char">V</span><span class="title-char">I</span><span class="title-char">D</span><span class="title-char">I</span><span class="title-char">A</span>
</h1>
```

### 打字机效果
```js
// 数字从0跳到目标值
gsap.from(".counter", {
  textContent: 0, duration: 2,
  snap: { textContent: 1 },
  ease: "power1.inOut"
});
```

### 高亮划入（下划线从左到右）
```css
.underline-reveal { position: relative; }
.underline-reveal::after {
  content: ""; position: absolute; bottom: -4px; left: 0;
  width: 100%; height: 3px; background: var(--nv-green);
  transform: scaleX(0); transform-origin: left;
}
```
```js
gsap.to(".underline-reveal::after", { scaleX: 1, duration: 0.6, ease: "power2.out" });
```

---

## 🎯 入场动画 | Entrance Animations

### 缩放弹入
```js
gsap.from(".element", {
  scale: 0, duration: 0.6,
  ease: "back.out(2)"
});
```

### 底部滑入
```js
gsap.from(".element", {
  y: 60, opacity: 0, duration: 0.5,
  ease: "power3.out"
});
```

### 旋转入场
```js
gsap.from(".element", {
  rotation: -10, scale: 0.8, opacity: 0,
  duration: 0.6, ease: "back.out(1.5)"
});
```

### 模糊渐清
```js
gsap.from(".element", {
  filter: "blur(10px)", opacity: 0,
  duration: 0.8, ease: "power2.out"
});
```

### 卡片依次弹出（stagger）
```js
gsap.from(".card", {
  y: 50, scale: 0.9, opacity: 0,
  duration: 0.5, stagger: 0.15,
  ease: "back.out(2)"
});
```

### 从屏幕外飞入
```js
// 左飞入
gsap.from(".slide-left", { x: -200, opacity: 0, duration: 0.6, ease: "power3.out" });
// 右飞入
gsap.from(".slide-right", { x: 200, opacity: 0, duration: 0.6, ease: "power3.out" });
// 顶部掉落
gsap.from(".drop", { y: -100, opacity: 0, duration: 0.7, ease: "bounce.out" });
```

---

## 💥 强调动画 | Emphasis Animations

### 脉冲（呼吸效果）
```js
gsap.to(".pulse", {
  scale: 1.05, duration: 0.8,
  repeat: -1, yoyo: true, ease: "sine.inOut"
});
```

### 震动
```js
gsap.to(".shake", {
  x: "+=5", duration: 0.05,
  repeat: 5, yoyo: true, ease: "power1.inOut"
});
```

### 发光闪烁
```js
gsap.to(".glow-pulse", {
  boxShadow: "0 0 40px var(--green), 0 0 80px var(--green)",
  duration: 0.8, repeat: -1, yoyo: true, ease: "sine.inOut"
});
```

### 数字跳动（适合展示数据）
```js
gsap.from(".big-number", {
  scale: 4, opacity: 0, duration: 0.8,
  ease: "back.out(3)"
});
// 再缩回正常大小
gsap.to(".big-number", {
  scale: 1, duration: 0.4, delay: 0.8,
  ease: "power2.out"
});
```

---

## 🔄 持续动画 | Continuous Animations

### 浮动
```js
gsap.to(".float", {
  y: -15, duration: 2,
  repeat: -1, yoyo: true, ease: "sine.inOut"
});
```

### 旋转
```js
gsap.to(".spin", {
  rotation: 360, duration: 20,
  repeat: -1, ease: "none"
});
```

### 粒子（散开消失）
```js
// 在场景中生成多个粒子
for (let i = 0; i < 20; i++) {
  const p = document.createElement("div");
  p.className = "particle";
  p.style.cssText = `
    position:absolute; width:4px; height:4px; border-radius:50%;
    background:var(--green); left:${Math.random()*1920}px; top:${Math.random()*1080}px;
  `;
  document.querySelector("#scene").appendChild(p);
  tl.from(p, { opacity:0, scale:0, duration:0.3 }, startTime + Math.random()*2);
  tl.to(p, { opacity:0, y:-200, x:(Math.random()-0.5)*300, duration:3, ease:"power2.out" }, startTime + Math.random()*2);
}
```

---

## 🎬 场景转场 | Scene Transitions

### 标准淡入淡出
```js
tl.from("#sN", { opacity: 0, duration: 0.3 }, startTime);
tl.set("#sN-1", { visibility: "hidden" }, startTime);
```

### 缩放转场
```js
tl.from("#sN", { scale: 1.1, opacity: 0, duration: 0.4 }, startTime);
tl.set("#sN-1", { visibility: "hidden" }, startTime);
```

### 滑动转场
```js
tl.from("#sN", { x: 100, opacity: 0, duration: 0.5, ease: "power3.out" }, startTime);
tl.to("#sN-1", { x: -100, opacity: 0, duration: 0.3 }, startTime - 0.3);
tl.set("#sN-1", { visibility: "hidden" }, startTime);
```

### 模糊转场
```js
tl.from("#sN", { filter: "blur(20px)", opacity: 0, duration: 0.5 }, startTime);
tl.set("#sN-1", { visibility: "hidden" }, startTime);
```

---

## 🧩 组合技 | Combo Patterns

### 标题+副标题+标签依次出场
```js
tl.from(".title", { y:30, opacity:0, duration:0.5 }, sceneStart);
tl.from(".subtitle", { y:20, opacity:0, duration:0.4 }, sceneStart+0.4);
tl.from(".tag", { scale:0, opacity:0, duration:0.3, stagger:0.1, ease:"back.out(2)" }, sceneStart+0.7);
```

### 图片+文字左右分入
```js
tl.from(".left-content", { x:-80, opacity:0, duration:0.6 }, sceneStart);
tl.from(".right-content", { x:80, opacity:0, duration:0.6 }, sceneStart+0.2);
```

### 数据卡片计数动画
```js
tl.from(".stat-card", { y:40, scale:0.9, opacity:0, duration:0.5, stagger:0.2 }, sceneStart+0.5);
tl.from(".stat-card .number", { textContent:0, duration:1.5, snap:{textContent:1} }, sceneStart+0.8);
```
