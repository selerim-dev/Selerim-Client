import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const source=fs.readFileSync(new URL('../src/lib/form-submit.ts',import.meta.url),'utf8');
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
function delivery({key='test-only',status=200,success=true,fail=false}={}){const sent=[];const exports={};vm.runInNewContext(compiled,{exports,URLSearchParams,AbortSignal,process:{env:{NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY:key}},fetch:async(url,options)=>{sent.push({url,fields:Object.fromEntries(options.body)});if(fail)throw new Error('Network failure');return Response.json({success},{status});}});return {send:exports.submitWebsiteForm,sent};}
test('missing configuration does not claim delivery',async()=>{const d=delivery({key:''});await assert.rejects(()=>d.send({email:'example@example.com'}));assert.equal(d.sent.length,0);});
test('provider and network errors do not produce false success',async()=>{for(const settings of [{status:400,success:false},{status:200,success:false},{fail:true}]){const d=delivery(settings);await assert.rejects(()=>d.send({email:'example@example.com'}));}});
test('successful delivery preserves qualification and uses supported browser transport',async()=>{const d=delivery();const result=await d.send({name:'Test Operator',email:'example@example.com',company:'Example',revenue:'$5M–$10M',systems:'ERP',message:'Test only'});assert.equal(result.success,true);assert.equal(d.sent[0].url,'https://api.web3forms.com/submit');assert.equal(d.sent[0].fields.revenue,'$5M–$10M');assert.equal(d.sent[0].fields.systems,'ERP');assert.equal(d.sent[0].fields.botcheck,'');});
