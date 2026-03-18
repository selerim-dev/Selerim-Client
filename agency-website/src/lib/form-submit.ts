const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

type FormPayload = Record<string, string>;

type Web3FormsResponse = {
  success: boolean;
  message?: string;
};

function getAccessKey() {
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    throw new Error('Form submissions are not configured yet. Add NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY to enable the live form endpoint.');
  }

  return accessKey;
}

export async function submitWebsiteForm(payload: FormPayload) {
  const accessKey = getAccessKey();

  const response = await fetch(WEB3FORMS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      access_key: accessKey,
      botcheck: '',
      ...payload,
    }),
  });

  const result = (await response.json()) as Web3FormsResponse;

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Unable to submit the form right now.');
  }

  return result;
}
