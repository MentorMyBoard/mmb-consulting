/**
 * "Go for IPO" interactive primer — ported from a self-contained HTML file
 * (MMB Knowledge Series). Kept as near-verbatim CSS/markup/runtime strings
 * rather than rewritten as JSX, so the original widget behavior (self-check,
 * quick sort, myth-or-fact, director scenario, stepper, quiz, scoring) is
 * preserved exactly. GoForIpoClient.tsx layers lead-capture + CTA popups on
 * top of this without touching the runtime's own logic.
 */

export const IPO_STYLES = `
.mmb-kp{
  --navy:#1C1A6E; --orange:#F7A21B; --orange-deep:#D98A0B; --cream:#FDEBD0; --stone:#F2EEEB;
  --text:#333333; --muted:#666666; --line:#DDDDDD; --good:#1F7A4D; --good-tint:#E5F3EC; --bad:#B83227; --bad-tint:#FBE9E7;
  --head:"Montserrat", "Segoe UI", Arial, sans-serif;
  --body:"Source Sans 3", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color:var(--text); background:#fff; font-family:var(--body); font-size:18px; line-height:1.65; -webkit-font-smoothing:antialiased;
}
.mmb-kp *, .mmb-kp *::before, .mmb-kp *::after{box-sizing:border-box}
.mmb-kp [hidden]{display:none !important}
.mmb-kp .kp-progress{position:sticky; top:0; z-index:20; height:4px; background:#EEE}
.mmb-kp .kp-progress span{display:block; height:100%; width:0; background:var(--orange)}
.mmb-kp .kp-col{max-width:860px; margin:0 auto; padding:0 24px 48px}

.mmb-kp .kp-cover{position:relative; color:#fff; padding:44px 48px 40px; margin:0 0 44px; overflow:hidden; background-color:#161412;
  background-image:repeating-linear-gradient(90deg, rgba(255,255,255,.035) 0 2px, transparent 2px 120px), linear-gradient(200deg, #3a342e 0%, #1d1a17 45%, #0f0e0d 100%);}
.mmb-kp .kp-cover::after{content:""; position:absolute; right:-80px; top:0; width:320px; height:100%; background:linear-gradient(90deg, transparent, rgba(255,255,255,.07)); transform:skewX(-8deg); pointer-events:none}
.mmb-kp .kp-cover.has-img::after{display:none}
.mmb-kp .kp-cover > *{position:relative; z-index:1}
.mmb-kp .kp-cover [data-slot="logo"]{display:block; margin-bottom:64px}
.mmb-kp .kp-logo{display:inline-flex; align-items:center; gap:12px}
.mmb-kp .kp-logo-mark{width:46px; height:46px; position:relative; display:block}
.mmb-kp .kp-logo-mark i{position:absolute; width:18px; height:18px; background:var(--orange); border-radius:3px}
.mmb-kp .kp-logo-mark i:nth-child(1){left:14px; top:2px; transform:rotate(20deg)}
.mmb-kp .kp-logo-mark i:nth-child(2){left:26px; top:16px; transform:rotate(65deg); background:#F9B54A}
.mmb-kp .kp-logo-mark i:nth-child(3){left:12px; top:26px; transform:rotate(110deg)}
.mmb-kp .kp-logo-mark i:nth-child(4){left:2px; top:12px; transform:rotate(155deg); background:#F9B54A}
.mmb-kp .kp-logo-text b, .mmb-kp .kp-logo-text span, .mmb-kp .kp-logo-text small{display:block; font-family:var(--head)}
.mmb-kp .kp-logo-text b{font-weight:800; font-size:34px; line-height:1; color:#fff}
.mmb-kp .kp-logo-text span{font-weight:500; font-size:14px; line-height:1.2; color:#fff}
.mmb-kp .kp-logo-text small{font-size:11px; color:#AAA}
.mmb-kp .kp-logo.dark .kp-logo-text b, .mmb-kp .kp-logo.dark .kp-logo-text span{color:var(--navy)}
.mmb-kp .kp-logo-img{display:block; width:auto; max-width:100%}
.mmb-kp .kp-cover h1{font-family:var(--head); font-weight:800; color:var(--orange); text-transform:uppercase; font-size:clamp(44px,8vw,78px); line-height:1.05; letter-spacing:-.01em; margin:0 0 28px}
.mmb-kp .kp-kicker{font-family:var(--head); font-weight:700; font-size:16px; margin:0 0 22px}
.mmb-kp .kp-subline{border-left:3px solid var(--orange); padding:4px 0 4px 24px; margin:0 0 34px}
.mmb-kp .kp-subline p{font-family:var(--head); font-weight:700; font-size:clamp(26px,4vw,40px); line-height:1.15; margin:0}
.mmb-kp .kp-chips{display:flex; flex-wrap:wrap; gap:14px; margin-bottom:40px}
.mmb-kp .kp-chips span{border:2px solid var(--orange); background:rgba(0,0,0,.55); color:#B9C6F0; padding:12px 20px; font-size:17px}
.mmb-kp .kp-byline{font-style:italic; font-size:17px; line-height:1.5; margin:0}
.mmb-kp .kp-why{margin-top:18px}
.mmb-kp .kp-why-btn{color:var(--orange); font-size:15px; text-decoration:underline; text-underline-offset:3px; cursor:pointer}
.mmb-kp .kp-why-text{margin:10px 0 0; font-size:15.5px; color:#DDD; max-width:60ch}

.mmb-kp .kp-pill{display:inline-block; background:var(--cream); color:#333; font-size:13px; letter-spacing:.02em; padding:4px 10px; margin:40px 0 6px; text-transform:uppercase}
.mmb-kp h2{font-family:var(--head); font-weight:800; color:var(--navy); font-size:clamp(26px,3.6vw,34px); line-height:1.2; margin:44px 0 14px}
.mmb-kp .kp-pill + h2{margin-top:4px}
.mmb-kp h3{font-family:var(--head); font-weight:700; font-size:19px; line-height:1.3; color:#333; margin:0 0 6px}
.mmb-kp .kp-orange-h{font-family:var(--head); font-weight:700; color:var(--orange); font-size:22px; margin:28px 0 10px}
.mmb-kp p{margin:0 0 14px}
.mmb-kp strong{font-weight:700; color:#222}
.mmb-kp a{color:var(--orange-deep); font-weight:700}

.mmb-kp .kp-grid{display:grid; grid-template-columns:1fr 1fr; gap:18px; margin:18px 0 22px}
.mmb-kp .kp-grid.kp-grid-3{grid-template-columns:repeat(3,1fr)}
.mmb-kp .kp-stone{background:var(--stone); padding:18px 20px}
.mmb-kp .kp-stone p, .mmb-kp .kp-num p, .mmb-kp .kp-edge p{margin:0; font-size:17px; line-height:1.55}
.mmb-kp .kp-num .n{font-family:var(--head); font-weight:300; color:#555; font-size:15px; display:block; padding-bottom:6px; border-bottom:2px solid var(--orange); margin-bottom:10px}
.mmb-kp .kp-edge{border:1px solid var(--line); border-left:6px solid var(--orange); padding:18px 20px; border-radius:3px}
.mmb-kp .kp-note{background:var(--cream); padding:20px 24px 20px 56px; margin:24px 0; position:relative; font-size:17.5px; line-height:1.6}
.mmb-kp .kp-note::before{content:""; position:absolute; left:22px; top:24px; width:14px; height:14px; border:2px solid #B7791F; border-radius:2px; border-bottom-right-radius:6px}
.mmb-kp .kp-note p:last-child{margin:0}
.mmb-kp .kp-note .lbl{font-family:var(--head); font-weight:700; display:block; margin-bottom:4px}
.mmb-kp .kp-table{width:100%; border-collapse:collapse; border:1px solid #E6E6E6; font-size:17px; margin:14px 0 22px}
.mmb-kp .kp-table th, .mmb-kp .kp-table td{text-align:left; padding:14px 18px; border-bottom:1px solid #E6E6E6; vertical-align:top}
.mmb-kp .kp-table th{font-weight:700; color:#222}
.mmb-kp .kp-navybox{background:var(--navy); color:#fff; padding:22px 24px}
.mmb-kp .kp-navybox h3{color:#fff}
.mmb-kp .kp-navybox p{margin:0; font-size:17px}

.mmb-kp .kp-fig{margin:28px 0}
.mmb-kp .kp-fig img{display:block; width:100%; height:auto}
.mmb-kp .kp-fig.small img{max-width:380px; margin:0 auto}
.mmb-kp .kp-fig.wide{margin-left:-24px; margin-right:-24px}
.mmb-kp .kp-fig figcaption{font-size:14.5px; color:var(--muted); margin-top:8px; border-left:3px solid var(--orange); padding-left:10px}
.mmb-kp .kp-quote{margin:30px 0; padding:6px 0 6px 28px; border-left:4px solid var(--orange)}
.mmb-kp .kp-quote p{font-family:var(--head); font-weight:700; color:var(--navy); font-size:22px; line-height:1.4; margin:0 0 8px}
.mmb-kp .kp-quote cite{display:block; font-style:normal; color:var(--muted); font-size:15px}
.mmb-kp .kp-stats{display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:18px; margin:26px 0; border-top:2px solid var(--orange); padding-top:18px}
.mmb-kp .kp-stats b{display:block; font-family:var(--head); font-weight:800; color:var(--orange); font-size:40px; line-height:1.1}
.mmb-kp .kp-stats span{display:block; font-size:15.5px; color:#444}
.mmb-kp .kp-divider{border:0; height:4px; width:80px; background:var(--orange); margin:36px 0}
.mmb-kp .kp-cta{margin:22px 0}
.mmb-kp a.kp-cta-btn{display:inline-block; background:var(--orange); color:#1A1A1A; font-family:var(--head); font-weight:700; font-size:15px; padding:12px 22px; text-decoration:none; border-radius:3px}
.mmb-kp .kp-banner{background:var(--navy); color:#fff; padding:28px 30px; margin:34px 0; border-left:6px solid var(--orange)}
.mmb-kp .kp-banner h3{color:var(--orange); font-size:22px}
.mmb-kp .kp-banner p{color:#E4E3F5}
.mmb-kp .kp-banner .kp-cta{margin:16px 0 0}

.mmb-kp .kp-act{border:1px solid var(--line); margin:34px 0; border-top:4px solid var(--orange)}
.mmb-kp .kp-act-head{background:var(--navy); color:#fff; padding:16px 24px}
.mmb-kp .kp-act-head h3{color:#fff; margin:0; font-size:19px}
.mmb-kp .kp-act-head p{margin:4px 0 0; font-size:15.5px; color:#D3D2EE}
.mmb-kp .kp-act-tag{display:inline-block; font-family:var(--head); font-size:11.5px; font-weight:700; color:var(--navy); background:var(--orange); padding:2px 8px; margin-bottom:8px; text-transform:uppercase; letter-spacing:.04em}
.mmb-kp .kp-act-body{padding:20px 24px 24px; font-size:16.5px; line-height:1.55}
.mmb-kp button{font-family:var(--body); font-size:15.5px; cursor:pointer; border-radius:3px}
.mmb-kp .kp-btn{background:var(--orange); color:#1A1A1A; border:2px solid var(--orange); padding:9px 18px; font-weight:700; font-family:var(--head); font-size:14px}
.mmb-kp .kp-btn:hover{filter:brightness(1.08)}
.mmb-kp .kp-btn-ghost{background:#fff; color:var(--navy); border:2px solid var(--navy); padding:8px 16px; font-weight:700; font-family:var(--head); font-size:14px}
.mmb-kp .kp-btn-ghost:hover{background:#EEEDF7}
.mmb-kp button:focus-visible, .mmb-kp input:focus-visible + span, .mmb-kp a:focus-visible, .mmb-kp [role="button"]:focus-visible{outline:3px solid var(--navy); outline-offset:2px}
.mmb-kp .kp-rate{border:0; margin:0 0 14px; padding:0 0 14px; border-bottom:1px solid #EEE}
.mmb-kp .kp-rate legend{padding:0; margin-bottom:8px; font-weight:600; color:#222}
.mmb-kp .kp-scale{display:flex; flex-wrap:wrap; gap:8px}
.mmb-kp .kp-scale label{position:relative}
.mmb-kp .kp-scale input{position:absolute; opacity:0; width:1px; height:1px}
.mmb-kp .kp-scale span{display:inline-block; padding:6px 14px; border:1px solid var(--line); font-size:15px; cursor:pointer; background:#fff}
.mmb-kp .kp-scale input:checked + span{background:var(--navy); color:#fff; border-color:var(--navy)}
.mmb-kp .kp-small{font-size:14.5px; color:var(--muted); margin:10px 0 0}
.mmb-kp .kp-compare{margin-top:16px}
.mmb-kp .kp-cmp-row{margin-bottom:14px}
.mmb-kp .kp-cmp-row p{margin:0 0 4px; font-weight:600; font-size:15.5px}
.mmb-kp .kp-bar{display:grid; grid-template-columns:62px 1fr; align-items:center; gap:8px; font-size:13.5px; color:var(--muted); margin-bottom:3px}
.mmb-kp .kp-bar i{display:block; height:10px; background:#D9D6D2}
.mmb-kp .kp-bar i.after{background:var(--orange)}
.mmb-kp .kp-sort-item{padding:14px 0; border-bottom:1px solid #EEE}
.mmb-kp .kp-sort-item > p{margin:0 0 8px}
.mmb-kp .kp-choices{display:flex; gap:8px; flex-wrap:wrap}
.mmb-kp .kp-choices button.is-right{background:var(--good); border-color:var(--good); color:#fff}
.mmb-kp .kp-choices button.is-wrong{background:var(--bad); border-color:var(--bad); color:#fff}
.mmb-kp .kp-feedback{margin:8px 0 0; font-size:15.5px; padding:10px 14px; background:var(--stone)}
.mmb-kp .kp-feedback.good{background:var(--good-tint)}
.mmb-kp .kp-feedback.bad{background:var(--bad-tint)}
.mmb-kp .kp-tally{font-family:var(--head); font-weight:700; color:var(--navy); margin:14px 0 0}
.mmb-kp .kp-myths{display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:14px}
.mmb-kp .kp-myth{border:2px solid var(--orange); padding:16px 16px 18px; display:flex; flex-direction:column}
.mmb-kp .kp-myth > p{font-family:var(--head); font-weight:700; font-size:16px; line-height:1.4; margin:0 0 14px; flex:1; color:#222}
.mmb-kp .kp-verdict{font-size:15px; line-height:1.5}
.mmb-kp .kp-verdict b{font-family:var(--head)}
.mmb-kp .kp-verdict b.myth{color:var(--bad)}
.mmb-kp .kp-verdict b.fact{color:var(--good)}
.mmb-kp .kp-brief{background:var(--cream); padding:16px 18px; margin-bottom:14px; font-style:italic; font-size:17px}
.mmb-kp .kp-opt{display:flex; gap:10px; align-items:flex-start; padding:10px 14px; border:1px solid var(--line); margin-bottom:8px; cursor:pointer}
.mmb-kp .kp-opt input{margin-top:5px; accent-color:var(--navy)}
.mmb-kp .kp-opt:has(input:checked){border-color:var(--navy); background:#F4F3FA}
.mmb-kp .kp-steps{display:grid; grid-template-columns:repeat(auto-fit,minmax(80px,1fr)); gap:8px; margin-bottom:18px; position:relative}
.mmb-kp .kp-steps::before{content:""; position:absolute; left:6%; right:6%; top:22px; height:6px; background:var(--orange); opacity:.35}
.mmb-kp .kp-steps button{background:none; border:0; padding:0; text-align:center; font-family:var(--head); font-weight:700; font-size:12.5px; color:var(--muted); line-height:1.3; position:relative}
.mmb-kp .kp-steps button b{display:flex; align-items:center; justify-content:center; width:50px; height:50px; margin:0 auto 6px; border-radius:50%; background:#fff; border:3px solid var(--orange); color:#333; font-size:18px}
.mmb-kp .kp-steps button.seen b{background:#FCD9A0}
.mmb-kp .kp-steps button[aria-selected="true"]{color:var(--navy)}
.mmb-kp .kp-steps button[aria-selected="true"] b{background:var(--orange); color:#1A1A1A}
.mmb-kp .kp-step-panel{border:1px solid var(--line); padding:16px 20px; min-height:120px}
.mmb-kp .kp-step-panel h4{font-family:var(--head); font-weight:700; color:var(--navy); margin:0 0 6px; font-size:17px}
.mmb-kp .kp-step-panel p{margin:0}
.mmb-kp .kp-step-nav{display:flex; justify-content:space-between; margin-top:14px}
.mmb-kp .kp-q{padding:16px 0; border-bottom:1px solid #EEE; display:grid; grid-template-columns:40px 1fr; gap:0 14px}
.mmb-kp .kp-q .qn{display:flex; align-items:center; justify-content:center; width:36px; height:36px; background:var(--stone); font-family:var(--head); font-weight:700; font-size:18px; color:#444}
.mmb-kp .kp-q > div > p{font-weight:600; margin:4px 0 10px; color:#222}
.mmb-kp .kp-q .kp-choices{flex-direction:column}
.mmb-kp .kp-q .kp-choices button{text-align:left; background:#fff; color:#333; border:1px solid var(--line); padding:9px 12px}
.mmb-kp .kp-q .kp-choices button:hover:not(:disabled){border-color:var(--orange)}
.mmb-kp .kp-score{margin-top:18px; padding:16px 20px; background:var(--navy); color:#fff}
.mmb-kp .kp-score p{margin:0}
.mmb-kp .kp-score strong{color:var(--orange); font-family:var(--head); font-size:24px}
.mmb-kp .term-wrap{position:relative; display:inline}
.mmb-kp .term{border-bottom:2px dotted var(--orange); cursor:help}
.mmb-kp .term-pop{position:absolute; left:0; top:calc(100% + 6px); z-index:15; width:min(300px,80vw); background:var(--navy); color:#fff; font-size:15px; line-height:1.5; padding:10px 12px; border-top:3px solid var(--orange); box-shadow:0 6px 18px rgba(28,26,110,.25); font-weight:400}

.mmb-kp .kp-next{display:block; margin:40px 0 0; border-top:2px solid #BBB; padding-top:18px}
.mmb-kp .kp-next p{margin:0 0 4px; font-size:15px; color:var(--muted)}
.mmb-kp .kp-next a{font-family:var(--head); font-size:20px; color:var(--navy); text-decoration:none; border-bottom:2px solid var(--orange)}
.mmb-kp .kp-tagline{font-family:var(--head); font-weight:800; color:var(--orange); text-align:center; font-size:clamp(22px,3.4vw,30px); line-height:1.25; margin:44px 0 28px}
.mmb-kp .kp-contact{display:flex; justify-content:space-between; gap:24px; flex-wrap:wrap; font-family:var(--head); font-weight:500; color:var(--navy); font-size:15px; line-height:1.5; padding-bottom:16px; border-bottom:2px solid var(--navy)}
.mmb-kp .kp-contact .lab{display:block; color:var(--orange); font-weight:500; font-size:14px; margin-bottom:2px}
.mmb-kp .kp-contact [data-bind]{white-space:pre-line}
.mmb-kp .kp-foot{display:flex; justify-content:space-between; align-items:center; gap:16px; padding:16px 0 0; font-family:var(--head); font-weight:700; color:var(--navy)}
.mmb-kp .kp-foot .kp-logo-mark{transform:scale(.8)}
.mmb-kp .kp-foot .kp-logo-text b{font-size:28px}
.mmb-kp .kp-disclaimer{margin-top:22px; font-size:13.5px; color:var(--muted); line-height:1.55}

@media (max-width:700px){
  .mmb-kp{font-size:17px}
  .mmb-kp .kp-cover{padding:28px 22px 30px}
  .mmb-kp .kp-cover [data-slot="logo"]{margin-bottom:40px}
  .mmb-kp .kp-grid, .mmb-kp .kp-grid.kp-grid-3{grid-template-columns:1fr}
  .mmb-kp .kp-steps{grid-template-columns:repeat(3,1fr); row-gap:14px}
  .mmb-kp .kp-steps::before{display:none}
  .mmb-kp .kp-table th, .mmb-kp .kp-table td{padding:10px 12px}
  .mmb-kp .kp-fig.wide{margin-left:0; margin-right:0}
}
@media (prefers-reduced-motion:reduce){ .mmb-kp *{transition:none !important} }
`;

