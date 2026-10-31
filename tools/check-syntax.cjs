const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
let failed=false,count=0;
function walk(root){for(const entry of fs.readdirSync(root,{withFileTypes:true})){if(entry.name.startsWith('.')||['node_modules','assets','dist'].includes(entry.name))continue;const file=path.join(root,entry.name);if(entry.isDirectory()){walk(file);continue}if(!/\.(js|cjs|mjs)$/.test(entry.name))continue;count++;const result=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});if(result.status!==0){failed=true;console.error(result.stderr)}}}
walk(process.cwd());
console.log(`${count} JavaScript files checked.`);process.exitCode=failed?1:0;
