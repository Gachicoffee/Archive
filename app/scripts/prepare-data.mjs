import { existsSync, mkdirSync, copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
const original=resolve('..','archive_data.json');
mkdirSync('public',{recursive:true});
if(existsSync(original))copyFileSync(original,'public/archive_data.json');
else if(!existsSync('public/archive_data.json'))throw new Error('archive_data.json is required in the repository root or public folder.');