export const IPO_MARKUP = `
<div class="mmb-kp" id="mmb-ipo-primer">
  <div class="kp-progress" aria-hidden="true"><span></span></div>
  <header class="kp-cover">
    <span data-slot="logo"></span>
    <h1>What Is<br>an IPO?</h1>
    <p class="kp-kicker">The IPO Playbook: Module 1, Part 1</p>
    <div class="kp-subline"><p>A 5-Minute Primer for<br>First-Time Investors</p></div>
    <div class="kp-chips"><span>Beginner</span><span>5-min read</span><span>Self-check</span><span>6-question quiz</span></div>
    <p class="kp-byline">MMB Knowledge Series<br>MentorMyBoard</p>
    <div class="kp-why">
      <span class="kp-why-btn" role="button" tabindex="0" aria-expanded="false">Did you know? Why an IPO's first document is called a "red herring"</span>
      <p class="kp-why-text" hidden="">The name comes from the bold red warning once printed on the cover of preliminary prospectuses, saying the details were not final. In India, the Red Herring Prospectus is filed before the issue opens and does not carry the final price. By the end of this series, you will know how to read one.</p>
    </div>
  </header>

  <article class="kp-col" id="kp-article">
    <span class="kp-pill">Introduction</span>
    <h2>Key Takeaways</h2>
    <div class="kp-grid kp-grid-3">
      <div class="kp-stone"><h3>01 First sale</h3><p>An IPO is the first time a private company sells its shares to the public.</p></div>
      <div class="kp-stone"><h3>02 Listing</h3><p>Once listed, those shares trade on a stock exchange like the BSE or NSE.</p></div>
      <div class="kp-stone"><h3>03 Accountability</h3><p>Going public brings money and visibility, and with them, accountability.</p></div>
    </div>

    <section class="kp-act">
      <div class="kp-act-head"><span class="kp-act-tag">Self-check</span><h3>Before you read: where do you stand?</h3><p>Rate yourself honestly. You'll rate yourself again at the end and see how far you moved.</p></div>
      <div class="kp-act-body" data-widget="pre"></div>
    </section>

    <span class="kp-pill">Part One</span>
    <h2>Start With a Simple Story</h2>
    <p>Meet Asha. Ten years ago, she started a small packaged-foods business in Pune. She put in her savings, and a few friends invested too. The business grew. Today it sells across five states.</p>
    <p>Now Asha wants to build two new factories. That needs ₹200 crore. Banks will lend some, but not all. Her early investors also want to cash out part of their stake.</p>
    <div class="kp-note"><p>So Asha asks a bigger question: <em>What if the public could own a piece of my company?</em> That question is the beginning of an IPO.</p></div>

    <h2>So, What Exactly Is an IPO?</h2>
    <p><strong>IPO stands for Initial Public Offering.</strong> It is the first time a company offers its shares to the public.</p>
    <table class="kp-table">
      <thead><tr><th>Stage</th><th>Who owns it</th><th>Who can buy shares</th></tr></thead>
      <tbody>
        <tr><td>Before the IPO: <strong>Private</strong></td><td>Founders, employees, a few investors</td><td>Only by private arrangement</td></tr>
        <tr><td>After the IPO: <strong>Listed</strong></td><td>Thousands of public shareholders</td><td>Anyone with a <span class="term-wrap"><span class="term" role="button" tabindex="0" aria-expanded="false">demat account</span><span class="term-pop" role="tooltip" hidden="">An electronic account that holds your shares, much like a bank account holds your money. You need one to invest in an IPO.</span></span>, on a <span class="term-wrap"><span class="term" role="button" tabindex="0" aria-expanded="false">stock exchange</span><span class="term-pop" role="tooltip" hidden="">A regulated marketplace where listed shares are bought and sold. India's two main exchanges are the BSE and the NSE.</span></span></td></tr>
      </tbody>
    </table>
    <p>Think of it this way. Before the IPO, the company is a family home. After the IPO, it becomes a building with many owners, and every owner has a right to know how it is being run.</p>

    <h2>Primary Market vs Secondary Market</h2>
    <p>This is the one distinction every beginner must understand.</p>
    <div class="kp-grid">
      <div class="kp-navybox"><h3>Primary market</h3><p>Where the IPO happens. You buy shares directly from the company, or from existing shareholders selling in the IPO. The money goes to them.</p></div>
      <div class="kp-edge"><h3>Secondary market</h3><p>Everything after listing. You buy shares from other investors on the exchange. The company receives nothing from these trades.</p></div>
    </div>

    <section class="kp-act">
      <div class="kp-act-head"><span class="kp-act-tag">Quick sort</span><h3>Primary or secondary?</h3><p>Five real-life situations. Pick the market for each.</p></div>
      <div class="kp-act-body" data-widget="sort"></div>
    </section>

    <span class="kp-pill">Part Two</span>
    <h2>Why Do Companies Go Public?</h2>
    <div class="kp-grid">
      <div class="kp-num"><span class="n">01</span><h3>To raise capital</h3><p>Money for expansion, new plants, technology or repaying debt.</p></div>
      <div class="kp-num"><span class="n">02</span><h3>To give early investors an exit</h3><p>Founders, private equity funds and angel investors can sell part of their holding.</p></div>
      <div class="kp-num"><span class="n">03</span><h3>To build credibility</h3><p>A listed company often finds it easier to win customers, partners and lenders.</p></div>
      <div class="kp-num"><span class="n">04</span><h3>To reward employees</h3><p>Listed shares make stock options (ESOPs) valuable and easy to sell.</p></div>
      <div class="kp-num"><span class="n">05</span><h3>To use shares as currency</h3><p>Listed shares can be used to acquire other companies.</p></div>
    </div>

    <section class="kp-act">
      <div class="kp-act-head"><span class="kp-act-tag">Myth or fact</span><h3>Three things many first-time investors believe</h3><p>Decide for yourself, then reveal the answer.</p></div>
      <div class="kp-act-body" data-widget="myths"></div>
    </section>

    <h2>What Does a Company Give Up?</h2>
    <p>Going public is not free. The company takes on real obligations:</p>
    <div class="kp-grid">
      <div class="kp-edge"><h3>Disclosure</h3><p>Results every quarter, material events reported promptly and public annual reports.</p></div>
      <div class="kp-edge"><h3>Scrutiny</h3><p>Analysts, media, regulators and thousands of shareholders now watch every move.</p></div>
      <div class="kp-edge"><h3>Cost</h3><p>Merchant bankers, lawyers, auditors and ongoing compliance all cost money.</p></div>
      <div class="kp-edge"><h3>Less control</h3><p>The founder now answers to minority shareholders and an independent board.</p></div>
    </div>
    <p>This is why not every successful business should go public, and why the decision begins in the boardroom.</p>

    <section class="kp-act">
      <div class="kp-act-head"><span class="kp-act-tag">Think like a director</span><h3>You sit on Asha's board. What do you advise?</h3><p>Pick the advice you would give, then see how a director would think about it.</p></div>
      <div class="kp-act-body" data-widget="dir"></div>
    </section>

    <div class="kp-note"><span class="lbl">Governance Lens</span><p>An IPO is a governance event before it is a market event. Well before listing, companies must strengthen their boards: appointing Independent Directors, forming Audit and Nomination &amp; Remuneration Committees, and cleaning up related-party dealings. A company that treats governance as paperwork before listing often struggles after it. A company that builds genuine board oversight earns lasting investor trust.</p></div>

    <span class="kp-pill">Part Three</span>
    <h2>Who Oversees IPOs in India?</h2>
    <p>In India, IPOs are regulated by the <strong>Securities and Exchange Board of India (SEBI)</strong>. The main rulebook is the <strong>SEBI (Issue of Capital and Disclosure Requirements) Regulations, 2018</strong>, usually called the ICDR Regulations.</p>
    <p>SEBI does not decide whether an IPO is a good investment. Its job is to ensure the company <strong>discloses</strong> what investors need to know. The decision to invest is always yours.</p>
    <p class="kp-orange-h">Regulatory Check</p>
    <table class="kp-table">
      <tbody>
        <tr><th style="width:34%">Framework</th><td>SEBI (ICDR) Regulations, 2018</td></tr>
        <tr><th>Listing timeline</th><td>Shares list within 3 working days after the issue closes (T+3), mandatory since December 2023</td></tr>
        <tr><th>Last verified</th><td>[Insert date before publishing]</td></tr>
      </tbody>
    </table>

    <h2>The IPO Journey, Step by Step</h2>
    <p>Tap through the six stages to see how shares travel from the boardroom to your demat account.</p>
    <section class="kp-act">
      <div class="kp-act-head"><span class="kp-act-tag">Explore</span><h3>From filing to listing</h3><p>We'll unpack every stage in detail in Module 2.</p></div>
      <div class="kp-act-body" data-widget="steps"></div>
    </section>

    <h2>A Word of Caution for First-Time Investors</h2>
    <p>IPOs make headlines. Oversubscription figures and listing-day gains create excitement. But excitement is not analysis.</p>
    <p>Some IPOs create wealth for years. Others fall below their issue price on day one and stay there. The difference usually lies in the details: the business, the valuation and the people running it.</p>
    <div class="kp-note"><p>The rest of this series will show you how to read those details.</p></div>

    <span class="kp-pill">Test Yourself</span>
    <section class="kp-act">
      <div class="kp-act-head"><span class="kp-act-tag">Quiz</span><h3>6 questions on IPO basics</h3><p>Answers and explanations appear as you go.</p></div>
      <div class="kp-act-body" data-widget="quiz"></div>
    </section>

    <section class="kp-act">
      <div class="kp-act-head"><span class="kp-act-tag">Self-check</span><h3>After reading: how far did you move?</h3><p>Rate the same statements again.</p></div>
      <div class="kp-act-body" data-widget="post"></div>
    </section>

    <span class="kp-pill">Conclusion</span>
    <h2>Quick Recap</h2>
    <div class="kp-grid">
      <div class="kp-num"><span class="n">01</span><p>An <strong>IPO</strong> is a company's first sale of shares to the public.</p></div>
      <div class="kp-num"><span class="n">02</span><p>It happens in the <strong>primary market</strong>. All later trading is in the <strong>secondary market</strong>.</p></div>
      <div class="kp-num"><span class="n">03</span><p>Companies go public for <strong>capital, exits, credibility and growth</strong>.</p></div>
      <div class="kp-num"><span class="n">04</span><p>In return, they accept <strong>disclosure, scrutiny and accountability</strong>.</p></div>
      <div class="kp-num"><span class="n">05</span><p><strong>SEBI</strong> regulates the process, but the investment decision is yours.</p></div>
    </div>

    <nav class="kp-next" aria-label="Series navigation"><p>Next in the series</p><a href="#">Why Companies Go Public (and Why Some Shouldn't)</a></nav>

    <p class="kp-tagline">Understand the Offer.<br>Read the Board. Invest with Clarity.</p>
    <div class="kp-contact">
      <div><span class="lab">Address:</span><div data-bind="address"></div></div>
      <div><span class="lab">Reach Us:</span><div data-bind="email"></div><div data-bind="phone"></div></div>
    </div>
    <div class="kp-foot"><span data-slot="logo" data-variant="dark"></span><span data-bind="website"></span></div>
    <p class="kp-disclaimer">This article is for educational purposes only and does not constitute investment advice or a recommendation to buy or sell any security. Please consult a SEBI-registered investment adviser before making investment decisions. © MentorMyBoard.</p>
  </article>
</div>
`;

