import _ from 'lodash';

export function extractMessages(e: any, defaultMessage: string) {
  if (!e) {
    return [];
  }
  switch (e.code) {
    case ('VALIDATION_FAILED'): {
      return extractValidationMessages(e, defaultMessage);
    }
  }
  return [e.message || defaultMessage];
}

function extractValidationMessages(e: any, defaultMessage: string): string[] {
  if (!e) {
    return [];
  }
  if (e.details) {
    return (e.details ?? []).map((d: any) => {
      const path = _.capitalize(_.trimStart((d?.path ?? '').replace('/', ' ')));
      return `${path} ${d?.message}`;
    });
  }
  return [e.message || defaultMessage];
}
