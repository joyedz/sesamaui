const assert=require('node:assert/strict'),fs=require('node:fs'),{spawn}=require('node:child_process');
const browserName=process.env.BROWSER||'chromium',browserType=require(process.env.PLAYWRIGHT_PATH||'playwright')[browserName];
const port=Number(process.env.TEST_PORT||4189),base=`http://127.0.0.1:${port}`;
const server=spawn(process.execPath,['tools/serve.mjs'],{env:{...process.env,PORT:String(port)},stdio:['ignore','pipe','pipe'],windowsHide:true});
let browser;
(async()=>{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.once('exit',code=>reject(Error('Server exited: '+code)));server.stdout.once('data',resolve);server.stderr.once('data',data=>reject(Error(String(data))));});
  browser=await browserType.launch({headless:true,...(browserName==='chromium'&&process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
  const page=await browser.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
  async function fixture(component){await page.goto(`${base}/tests/fixtures/components.html?component=${component}`);await page.waitForFunction(()=>window.fixtureReady);await page.evaluate(async()=>{window.api=await import('/src/index.mjs');});}
  await fixture('select');
  let result=await page.evaluate(()=>{
    window.form=document.getElementById('fixture-form');
    const roots=[...document.querySelectorAll('[data-sui-select]')];window.team=api.initSelect(roots[0]);window.locationSelect=api.initSelect(roots[1]);window.changeEvents=[];window.submits=0;
    document.addEventListener('sui:change',event=>changeEvents.push(event.detail));form.addEventListener('submit',()=>submits++);
    const data=Object.fromEntries(new FormData(form));const valid=form.checkValidity();form.requestSubmit();
    return {data,valid,submits,errorVisible:!roots[1].querySelector('[data-sui-select-error]').hidden};
  });
  assert.deepEqual(result,{data:{team:'design',location:''},valid:false,submits:0,errorVisible:true});
  result=await page.evaluate(()=>{locationSelect.setValue('Singapore');form.requestSubmit();return {valid:form.checkValidity(),submits,events:changeEvents,data:Object.fromEntries(new FormData(form))};});
  assert.deepEqual(result,{valid:true,submits:1,events:[],data:{team:'design',location:'Singapore'}});
  result=await page.evaluate(()=>{
    locationSelect.setCustomValidity('Team is temporarily unavailable.');const invalid=!form.checkValidity();
    locationSelect.setDisabled(true);const validDisabled=form.checkValidity(),data=Object.fromEntries(new FormData(form));locationSelect.open();
    const open=document.querySelectorAll(':popover-open').length;locationSelect.setDisabled(false);const invalidAgain=!form.checkValidity();locationSelect.setCustomValidity('');
    return {invalid,validDisabled,data,open,invalidAgain,valid:form.reportValidity()};
  });
  assert.deepEqual(result,{invalid:true,validDisabled:true,data:{team:'design'},open:0,invalidAgain:true,valid:true});
  result=await page.evaluate(async()=>{
    locationSelect.setValue('');locationSelect.setRequired(false);const optional=form.checkValidity();
    locationSelect.control.required=true;await Promise.resolve();const required=!form.checkValidity();
    const root=locationSelect.control.closest('[data-sui-select]'),fieldset=document.createElement('fieldset');root.before(fieldset);fieldset.append(root);fixtureSession.refresh();
    locationSelect.open();fieldset.disabled=true;await Promise.resolve();
    const whileDisabled={valid:form.checkValidity(),disabled:locationSelect.disabled,open:document.querySelectorAll(':popover-open').length,data:Object.fromEntries(new FormData(form))};
    fieldset.disabled=false;await Promise.resolve();locationSelect.setValue('Singapore');return {optional,required,whileDisabled,enabled:!locationSelect.disabled};
  });
  assert.deepEqual(result,{optional:true,required:true,whileDisabled:{valid:true,disabled:true,open:0,data:{team:'design'}},enabled:true});
  result=await page.evaluate(async()=>{
    changeEvents.length=0;locationSelect.control.value='Jakarta';locationSelect.control.dispatchEvent(new Event('change',{bubbles:true}));
    const label=locationSelect.control.closest('[data-sui-select]').querySelector('[data-sui-select-label]').textContent;
    form.addEventListener('reset',event=>event.preventDefault(),{once:true});form.reset();await Promise.resolve();const canceled=locationSelect.value;
    locationSelect.setCustomValidity('Server error');form.reset();await Promise.resolve();
    return {events:changeEvents,label,canceled,resetValue:locationSelect.value,defaultTeam:team.value,customError:locationSelect.control.validity.customError};
  });
  assert.deepEqual(result,{events:[{name:'location',value:'Jakarta',previousValue:'Singapore'}],label:'Jakarta',canceled:'Jakarta',resetValue:'',defaultTeam:'design',customError:false});
  result=await page.evaluate(()=>{
    const before=team.value;let threw=false;try{team.setValue('missing');}catch{threw=true;}
    form.noValidate=true;form.requestSubmit();form.noValidate=false;
    return {threw,unchanged:team.value===before,submits};
  });
  assert.deepEqual(result,{threw:true,unchanged:true,submits:2});
  result=await page.evaluate(()=>{
    const root=document.getElementById('fixture');root.innerHTML='<h1>Dynamic API</h1>'+api.select({name:'example',label:'Example',value:'D',options:[{label:'A',value:'B'},{label:'B',value:'C'},{label:'A',value:'D'}]});fixtureSession.refresh();
    window.dynamic=api.initSelect(root.querySelector('[data-sui-select]'));
    const initial={value:dynamic.value,selected:[...root.querySelectorAll('[role=option][aria-selected=true]')].map(node=>node.dataset.suiOption)};
    dynamic.setValue('C');const label=root.querySelector('[data-sui-select-label]').textContent;
    const nested=api.mount(root.querySelector('[data-sui-select]'));fixtureSession.destroy();const alive=!dynamic.destroyed;dynamic.open();const open=!!root.querySelector(':popover-open');nested.destroy();
    let stopped=false;try{dynamic.setValue('B');}catch{stopped=true;}
    window.remounted=api.mount(root);const replacement=api.initSelect(root.querySelector('[data-sui-select]'));
    let oldSessionStopped=false;try{fixtureSession.refresh();}catch{oldSessionStopped=true;}
    replacement.open();root.innerHTML='<h1>Replaced view</h1>'+api.inputField({label:'Name'});remounted.refresh();
    return {initial,label,alive,open,stopped,recreated:replacement!==dynamic,oldSessionStopped,oldTeamDestroyed:team.destroyed,removedOpenDestroyed:replacement.destroyed,noOrphanPopup:!document.querySelector(':popover-open')};
  });
  assert.deepEqual(result,{initial:{value:'D',selected:['D']},label:'B',alive:true,open:true,stopped:true,recreated:true,oldSessionStopped:true,oldTeamDestroyed:true,removedOpenDestroyed:true,noOrphanPopup:true});
  await fixture('field');
  result=await page.evaluate(async()=>{
    const root=document.querySelector('#fixture-password').closest('[data-sui-input-field]');window.password=api.initInput(root);const form=password.control.form;
    password.setValue('secret');root.querySelector('button').click();const revealed=password.control.type;
    form.addEventListener('reset',event=>event.preventDefault(),{once:true});form.reset();await Promise.resolve();const canceled={type:password.control.type,value:password.value};
    form.reset();await Promise.resolve();const reset={type:password.control.type,value:password.value,pressed:root.querySelector('button').getAttribute('aria-pressed')};
    password.setDisabled(true);const disabled=root.querySelector('button').disabled;password.control.disabled=false;await Promise.resolve();const enabled=!root.querySelector('button').disabled;
    password.setCustomValidity('Bad password');const invalid=!password.checkValidity();password.setCustomValidity('');password.setValue('new');
    const value=password.value;root.querySelector('button').click();password.destroy();window.passwordAgain=api.initInput(root);form.reset();await Promise.resolve();
    return {revealed,canceled,reset,disabled,enabled,invalid,value,remountedResetType:passwordAgain.control.type};
  });
  assert.deepEqual(result,{revealed:'text',canceled:{type:'text',value:'secret'},reset:{type:'password',value:'',pressed:'false'},disabled:true,enabled:true,invalid:true,value:'new',remountedResetType:'password'});
  await fixture('modal');
  result=await page.evaluate(async()=>{
    const node=document.getElementById('fixture-modal');window.dialogHandle=api.initModal(node);window.modalCloseEvents=[];node.addEventListener('sui:close',event=>modalCloseEvents.push(event.detail));
    dialogHandle.open();dialogHandle.close('confirm','saved');dialogHandle.open();await new Promise(resolve=>setTimeout(resolve,30));
    const reopened={open:node.open,inside:node.contains(document.activeElement),closed:[...modalCloseEvents]};
    node.close('native-result');dialogHandle.open();await new Promise(resolve=>setTimeout(resolve,30));const native={open:node.open,closed:[...modalCloseEvents]};
    dialogHandle.destroy();dialogHandle.destroy();let stopped=false;try{dialogHandle.open();}catch{stopped=true;}
    return {reopened,native,stopped,closed:modalCloseEvents.at(-1),open:node.open};
  });
  assert.deepEqual(result,{reopened:{open:true,inside:true,closed:[{reason:'confirm',returnValue:'saved'}]},native:{open:true,closed:[{reason:'confirm',returnValue:'saved'},{reason:'native',returnValue:'native-result'}]},stopped:true,closed:{reason:'destroy',returnValue:''},open:false});
  assert.deepEqual(errors,[]);fs.mkdirSync('.qa',{recursive:true});fs.writeFileSync(`.qa/functional-${browserName}.json`,JSON.stringify({browser:browserName,browserVersion:browser.version(),passed:true},null,2));
  console.log(`PASS ${browserName}: native form validation/data, submit, disabled/required, fieldsets, cancellation/reset, duplicate labels, setters/events, shared lifecycle, password reset, immediate modal reopen.`);
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(async()=>{await browser?.close();server.kill();});