/** Function declaration only (no IIFE wrapper / no invocation) — invoked explicitly at runtime with live data. */
export const IPO_RUNTIME_FN_SRC = `
function mmbRuntime(root, D){
  if(!root) return;
  var s = D.settings || {};
  function esc(t){ return String(t == null ? '' : t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function rich(t){ return esc(t).replace(/\\*\\*(.+?)\\*\\*/g,'<strong>$1</strong>'); }
  function el(tag, cls, html){ var n = document.createElement(tag); if(cls) n.className = cls; if(html !== undefined) n.innerHTML = html; return n; }
  function q(sel){ return root.querySelector(sel); }
  function fam(n){ return '"' + n + '", "Segoe UI", Arial, sans-serif'; }

  root.style.setProperty('--orange', s.orange || '#F7A21B');
  root.style.setProperty('--navy', s.navy || '#1C1A6E');
  root.style.setProperty('--head', fam(s.headFont || 'Montserrat'));
  root.style.setProperty('--body', fam(s.bodyFont || 'Source Sans 3'));

  var cover = q('.kp-cover');
  if(cover){
    if(s.coverImg){
      var dk = Number(s.coverDark == null ? 0.6 : s.coverDark);
      cover.style.backgroundImage = 'linear-gradient(rgba(0,0,0,' + dk + '),rgba(0,0,0,' + dk + ')), url("' + String(s.coverImg).replace(/"/g,'%22') + '")';
      cover.style.backgroundSize = 'cover'; cover.style.backgroundPosition = 'center';
      cover.classList.add('has-img');
    } else {
      cover.style.backgroundImage = ''; cover.style.backgroundSize = ''; cover.style.backgroundPosition = '';
      cover.classList.remove('has-img');
    }
  }

  root.querySelectorAll('[data-slot="logo"]').forEach(function(slot){
    var dark = slot.getAttribute('data-variant') === 'dark';
    var h = Number(s.logoH || 56); if(dark) h = Math.round(h * 0.8);
    var logo = dark && s.logoDark ? s.logoDark : (dark ? null : s.logo);
    slot.innerHTML = logo
      ? '<img class="kp-logo-img" src="' + esc(logo) + '" alt="MentorMyBoard logo" style="height:' + h + 'px">'
      : '<span class="kp-logo' + (dark ? ' dark' : '') + '"><span class="kp-logo-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="kp-logo-text"><b>MMB</b><span>MentorMyBoard</span><small>ISO 9001-2015</small></span></span>';
  });
  root.querySelectorAll('[data-bind]').forEach(function(b){ b.textContent = s[b.getAttribute('data-bind')] || ''; });

  function closeTerms(except){
    root.querySelectorAll('.term-pop').forEach(function(p){
      if(p === except) return;
      p.setAttribute('hidden','');
      var t = p.parentNode.querySelector('.term'); if(t) t.setAttribute('aria-expanded','false');
    });
  }
  if(!root.__kpBound){
    root.__kpBound = true;
    root.addEventListener('click', function(e){
      var why = e.target.closest('.kp-why-btn');
      if(why){
        var t = q('.kp-why-text');
        if(t){ var open = t.hasAttribute('hidden'); if(open) t.removeAttribute('hidden'); else t.setAttribute('hidden',''); why.setAttribute('aria-expanded', open ? 'true' : 'false'); }
        return;
      }
      var term = e.target.closest('.term');
      if(term){
        e.stopPropagation();
        var pop = term.parentNode.querySelector('.term-pop'); if(!pop) return;
        var opening = pop.hasAttribute('hidden');
        closeTerms(pop);
        if(opening){ pop.removeAttribute('hidden'); term.setAttribute('aria-expanded','true'); }
        else { pop.setAttribute('hidden',''); term.setAttribute('aria-expanded','false'); }
      }
    });
    root.addEventListener('keydown', function(e){
      var t = e.target;
      if((e.key === 'Enter' || e.key === ' ') && t.matches && t.matches('.term, .kp-why-btn') && !t.isContentEditable){ e.preventDefault(); t.click(); }
      if(e.key === 'Escape') closeTerms(null);
    });
    document.addEventListener('click', function(e){ if(!(e.target.closest && e.target.closest('.term-pop'))) closeTerms(null); });
    var bar = q('.kp-progress span'), art = q('.kp-col');
    var onScroll = function(){
      if(!bar || !art) return;
      var r = art.getBoundingClientRect(), total = r.height - window.innerHeight;
      var p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1;
      bar.style.width = (p * 100) + '%';
    };
    window.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('resize', onScroll);
    onScroll();
  }

  var self = D.self || [];
  var scale = String(D.selfScale || '').split(',').map(function(x){ return x.trim(); }).filter(Boolean);
  if(!scale.length) scale = ['Not yet','Somewhat','Confident'];
  var ratings = {pre:[], post:[]};
  ['pre','post'].forEach(function(key){
    var box = q('[data-widget="' + key + '"]'); if(!box) return;
    box.innerHTML = '';
    self.forEach(function(it, i){
      var fs = el('fieldset','kp-rate');
      fs.appendChild(el('legend', null, rich(it.text)));
      var sc = el('div','kp-scale');
      scale.forEach(function(lbl, v){
        var l = el('label'), inp = document.createElement('input');
        inp.type = 'radio'; inp.name = 'kp-' + key + '-' + i; inp.value = String(v);
        inp.addEventListener('change', function(){ ratings[key][i] = v; });
        l.appendChild(inp); l.appendChild(el('span', null, esc(lbl))); sc.appendChild(l);
      });
      fs.appendChild(sc); box.appendChild(fs);
    });
    if(key === 'pre'){ box.appendChild(el('p','kp-small','Your answers stay on this page only. Nothing is stored or shared.')); return; }
    var btn = el('button','kp-btn','Compare with my starting point'); btn.type = 'button';
    var out = el('div','kp-compare'); out.setAttribute('aria-live','polite');
    btn.addEventListener('click', function(){
      var n = self.length;
      var postN = ratings.post.filter(function(x){ return x !== undefined; }).length;
      var preN = ratings.pre.filter(function(x){ return x !== undefined; }).length;
      if(postN < n){ out.innerHTML = '<p class="kp-feedback bad">Rate every statement above, then compare.</p>'; return; }
      if(!q('[data-widget="pre"]')){ out.innerHTML = '<p class="kp-feedback good">Thanks for rating yourself. Keep going with the next part of the series.</p>'; return; }
      if(preN < n){ out.innerHTML = '<p class="kp-feedback bad">Your starting ratings are incomplete. Scroll up to the first self-check, rate every statement, then compare.</p>'; return; }
      var html = '', gain = 0;
      self.forEach(function(it, i){
        var b = ratings.pre[i], a = ratings.post[i]; gain += (a - b);
        html += '<div class="kp-cmp-row"><p>' + rich(it.text) + '</p>' +
          '<div class="kp-bar"><span>Before</span><i style="width:' + ((b + 1) / scale.length * 100) + '%"></i></div>' +
          '<div class="kp-bar"><span>After</span><i class="after" style="width:' + ((a + 1) / scale.length * 100) + '%"></i></div></div>';
      });
      var msg = gain > 0 ? 'You moved up ' + gain + (gain === 1 ? ' step' : ' steps') + ' across the statements. That is progress worth building on.'
                         : 'Your confidence held steady. Revisit any section that still feels unclear, then carry on.';
      out.innerHTML = html + '<p class="kp-feedback good">' + msg + '</p>';
    });
    box.appendChild(btn); box.appendChild(out);
  });

  var sbox = q('[data-widget="sort"]');
  if(sbox && D.sort){
    sbox.innerHTML = '';
    var items = D.sort.items || [], labels = {A: D.sort.a || 'Option A', B: D.sort.b || 'Option B'};
    var sScore = 0, sDone = 0;
    var tally = el('p','kp-tally','Score: 0 of ' + items.length); tally.setAttribute('aria-live','polite');
    items.forEach(function(item){
      var wrap = el('div','kp-sort-item'); wrap.appendChild(el('p', null, rich(item.q)));
      var ch = el('div','kp-choices'), fb = el('p','kp-feedback'); fb.hidden = true;
      var correct = labels[item.ans] || labels.A;
      ['A','B'].forEach(function(k){
        var b = el('button','kp-btn-ghost', esc(labels[k])); b.type = 'button';
        b.addEventListener('click', function(){
          var right = labels[k] === correct;
          ch.querySelectorAll('button').forEach(function(x){ x.disabled = true; if(x.textContent === correct) x.classList.add('is-right'); });
          if(!right) b.classList.add('is-wrong');
          fb.className = 'kp-feedback ' + (right ? 'good' : 'bad');
          fb.innerHTML = '<strong>' + (right ? 'Correct. ' : 'Not quite. It is ' + esc(correct) + '. ') + '</strong>' + rich(item.why);
          fb.hidden = false;
          if(right) sScore++; sDone++;
          tally.textContent = 'Score: ' + sScore + ' of ' + items.length + (sDone === items.length ? (sScore === items.length ? '. Perfect sort.' : '. Review the explanations above.') : '');
        });
        ch.appendChild(b);
      });
      wrap.appendChild(ch); wrap.appendChild(fb); sbox.appendChild(wrap);
    });
    sbox.appendChild(tally);
  }

  var mbox = q('[data-widget="myths"]');
  if(mbox){
    mbox.innerHTML = '';
    var grid = el('div','kp-myths');
    (D.myths || []).forEach(function(m){
      var card = el('div','kp-myth'); card.appendChild(el('p', null, rich(m.s)));
      var btn = el('button','kp-btn-ghost','Reveal the answer'); btn.type = 'button';
      var isFact = String(m.v).toLowerCase() === 'fact';
      var ans = el('div','kp-verdict','<b class="' + (isFact ? 'fact' : 'myth') + '">' + (isFact ? 'Fact.' : 'Myth.') + '</b> ' + rich(m.e)); ans.hidden = true;
      btn.addEventListener('click', function(){ ans.hidden = false; btn.hidden = true; });
      card.appendChild(btn); card.appendChild(ans); grid.appendChild(card);
    });
    mbox.appendChild(grid);
  }

  var dbox = q('[data-widget="dir"]');
  if(dbox && D.dir){
    dbox.innerHTML = '';
    if(D.dir.brief) dbox.appendChild(el('p','kp-brief', rich(D.dir.brief)));
    var nm = 'kp-dir-' + Math.random().toString(36).slice(2, 8);
    var opts = D.dir.options || [];
    opts.forEach(function(o, i){
      var l = el('label','kp-opt'), inp = document.createElement('input');
      inp.type = 'radio'; inp.name = nm; inp.value = String(i);
      l.appendChild(inp); l.appendChild(el('span', null, rich(o.t))); dbox.appendChild(l);
    });
    var go = el('button','kp-btn', esc(D.dir.button || 'Give my advice')); go.type = 'button';
    var dout = el('div','kp-feedback'); dout.hidden = true; dout.setAttribute('aria-live','polite');
    go.addEventListener('click', function(){
      var sel = dbox.querySelector('input[name="' + nm + '"]:checked');
      if(!sel){ dout.className = 'kp-feedback bad'; dout.innerHTML = 'Choose one option above first.'; dout.hidden = false; return; }
      var o = opts[Number(sel.value)], good = o.good === 'yes';
      dout.className = 'kp-feedback ' + (good ? 'good' : 'bad');
      dout.innerHTML = (o.lead ? '<strong>' + esc(o.lead) + '</strong> ' : '') + rich(o.fb);
      dout.hidden = false;
    });
    dbox.appendChild(go); dbox.appendChild(dout);
  }

  var tbox = q('[data-widget="steps"]');
  if(tbox){
    tbox.innerHTML = '';
    var steps = D.steps || [];
    if(steps.length){
      var tabs = el('div','kp-steps'); tabs.setAttribute('role','tablist');
      var panel = el('div','kp-step-panel'); panel.setAttribute('role','tabpanel'); panel.setAttribute('aria-live','polite');
      var nav = el('div','kp-step-nav');
      var prev = el('button','kp-btn-ghost','Previous stage'); prev.type = 'button';
      var next = el('button','kp-btn','Next stage'); next.type = 'button';
      var cur = 0;
      var btns = steps.map(function(st, i){
        var b = el('button', null, '<b>' + (i + 1) + '</b>' + esc(st.t)); b.type = 'button'; b.setAttribute('role','tab');
        b.addEventListener('click', function(){ show(i); }); tabs.appendChild(b); return b;
      });
      var show = function(i){
        cur = i;
        btns.forEach(function(b, j){ b.setAttribute('aria-selected', j === i ? 'true' : 'false'); b.tabIndex = j === i ? 0 : -1; if(j < i) b.classList.add('seen'); });
        panel.innerHTML = '<h4>Stage ' + (i + 1) + ' of ' + steps.length + ': ' + esc(steps[i].t) + '</h4><p>' + rich(steps[i].d) + '</p>';
        prev.style.visibility = i === 0 ? 'hidden' : 'visible';
        next.textContent = i === steps.length - 1 ? 'Back to stage 1' : 'Next stage';
      };
      prev.addEventListener('click', function(){ if(cur > 0) show(cur - 1); });
      next.addEventListener('click', function(){ show(cur === steps.length - 1 ? 0 : cur + 1); });
      tabs.addEventListener('keydown', function(e){
        if(e.key === 'ArrowRight'){ show((cur + 1) % steps.length); btns[cur].focus(); }
        if(e.key === 'ArrowLeft'){ show((cur - 1 + steps.length) % steps.length); btns[cur].focus(); }
      });
      nav.appendChild(prev); nav.appendChild(next);
      tbox.appendChild(tabs); tbox.appendChild(panel); tbox.appendChild(nav);
      show(0);
    }
  }

  var qbox = q('[data-widget="quiz"]');
  if(qbox){
    qbox.innerHTML = '';
    var quiz = D.quiz || [], qScore = 0, qDone = 0;
    var score = el('div','kp-score','<p>Answered 0 of ' + quiz.length + '</p>'); score.setAttribute('aria-live','polite');
    quiz.forEach(function(item, qi){
      var wrap = el('div','kp-q'); wrap.appendChild(el('span','qn', String(qi + 1)));
      var inner = el('div'); inner.appendChild(el('p', null, rich(item.q)));
      var ch = el('div','kp-choices'), fb = el('p','kp-feedback'); fb.hidden = true;
      var ans = Number(item.a) || 1;
      [1,2,3,4].forEach(function(k){
        var txt = item['o' + k]; if(!txt) return;
        var b = el('button', null, esc(txt)); b.type = 'button'; b.setAttribute('data-k', String(k));
        b.addEventListener('click', function(){
          var right = k === ans;
          ch.querySelectorAll('button').forEach(function(x){ x.disabled = true; if(Number(x.getAttribute('data-k')) === ans) x.classList.add('is-right'); });
          if(!right) b.classList.add('is-wrong');
          fb.className = 'kp-feedback ' + (right ? 'good' : 'bad');
          fb.innerHTML = '<strong>' + (right ? 'Correct. ' : 'Not quite. ') + '</strong>' + rich(item.e);
          fb.hidden = false;
          if(right) qScore++; qDone++;
          if(qDone < quiz.length){ score.innerHTML = '<p>Answered ' + qDone + ' of ' + quiz.length + '</p>'; return; }
          var r = qScore / quiz.length;
          var verdict = r === 1 ? 'Excellent. You have mastered the basics.' : r >= 0.6 ? 'Strong foundation. Review the questions you missed.' : 'Worth a second read. Revisit the sections above and try again.';
          score.innerHTML = '<p><strong>' + qScore + ' of ' + quiz.length + '</strong></p><p>' + verdict + '</p>';
        });
        ch.appendChild(b);
      });
      inner.appendChild(ch); inner.appendChild(fb); wrap.appendChild(inner); qbox.appendChild(wrap);
    });
    qbox.appendChild(score);
  }
}
`;

