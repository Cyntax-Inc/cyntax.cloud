import assert from 'node:assert/strict';
import test from 'node:test';
import { canWriteInPortal, isPortalReadOnly, ownsPortalResource } from '../lib/portalAccess.ts';
import { isActiveTicket, sortTickets } from '../lib/ticketPresentation.ts';

test('admin and unknown roles cannot write in the client portal', () => {
  for (const role of ['admin', ' Admin ', 'ADMIN', 'staff', null, undefined, '']) {
    assert.equal(canWriteInPortal(role), false);
    assert.equal(isPortalReadOnly(role), true);
  }
});

test('clients can create tickets and respond', () => {
  for (const role of ['client', ' Client ', 'CLIENT']) {
    assert.equal(canWriteInPortal(role), true);
    assert.equal(isPortalReadOnly(role), false);
  }
});

test('active tickets exclude resolved and closed requests', () => {
  assert.equal(isActiveTicket({id:'1', subject:'', status:'open'}), true);
  assert.equal(isActiveTicket({id:'1', subject:'', status:'waiting_on_client'}), true);
  assert.equal(isActiveTicket({id:'1', subject:'', status:'in_progress'}), true);
  assert.equal(isActiveTicket({id:'1', subject:'', status:'resolved'}), false);
  assert.equal(isActiveTicket({id:'1', subject:'', status:'closed'}), false);
});

test('tickets sort by priority, then status, then latest update', () => {
  const list = [
    {id:'normal', subject:'', priority:'Normal',status:'open',updatedAt:10},
    {id:'urgent-open', subject:'', priority:'Urgent',status:'open',updatedAt:10},
    {id:'urgent-wait-old', subject:'', priority:'Urgent',status:'waiting_on_client',updatedAt:10},
    {id:'urgent-wait-new', subject:'', priority:'Urgent',status:'waiting_on_client',updatedAt:20},
    {id:'high', subject:'', priority:'High',status:'in_progress',updatedAt:40},
  ];
  assert.deepEqual(list.sort(sortTickets).map((item) => item.id), [
    'urgent-wait-new','urgent-wait-old','urgent-open','high','normal',
  ]);
});

test("resource ownership is independent of role", () => {
  assert.equal(ownsPortalResource("owner-uid", "owner-uid"), true);
  assert.equal(ownsPortalResource("owner-uid", "other-uid"), false);
  assert.equal(ownsPortalResource("owner-uid", undefined), false);
});
