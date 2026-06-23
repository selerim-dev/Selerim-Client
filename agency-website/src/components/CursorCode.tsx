'use client';

import React, { useEffect, useRef } from 'react';

const K = (s: string) => <span className="tok-key">{s}</span>;
const S = (s: string) => <span className="tok-str">{s}</span>;
const F = (s: string) => <span className="tok-fn">{s}</span>;
const C = (s: string) => <span className="tok-com">{s}</span>;

function CodeBlock() {
  return (
    <>
      {C('// selerim/core · ship.ts')}{'\n'}
      {K('export async function')} {F('deploy')}(model: Model): {K('Promise')}&lt;Release&gt; {'{'}{'\n'}
      {'  '}{K('const')} build = {K('await')} {F('compile')}(model, {'{'} target: {S("'production'")} {'}'});{'\n'}
      {'  '}{K('if')} (!build.ok) {K('throw new')} {F('BuildError')}(build.log);{'\n'}
      {'  '}{K('const')} review = {K('await')} {F('runChecks')}(build, {'{'} types: {K('true')}, e2e: {K('true')} {'}'});{'\n'}
      {'  '}{K('return')} {F('release')}(review.artifact, {S("'no vendor lock-in'")});{'\n'}
      {'}'}{'\n'}
      {'\n'}
      {C('// open-source or AWS Bedrock, you decide')}{'\n'}
      {K('const')} models = [{S("'llama-3'")}, {S("'mistral'")}, {S("'bedrock'")}] {K('as const')};{'\n'}
      {'\n'}
      {K('export const')} {F('integrate')} = ({'{'} stack, data {'}'}: Project) =&gt; {'{'}{'\n'}
      {'  '}{K('const')} pipeline = {F('buildPipeline')}(stack);{'\n'}
      {'  '}pipeline.{F('on')}({S("'commit'")}, (c) =&gt; {F('preview')}(c));{'\n'}
      {'  '}{K('return')} pipeline.{F('ship')}({'{'} transparent: {K('true')} {'}'});{'\n'}
      {'}'};{'\n'}
      {'\n'}
      {K('interface')} Release {'{'} url: string; status: {S("'ready'")}; region: string {'}'}{'\n'}
      {K('await')} {F('deploy')}(currentProject); {C('// production-ready, every time')}{'\n'}
      {'\n'}
    </>
  );
}

export default function CursorCode() {
  const ref = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Desktop / fine-pointer only; respect reduced motion.
    if (
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx;
    let cy = ty;
    let raf = 0;
    let visible = false;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!visible) {
        visible = true;
        el.style.opacity = '1';
      }
    };
    const onLeave = () => {
      visible = false;
      el.style.opacity = '0';
    };

    const loop = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      el.style.setProperty('--cx', `${cx}px`);
      el.style.setProperty('--cy', `${cy}px`);
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  // Repeat the block so the layer fills any viewport; overflow is clipped.
  return (
    <pre ref={ref} className="cursor-code" aria-hidden="true">
      {Array.from({ length: 10 }).map((_, i) => (
        <CodeBlock key={i} />
      ))}
    </pre>
  );
}
