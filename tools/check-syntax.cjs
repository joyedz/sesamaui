const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const roots=[process.cwd(),path.join(process.cwd(),'tools')];let failed=false,count=0;
for(const root of roots)for(const name of fs.readdirSync(root)){if(!/\.(js|cjs|mjs)$/.test(name))continue;const file=path.join(root,name);if(!fs.statSync(file).isFile())continue;count++;const result=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});if(result.status!==0){failed=true;console.error(result.stderr)}}
console.log(`${count} JavaScript files checked.`);process.exitCode=failed?1:0;
