const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
type FormPayload = Record<string, string>;

/** Browser-only delivery, as required by the existing Web3Forms integration. */
export async function submitWebsiteForm(payload: FormPayload) {
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
  if (!accessKey) throw new Error('Please email admin@selerim.com to request your audit.');
  const response = await fetch(WEB3FORMS_ENDPOINT, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: new URLSearchParams({ ...payload, access_key: accessKey, botcheck: '' }),
    signal: AbortSignal.timeout(20000),
  });
  const result = await response.json();
  if (!response.ok || result.success !== true) {
    throw new Error('We could not confirm delivery. Please try again or email admin@selerim.com.');
  }
  return result;
}
