import test from 'node:test';
import assert from 'node:assert/strict';
import { intakeSchema } from '../src/lib/intake-schema.ts';
const valid={name:'Test Operator',email:'operator@example.com',company:'Example Operations',revenue:'$5M–$10M',workflow:'Our staff manually reconciles delivery paperwork with shipment records.',systems:'Microsoft 365 and an ERP',timeline:'In 1–3 months',budget:'$2,500 audit first',website:''};
test('valid qualified intake is accepted and trimmed',()=>{const result=intakeSchema.parse({...valid,name:'  Test Operator  '});assert.equal(result.name,'Test Operator');});
test('empty, malformed, and unqualified submissions are rejected',()=>{for(const values of [{},{...valid,email:'not-an-email'},{...valid,workflow:'short'},{...valid,revenue:''},{...valid,systems:''},{...valid,budget:'arbitrary'}])assert.equal(intakeSchema.safeParse(values).success,false);});
test('oversized fields and filled honeypot are rejected',()=>{assert.equal(intakeSchema.safeParse({...valid,workflow:'x'.repeat(3001)}).success,false);assert.equal(intakeSchema.safeParse({...valid,website:'https://spam.example'}).success,false);});