export const IPO_DATA = {
  settings: {
    logo: '',
    logoDark: '',
    logoH: 56,
    orange: '#F7A21B',
    navy: '#1C1A6E',
    headFont: 'Montserrat',
    bodyFont: 'Source Sans 3',
    coverImg: '',
    coverDark: 0.6,
    email: 'community@mentormyboard.in',
    phone: '+91 73041 45928',
    address: 'Office No. 207, Building 3, Sector III, MBP Road, Millennium\nBusiness Park, Mahape, Navi Mumbai, Maharashtra 400710',
    website: 'mentormyboard.com',
  },
  self: [
    { text: 'I can explain what an IPO is to a friend.' },
    { text: 'I know the difference between the primary and secondary market.' },
    { text: 'I understand why a company might choose to go public, or not.' },
    { text: 'I know what role SEBI plays in an IPO.' },
  ],
  selfScale: 'Not yet, Somewhat, Confident',
  sort: {
    a: 'Primary',
    b: 'Secondary',
    items: [
      { q: "Ravi applies for shares in a company's IPO using a UPI mandate on his banking app.", ans: 'A', why: 'Ravi is buying in the IPO itself, directly from the issuer.' },
      { q: 'Meera buys 50 shares of a company that listed on the NSE three years ago.', ans: 'B', why: 'The company is already listed. Meera buys from another investor, and the company receives nothing.' },
      { q: "A founder sells part of his stake through the Offer for Sale (OFS) portion of his company's IPO.", ans: 'A', why: 'It happens as part of the IPO, so it is primary. But note: the money goes to the founder, not to the company.' },
      { q: 'On listing day, after trading opens, two investors trade shares with each other.', ans: 'B', why: 'Once shares list and trading begins, every trade is in the secondary market.' },
      { q: 'An employee sells her ESOP shares on the exchange two years after listing.', ans: 'B', why: 'She sells to other investors on the exchange. The company is not a party to the trade.' },
    ],
  },
  myths: [
    { s: '"If SEBI has cleared an IPO, it must be a good investment."', v: 'Myth', e: 'SEBI checks that the company has disclosed what investors need to know. It does not judge whether the price is fair or the business is sound. That judgment is yours.' },
    { s: '"All the money raised in an IPO goes to the company."', v: 'Myth', e: 'Only the fresh issue portion goes to the company. Money from the Offer for Sale goes to the existing shareholders who are selling. Always check the split in the offer document.' },
    { s: '"A heavily oversubscribed IPO always lists with a gain."', v: 'Myth', e: 'High demand often helps, but it is no guarantee. Several heavily subscribed IPOs have listed below their issue price. Demand is not the same as value.' },
  ],
  dir: {
    brief: "\"Sales are growing fast and the market is hot. We buy most of our packaging from my brother's firm, and our board is just me, my husband and one investor. I want to file the IPO papers next month. What do you think?\"",
    button: 'Give my advice',
    options: [
      { t: 'File next month. A hot market may not last.', good: 'no', lead: 'Risky advice.', fb: 'A hot market does not fix weak foundations. With no independent directors and large dealings with a family firm, the offer document will raise red flags, investors will question the numbers, and regulators may ask hard questions. Timing the market is no substitute for readiness.' },
      { t: "Fix governance first: appoint independent directors, form committees and review the dealings with the brother's firm. Then file.", good: 'yes', lead: "This is the director's answer.", fb: 'Before filing, the board needs independent directors, an Audit Committee and a Nomination & Remuneration Committee. The dealings with the brother\'s firm must be reviewed, priced at arm\'s length and fully disclosed. Governance done early makes the IPO smoother and earns lasting investor trust.' },
      { t: 'Stay private for good. Listing is more trouble than it is worth.', good: 'no', lead: 'A valid choice for some companies, but not the right advice here.', fb: "Asha needs ₹200 crore and her early investors want an exit. Staying private is legitimate, but the board's job is to help her get ready for listing, not to rule it out." },
    ],
  },
  steps: [
    { t: 'File the draft', d: 'The company, with its merchant bankers, files a draft offer document called the **DRHP** (Draft Red Herring Prospectus) with SEBI. It covers the business, financials, risks, promoters and how the money will be used.' },
    { t: 'SEBI review', d: 'SEBI reviews the DRHP and shares its observations. The company answers questions and updates its disclosures. This can take a few months.' },
    { t: 'Price band', d: 'The company files the **RHP** and announces a price band, for example ₹300 to ₹315 per share, along with the lot size: the minimum number of shares you can apply for.' },
    { t: 'Issue opens', d: 'The issue usually stays open for 3 working days. Investors apply through their bank or broker, often using a **UPI mandate** that blocks, but does not deduct, the money.' },
    { t: 'Allotment', d: 'After the issue closes, the registrar finalises who gets shares. If the issue is oversubscribed, retail allotment is often decided by lottery. Money is unblocked for those who get nothing.' },
    { t: 'Listing', d: 'Shares are credited to demat accounts and **list** on the exchange within 3 working days of the issue closing (T+3). From this moment, the shares trade in the secondary market.' },
  ],
  quiz: [
    { q: 'When you apply for shares in an IPO, you are buying in the:', o1: 'Secondary market', o2: 'Primary market', o3: 'Derivatives market', o4: 'Grey market', a: '2', e: 'An IPO is a primary market transaction. You buy from the company or from shareholders selling in the offer.' },
    { q: "A year after its IPO, you buy shares of a company on the NSE. Who receives your money?", o1: 'The company', o2: 'SEBI', o3: 'The investor who sold the shares', o4: 'The merchant banker', a: '3', e: 'Once listed, trades happen between investors in the secondary market. The company receives nothing.' },
    { q: "What is SEBI's main role in an IPO?", o1: 'To guarantee investors a profit', o2: 'To decide the issue price', o3: 'To ensure proper disclosure to investors', o4: 'To buy unsubscribed shares', a: '3', e: 'SEBI ensures investors get the information they need. It does not judge whether the IPO is a good investment.' },
    { q: 'Which of these is NOT a usual reason for a company to go public?', o1: 'Raising capital for expansion', o2: 'Giving early investors an exit', o3: 'Reducing the information it must disclose', o4: 'Using listed shares to acquire other companies', a: '3', e: 'Listing increases disclosure. Quarterly results, event reporting and public annual reports all come with it.' },
    { q: 'The first offer document a company files with SEBI is called the:', o1: 'DRHP', o2: 'Annual report', o3: 'Balance sheet', o4: 'Allotment letter', a: '1', e: 'The Draft Red Herring Prospectus (DRHP) is the first filing. SEBI reviews it before the issue can proceed.' },
    { q: 'Under current rules, shares list on the exchange within how many working days after the issue closes?', o1: '1 day', o2: '3 days', o3: '6 days', o4: '15 days', a: '2', e: 'India moved to a T+3 listing timeline, mandatory since December 2023.' },
  ],
};
