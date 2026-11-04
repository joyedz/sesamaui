import React from 'react';
import {AbsoluteFill, Composition, Easing, Img, Sequence, interpolate, registerRoot, staticFile, useCurrentFrame} from 'remotion';
import {button} from '../../../src/components/button.mjs';
import {badge} from '../../../src/components/badge.mjs';
import {inputField} from '../../../src/components/input.mjs';
import {metricCard} from '../../../src/blocks/metric-card.mjs';
import '../../../src/styles/components.css';
import '../../../src/styles/blocks.css';
import './video.css';

const FPS = 30;
const ease = Easing.bezier(.23, 1, .32, 1);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
type Props = {reducedMotion: boolean};
const scenes = [
  {start:0, end:4, label:'A SHARED UI LANGUAGE', title:'Your next interface.\nAlready taking shape.', sub:'Sesama UI'},
  {start:4, end:10, label:'COMPOSE', title:'Less setup. More building.', sub:'Components → blocks → one coherent interface.'},
  {start:10, end:15, label:'MODERN BY DESIGN', title:'Pure ESM. Zero dependencies.', sub:'Import what you use. Keep your stack.'},
  {start:15, end:20, label:'FRAMEWORK AGNOSTIC', title:'Your interface. Your architecture.', sub:'HTML builders. Browser, server, or build time.'},
  {start:20, end:25, label:'TYPESCRIPT READY', title:'A little guidance.\nA lot less guesswork.', sub:'Typed options. Discoverable APIs. Built-in declarations.'},
  {start:25, end:31, label:'ONE DESIGN LANGUAGE', title:'Consistent in every light.', sub:'Semantic tokens. Scoped CSS. Light and dark.'},
  {start:31, end:36, label:'BEYOND THE MARKUP', title:'Built to behave.', sub:'Keyboard navigation. Focus management. One mount() runtime.'},
  {start:36, end:40, label:'MADE TO BUILD ON', title:'Yours to inspect.\nYours to extend.', sub:'Open source · MIT licensed · Agent skill included'},
  {start:40, end:45, label:'SESAMA UI', title:'Build faster.\nKeep your freedom.', sub:'Start building with Sesama UI.'},
];
function Reveal({children, delay=0, reducedMotion=false, style={}}: React.PropsWithChildren<{delay?:number; reducedMotion?:boolean; style?:React.CSSProperties}>) {
  const f=useCurrentFrame();
  const p=interpolate(f,[delay,delay+18],[0,1],{...clamp,easing:ease});
  return <div style={{...style,opacity:p,transform:reducedMotion?'none':`translateY(${(1-p)*34}px) scale(${.97+.03*p})`}}>{children}</div>;
}
function Mark(){return <div className="brand"><Img src={staticFile('mark.svg')}/><span>sesama ui</span></div>;}
function Html({html}: {html:string}){return <div className="sui-root component" data-sui-theme="light" dangerouslySetInnerHTML={{__html:html}}/>;}
const tiles=[
  {name:'Actions',html:button({label:'Create project',variant:'primary',size:'base',icon:'plus'})},
  {name:'Forms',html:inputField({label:'Project name',value:'Something worth building',placeholder:'Project name'})},
  {name:'States',html:badge({label:'Ready to build',tone:'success',size:'base'})},
  {name:'Blocks',html:metricCard({id:'promo-metric',label:'Active projects',value:'24',change:'+6',tone:'success'})},
];
function Dashboard({dark=false,style={}}:{dark?:boolean;style?:React.CSSProperties}) {
 return <div className="product-window" style={style}><div className="window-bar"><i/><i/><i/><span>Sesama workspace / Overview</span></div><Img src={staticFile(dark?'dashboard-dark.png':'dashboard-light.png')} style={{width:'100%',display:'block'}}/></div>;
}
function Code({children}: React.PropsWithChildren){return <pre className="code"><span className="code-label">ES MODULE</span><code>{children}</code></pre>;}
function Scene({index,reducedMotion}: Props & {index:number}) {
 const f=useCurrentFrame(); const s=scenes[index];
 const duration=(s.end-s.start)*FPS;
 const out=interpolate(f,[duration-8,duration],[1,0],clamp);
 const dark=index===3 || index===7;
 return <AbsoluteFill className={`stage ${dark?'night':''}`} style={{opacity:out}}>
  <div className="grid-bg"/>
  <header><Mark/><span>DESIGNED TO WORK TOGETHER</span></header>
  <div className="copy"><Reveal reducedMotion={reducedMotion}><div className="eyebrow">{s.label}</div><h1>{s.title}</h1></Reveal><Reveal delay={5} reducedMotion={reducedMotion}><p>{s.sub}</p></Reveal></div>
  <div className="visual">
   {index===0 && <><div className="hero-halo"/><Reveal delay={8} reducedMotion={reducedMotion}><Dashboard style={{width:1160,transform:'perspective(1800px) rotateX(5deg) rotateY(-8deg)'}}/></Reveal><div className="floating-tag">One system. Your next idea.</div></>}
   {index===1 && <><div className="tile-grid" style={{opacity:interpolate(f,[70,95],[1,0],clamp),transform:`translateX(${reducedMotion?0:interpolate(f,[70,100],[0,-120],clamp)}px)`}}>{tiles.map((t,i)=><Reveal key={t.name} delay={i*2} reducedMotion={reducedMotion}><div className="tile"><small>{t.name}</small><Html html={t.html}/></div></Reveal>)}</div><div style={{position:'absolute',inset:0,opacity:interpolate(f,[78,105],[0,1],clamp),transform:`scale(${reducedMotion?1:interpolate(f,[78,110],[.94,1],{...clamp,easing:ease})})`}}><Dashboard style={{width:1160}}/></div></>}
   {index===2 && <Reveal delay={6} reducedMotion={reducedMotion}><Code>{`import { button } from 'sesama-ui/button';\n\nbutton({\n  label: 'Build something',\n  variant: 'primary'\n});`}</Code><div className="facts"><div><strong>ESM</strong><span>Native modules</span></div><div><strong>0</strong><span>Runtime dependencies</span></div><div><strong>HTML</strong><span>Pure builder output</span></div></div></Reveal>}
   {index===3 && <div className="architecture"><Reveal reducedMotion={reducedMotion}><div className="source-node">sesama-ui<span>Pure builders</span></div></Reveal><div className="connection"/><div className="targets">{['Browser','Server','Build time'].map((t,i)=><Reveal key={t} delay={10+i*2} reducedMotion={reducedMotion}><div className="target"><b>{['01','02','03'][i]}</b><strong>{t}</strong><span>{['Mount when interactive','Render without a DOM','Generate static HTML'][i]}</span></div></Reveal>)}</div></div>}
   {index===4 && <Reveal delay={5} reducedMotion={reducedMotion}><div className="editor"><Code>{`import { button, type ButtonOptions }\n  from 'sesama-ui';\n\nconst action: ButtonOptions = {\n  label: 'Create project',\n  variant: 'primary'\n};\n\nbutton(action);`}</Code><div className="autocomplete"><div>variant <span>ButtonVariant</span></div><strong>✓ 'primary'</strong><div>'secondary'</div><div>'outline'</div><div>'ghost'</div></div></div></Reveal>}
   {index===5 && <Reveal delay={5} reducedMotion={reducedMotion}><div className="theme-pair"><Dashboard style={{width:880,position:'absolute',left:0,top:0}}/><Dashboard dark style={{width:880,position:'absolute',left:300,top:110,opacity:interpolate(f,[35,60],[0,1],clamp)}}/></div><div className="theme-labels"><span>LIGHT</span><span>DARK</span><span>:where(.sui-root)</span></div></Reveal>}
   {index===6 && <Reveal delay={4} reducedMotion={reducedMotion}><div className="behavior"><div><div className="key">Tab</div><div className="focus-demo"><Html html={button({label:'Create project',variant:'primary',size:'lg'})}/></div><p>Clear focus. Predictable controls.</p></div><Code>{`const session = mount(root);\n\n// After replacing markup\nsession.refresh();\n\n// When the view leaves\nsession.destroy();`}</Code></div></Reveal>}
   {index===7 && <div className="open-grid">{[['MIT','Make it yours.'],['Source','Read every module.'],['Agent skill','Share the same UI language.']].map(([a,b],i)=><Reveal key={a} delay={i*2} reducedMotion={reducedMotion}><div className="open-card"><span>0{i+1}</span><h2>{a}</h2><p>{b}</p></div></Reveal>)}</div>}
   {index===8 && <Reveal delay={6} reducedMotion={reducedMotion}><div className="end-card"><Mark/><div className="install">npm install sesama-ui@alpha</div><p>github.com/joyedz/sesamaui</p><span>Open source · Currently in alpha</span></div></Reveal>}
  </div>
  <footer><span>SESAMA UI / PRODUCT FILM</span><span>{String(index+1).padStart(2,'0')} / 09</span></footer>
 </AbsoluteFill>;
}
function Promo(props:Props){return <AbsoluteFill style={{background:'#f5f5f0'}}>{scenes.map((s,i)=><Sequence key={s.start} from={s.start*FPS} durationInFrames={(s.end-s.start)*FPS}><Scene index={i} {...props}/></Sequence>)}</AbsoluteFill>;}
function Root(){return <><Composition id="SesamaPromo" component={Promo} durationInFrames={1350} fps={FPS} width={1920} height={1080} defaultProps={{reducedMotion:false}}/><Composition id="SesamaPromoReducedMotion" component={Promo} durationInFrames={1350} fps={FPS} width={1920} height={1080} defaultProps={{reducedMotion:true}}/></>;}
registerRoot(Root);
